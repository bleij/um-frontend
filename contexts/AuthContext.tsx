import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export type UserRole =
  | "parent"
  | "youth"
  | "child"
  | "young-adult"
  | "mentor"
  | "org"
  | "teacher"
  | "admin";

export interface AuthUser {
  id: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

interface PendingRegistration {
  phone: string;
  password: string;
  firstName: string;
  lastName?: string;
}

interface AuthActionResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  pendingRegistration: PendingRegistration | null;
  verificationCodePlaceholder: string;
  startRegistration: (
    payload: PendingRegistration,
  ) => Promise<AuthActionResult>;
  completeRegistration: (role: UserRole) => Promise<AuthActionResult>;
  loginWithPhone: (payload: {
    phone: string;
    password: string;
    verificationCode: string;
  }) => Promise<AuthActionResult>;
  setUserRole: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  devLogin: (role: UserRole) => Promise<void>;
  devMode: boolean;
  setDevMode: (enabled: boolean) => Promise<void>;
}

interface LocalUserRecord {
  id: string;
  phone: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

const AUTH_USER_KEY = "um_auth_user_v1";
const USER_ROLE_KEY = "user_role";
const LOCAL_USERS_KEY = "um_local_users_v1";
const DEV_MODE_KEY = "um_dev_mode";
const PLACEHOLDER_VERIFICATION_CODE = "1234";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizePhone(rawPhone: string) {
  return rawPhone.replace(/\D/g, "");
}

function toPseudoEmail(phone: string) {
  return `${normalizePhone(phone)}@phone.um.local`;
}

function toAuthUser(input: {
  id: string;
  phone: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}): AuthUser {
  return {
    id: input.id,
    phone: normalizePhone(input.phone),
    role: input.role,
    firstName: input.firstName?.trim() || "Пользователь",
    lastName: input.lastName?.trim() || "",
  };
}

function parseRole(value: string | null | undefined): UserRole {
  const allowed: UserRole[] = [
    "parent",
    "youth",
    "child",
    "young-adult",
    "mentor",
    "org",
    "teacher",
  ];

  if (value && allowed.includes(value as UserRole)) {
    return value as UserRole;
  }

  return "parent";
}

async function getLocalUsers(): Promise<LocalUserRecord[]> {
  const raw = await AsyncStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as LocalUserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveLocalUsers(users: LocalUserRecord[]) {
  await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

async function persistAuthUser(user: AuthUser | null) {
  if (!user) {
    await AsyncStorage.multiRemove([AUTH_USER_KEY, USER_ROLE_KEY]);
    return;
  }

  await AsyncStorage.multiSet([
    [AUTH_USER_KEY, JSON.stringify(user)],
    [USER_ROLE_KEY, user.role],
  ]);
}

async function fetchRemoteProfile(userId: string) {
  if (!supabase || !isSupabaseConfigured) return null;

  const response = await supabase
    .from("um_user_profiles")
    .select("phone, role, first_name, last_name")
    .eq("id", userId)
    .maybeSingle();

  if (response.error) {
    return null;
  }

  return response.data;
}

async function upsertRemoteProfile(user: AuthUser) {
  if (!supabase || !isSupabaseConfigured) return;

  await supabase.from("um_user_profiles").upsert(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
}

async function hydrateFromSupabaseUser(sessionUser: SupabaseUser) {
  const metadata = sessionUser.user_metadata ?? {};
  const remoteProfile = await fetchRemoteProfile(sessionUser.id);

  const phone =
    (remoteProfile?.phone as string | null) ||
    (metadata.phone as string | undefined) ||
    "";

  if (!phone) return null;

  return toAuthUser({
    id: sessionUser.id,
    phone,
    role: parseRole(
      (remoteProfile?.role as string | null) ||
        (metadata.role as string | undefined),
    ),
    firstName:
      (remoteProfile?.first_name as string | null) ||
      (metadata.first_name as string | undefined),
    lastName:
      (remoteProfile?.last_name as string | null) ||
      (metadata.last_name as string | undefined),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingRegistration, setPendingRegistration] =
    useState<PendingRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [devMode, setDevModeState] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [rawUser, rawDevMode] = await Promise.all([
          AsyncStorage.getItem(AUTH_USER_KEY),
          AsyncStorage.getItem(DEV_MODE_KEY),
        ]);

        if (rawDevMode !== null) {
          setDevModeState(rawDevMode === "true");
        }

        if (rawUser) {
          try {
            const parsed = JSON.parse(rawUser) as AuthUser;
            setUser(parsed);
          } catch {
            await AsyncStorage.removeItem(AUTH_USER_KEY);
          }
        }

        if (supabase && isSupabaseConfigured) {
          const sessionResponse = await supabase.auth.getSession();
          const sessionUser = sessionResponse.data.session?.user;

          if (sessionUser) {
            const hydratedUser = await hydrateFromSupabaseUser(sessionUser);

            if (hydratedUser) {
              setUser(hydratedUser);
              await persistAuthUser(hydratedUser);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const startRegistration = useCallback(
    async (payload: PendingRegistration): Promise<AuthActionResult> => {
      const phone = normalizePhone(payload.phone);

      if (phone.length < 10) {
        return { success: false, error: "Введите корректный номер телефона" };
      }

      if (payload.password.length < 6) {
        return {
          success: false,
          error: "Пароль должен содержать минимум 6 символов",
        };
      }

      if (!payload.firstName.trim()) {
        return { success: false, error: "Введите имя" };
      }

      setPendingRegistration({
        phone,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
      });

      return { success: true };
    },
    [],
  );

  const completeRegistration = useCallback(
    async (role: UserRole): Promise<AuthActionResult> => {
      if (!pendingRegistration) {
        return {
          success: false,
          error: "Сессия регистрации истекла. Повторите регистрацию.",
        };
      }

      const normalizedPhone = normalizePhone(pendingRegistration.phone);

      if (supabase && isSupabaseConfigured) {
        const email = toPseudoEmail(normalizedPhone);

        const signUpResponse = await supabase.auth.signUp({
          email,
          password: pendingRegistration.password,
          options: {
            data: {
              phone: normalizedPhone,
              role,
              first_name: pendingRegistration.firstName,
              last_name: pendingRegistration.lastName || "",
            },
          },
        });

        if (signUpResponse.error) {
          return {
            success: false,
            error: signUpResponse.error.message,
          };
        }

        let remoteUser = signUpResponse.data.user;

        if (!remoteUser) {
          const signInResponse = await supabase.auth.signInWithPassword({
            email,
            password: pendingRegistration.password,
          });

          if (signInResponse.error || !signInResponse.data.user) {
            return {
              success: false,
              error:
                signInResponse.error?.message ||
                "Не удалось завершить регистрацию",
            };
          }

          remoteUser = signInResponse.data.user;
        }

        const nextUser = toAuthUser({
          id: remoteUser.id,
          phone: normalizedPhone,
          role,
          firstName: pendingRegistration.firstName,
          lastName: pendingRegistration.lastName,
        });

        await upsertRemoteProfile(nextUser);
        await persistAuthUser(nextUser);

        setUser(nextUser);
        setPendingRegistration(null);

        return { success: true };
      }

      const users = await getLocalUsers();
      const existing = users.find((entry) => entry.phone === normalizedPhone);

      if (existing) {
        return {
          success: false,
          error: "Пользователь с таким номером уже зарегистрирован",
        };
      }

      const localUser: LocalUserRecord = {
        id: `local_${Date.now()}`,
        phone: normalizedPhone,
        password: pendingRegistration.password,
        role,
        firstName: pendingRegistration.firstName,
        lastName: pendingRegistration.lastName?.trim() || "",
      };

      await saveLocalUsers([...users, localUser]);

      const nextUser = toAuthUser(localUser);
      await persistAuthUser(nextUser);

      setUser(nextUser);
      setPendingRegistration(null);

      return { success: true };
    },
    [pendingRegistration],
  );

  const loginWithPhone = useCallback(
    async (payload: {
      phone: string;
      password: string;
      verificationCode: string;
    }): Promise<AuthActionResult> => {
      const normalizedPhone = normalizePhone(payload.phone);

      if (payload.verificationCode !== PLACEHOLDER_VERIFICATION_CODE) {
        return {
          success: false,
          error: "Неверный код подтверждения",
        };
      }

      if (supabase && isSupabaseConfigured) {
        const email = toPseudoEmail(normalizedPhone);

        const signInResponse = await supabase.auth.signInWithPassword({
          email,
          password: payload.password,
        });

        if (signInResponse.error || !signInResponse.data.user) {
          return {
            success: false,
            error: "Неверный номер телефона или пароль",
          };
        }

        const nextUser =
          (await hydrateFromSupabaseUser(signInResponse.data.user)) ||
          toAuthUser({
            id: signInResponse.data.user.id,
            phone: normalizedPhone,
            role: parseRole(
              signInResponse.data.user.user_metadata?.role as
                | string
                | undefined,
            ),
            firstName:
              (signInResponse.data.user.user_metadata?.first_name as
                | string
                | undefined) || "Пользователь",
            lastName:
              (signInResponse.data.user.user_metadata?.last_name as
                | string
                | undefined) || "",
          });

        await persistAuthUser(nextUser);
        setUser(nextUser);

        return { success: true };
      }

      const users = await getLocalUsers();
      const localUser = users.find(
        (entry) =>
          entry.phone === normalizedPhone &&
          entry.password === payload.password,
      );

      if (!localUser) {
        return {
          success: false,
          error: "Неверный номер телефона или пароль",
        };
      }

      const nextUser = toAuthUser(localUser);
      await persistAuthUser(nextUser);
      setUser(nextUser);

      return { success: true };
    },
    [],
  );

  const setUserRole = useCallback(
    async (role: UserRole) => {
      if (!user) return;

      const nextUser = { ...user, role };

      setUser(nextUser);
      await persistAuthUser(nextUser);

      if (supabase && isSupabaseConfigured) {
        await supabase.auth.updateUser({ data: { role } });
        await upsertRemoteProfile(nextUser);
      }
    },
    [user],
  );

  const devLogin = useCallback(async (role: UserRole) => {
    const nextUser = toAuthUser({
      id: "dev_user_" + Date.now(),
      phone: "79991234567",
      role: role,
      firstName: "Dev",
      lastName: "User",
    });

    setUser(nextUser);
    await persistAuthUser(nextUser);
  }, []);

  const setDevMode = useCallback(async (enabled: boolean) => {
    setDevModeState(enabled);
    await AsyncStorage.setItem(DEV_MODE_KEY, enabled ? "true" : "false");
  }, []);

  const logout = useCallback(async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setPendingRegistration(null);
    await persistAuthUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      pendingRegistration,
      verificationCodePlaceholder: PLACEHOLDER_VERIFICATION_CODE,
      startRegistration,
      completeRegistration,
      loginWithPhone,
      setUserRole,
      logout,
      devLogin,
      devMode,
      setDevMode,
    }),
    [
      user,
      isLoading,
      pendingRegistration,
      startRegistration,
      completeRegistration,
      loginWithPhone,
      setUserRole,
      logout,
      devLogin,
      devMode,
      setDevMode,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
