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

interface AuthActionResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  devOtpCode: string | null;
  sendOtp: (phone: string) => Promise<AuthActionResult>;
  verifyOtpAndRegister: (
    phone: string,
    otp: string,
    password: string,
    role: UserRole,
    firstName: string,
    lastName?: string,
  ) => Promise<AuthActionResult>;
  loginWithPhone: (phone: string, password: string) => Promise<AuthActionResult>;
  loginWithQR: (payload: {
    childId: string;
    parentId: string;
    token: string;
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
const LOCAL_USERS_KEY = "um_local_users_v2";
const DEV_MODE_KEY = "um_dev_mode";

const DEV_OTP = process.env.EXPO_PUBLIC_DEV_OTP?.trim() || null;
const PLACEHOLDER_VERIFICATION_CODE = DEV_OTP ?? "1234";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Returns E.164 format: +7XXXXXXXXXX
function normalizePhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("7")) return `+${digits}`;
  if (digits.startsWith("8")) return `+7${digits.slice(1)}`;
  return `+7${digits}`;
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
    phone: input.phone,
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
    "admin",
  ];
  if (value && allowed.includes(value as UserRole)) return value as UserRole;
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
  if (response.error) return null;
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

async function hydrateFromSupabaseUser(
  sessionUser: SupabaseUser,
): Promise<AuthUser | null> {
  const metadata = sessionUser.user_metadata ?? {};
  const remoteProfile = await fetchRemoteProfile(sessionUser.id);

  const phone =
    (remoteProfile?.phone as string | null) ||
    sessionUser.phone ||
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
            // Reject stale dev users that used non-UUID ids (e.g. "dev_user_...").
            // They cause 400s on Supabase queries. Force a clean state instead.
            const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (uuidRe.test(parsed.id)) {
              setUser(parsed);
            } else {
              await AsyncStorage.removeItem(AUTH_USER_KEY);
            }
          } catch {
            await AsyncStorage.removeItem(AUTH_USER_KEY);
          }
        }

        if (supabase && isSupabaseConfigured) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const hydrated = await hydrateFromSupabaseUser(data.session.user);
            if (hydrated) {
              setUser(hydrated);
              await persistAuthUser(hydrated);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const sendOtp = useCallback(async (phone: string): Promise<AuthActionResult> => {
    const normalized = normalizePhone(phone);

    if (normalized.replace(/\D/g, "").length < 11) {
      return { success: false, error: "Введите корректный номер телефона" };
    }

    // Dev bypass: skip real SMS
    if (DEV_OTP) return { success: true };

    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOtp({ phone: normalized });
      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  }, []);

  const loginWithPhone = useCallback(
    async (phone: string, password: string): Promise<AuthActionResult> => {
      const normalized = normalizePhone(phone);

      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          phone: normalized,
          password,
        });

        if (error || !data.user) {
          return { success: false, error: "Неверный номер телефона или пароль" };
        }

        const nextUser =
          (await hydrateFromSupabaseUser(data.user)) ??
          toAuthUser({
            id: data.user.id,
            phone: normalized,
            role: parseRole(data.user.user_metadata?.role as string | undefined),
            firstName: data.user.user_metadata?.first_name as string | undefined,
            lastName: data.user.user_metadata?.last_name as string | undefined,
          });

        await persistAuthUser(nextUser);
        setUser(nextUser);
        return { success: true };
      }

      // Local fallback
      const users = await getLocalUsers();
      const localUser = users.find(
        (u) => u.phone === normalized && u.password === password,
      );
      if (!localUser) {
        return { success: false, error: "Неверный номер телефона или пароль" };
      }

      const nextUser = toAuthUser(localUser);
      await persistAuthUser(nextUser);
      setUser(nextUser);
      return { success: true };
    },
    [],
  );

  const verifyOtpAndRegister = useCallback(
    async (
      phone: string,
      otp: string,
      password: string,
      role: UserRole,
      firstName: string,
      lastName?: string,
    ): Promise<AuthActionResult> => {
      const normalized = normalizePhone(phone);

      // Dev bypass: accept the dev code without hitting Supabase
      const isDevBypass = DEV_OTP && otp === DEV_OTP;

      if (!isDevBypass && supabase && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: normalized,
          token: otp,
          type: "sms",
        });

        if (error || !data.user) {
          return { success: false, error: "Неверный код подтверждения" };
        }

        // Set password so the user can log in with phone + password later
        const { error: pwError } = await supabase.auth.updateUser({ password });
        if (pwError) {
          return { success: false, error: pwError.message };
        }

        const nextUser = toAuthUser({
          id: data.user.id,
          phone: normalized,
          role,
          firstName,
          lastName,
        });

        await upsertRemoteProfile(nextUser);
        await persistAuthUser(nextUser);
        setUser(nextUser);
        return { success: true };
      }

      // Local fallback (also used for dev bypass)
      const users = await getLocalUsers();
      if (users.find((u) => u.phone === normalized)) {
        return {
          success: false,
          error: "Пользователь с таким номером уже зарегистрирован",
        };
      }

      const localUser: LocalUserRecord = {
        id: `local_${Date.now()}`,
        phone: normalized,
        password,
        role,
        firstName: firstName.trim(),
        lastName: lastName?.trim() || "",
      };

      await saveLocalUsers([...users, localUser]);
      const nextUser = toAuthUser(localUser);
      await persistAuthUser(nextUser);
      setUser(nextUser);
      return { success: true };
    },
    [],
  );

  const loginWithQR = useCallback(
    async (payload: {
      childId: string;
      parentId: string;
      token: string;
    }): Promise<AuthActionResult> => {
      const { childId, parentId, token } = payload;

      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from("child_profiles")
          .select("id, name, age_category, parent_user_id, qr_token")
          .eq("id", childId)
          .eq("parent_user_id", parentId)
          .eq("qr_token", token)
          .maybeSingle();

        if (error || !data) {
          return { success: false, error: "Недействительный QR-код" };
        }

        const nextUser = toAuthUser({
          id: data.id,
          phone: "",
          role: "child",
          firstName: data.name,
        });
        await persistAuthUser(nextUser);
        setUser(nextUser);
        return { success: true };
      }

      const childrenRaw = await AsyncStorage.getItem(`um_children_${parentId}`);
      if (!childrenRaw) return { success: false, error: "Недействительный QR-код" };

      try {
        const children = JSON.parse(childrenRaw) as Array<{
          id: string;
          name: string;
          qrToken?: string;
          phone?: string;
        }>;
        const child = children.find(
          (c) => c.id === childId && c.qrToken === token,
        );
        if (!child) return { success: false, error: "Недействительный QR-код" };

        const nextUser = toAuthUser({
          id: child.id,
          phone: child.phone || "",
          role: "child",
          firstName: child.name,
        });
        await persistAuthUser(nextUser);
        setUser(nextUser);
        return { success: true };
      } catch {
        return { success: false, error: "Ошибка при входе" };
      }
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
        // Only touch remote profile when there's a real Supabase auth session.
        // Dev mode uses fake UUIDs with no session — auth.uid() would be null,
        // causing any RLS-protected upsert to fail with 401.
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          await supabase.auth.updateUser({ data: { role } });
          await upsertRemoteProfile(nextUser);
        }
      }
    },
    [user],
  );

  const devLogin = useCallback(async (role: UserRole) => {
    // Use a stable, valid UUID per role so Supabase FK references don't 400.
    const DEV_IDS: Record<UserRole, string> = {
      parent:      "d0000000-0000-4000-a000-000000000001",
      youth:       "d0000000-0000-4000-a000-000000000002",
      child:       "d0000000-0000-4000-a000-000000000003",
      "young-adult":"d0000000-0000-4000-a000-000000000004",
      mentor:      "d0000000-0000-4000-a000-000000000005",
      org:         "d0000000-0000-4000-a000-000000000006",
      teacher:     "d0000000-0000-4000-a000-000000000007",
      admin:       "d0000000-0000-4000-a000-000000000008",
    };
    const nextUser = toAuthUser({
      id: DEV_IDS[role] ?? "d0000000-0000-4000-a000-000000000009",
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
    if (supabase && isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
    await persistAuthUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      devOtpCode: DEV_OTP,
      sendOtp,
      verifyOtpAndRegister,
      loginWithPhone,
      loginWithQR,
      setUserRole,
      logout,
      devLogin,
      devMode,
      setDevMode,
    }),
    [
      user,
      isLoading,
      // devOtpCode is a constant, no need to list as dependency
      sendOtp,
      verifyOtpAndRegister,
      loginWithPhone,
      loginWithQR,
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
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
