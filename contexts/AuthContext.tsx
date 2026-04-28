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
import { getUseRealOtpSetting } from "./DevSettingsContext";

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
  email: string;
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
  /** Call this after the role-specific create-profile screen succeeds.
   *  Persists the in-memory user to localStorage so they survive a refresh. */
  finalizeRegistration: () => Promise<void>;
}


// Only dev-switcher users (fake, not in Supabase) are persisted locally.
// Real users are restored exclusively from supabase.auth.getSession().
const DEV_USER_KEY = "um_dev_user";
const DEV_MODE_KEY = "um_dev_mode";

const DEV_OTP = process.env.EXPO_PUBLIC_DEV_OTP?.trim() || null;
const PLACEHOLDER_VERIFICATION_CODE = DEV_OTP ?? "1234";

// Stable, valid UUIDs for each dev role so FK constraints don't fail.
// Used by both devLogin() and the fake-OTP bypass in verifyOtpAndRegister().
const DEV_IDS: Record<UserRole, string> = {
  parent:         "d0000000-0000-4000-a000-000000000001",
  youth:          "d0000000-0000-4000-a000-000000000002",
  child:          "d0000000-0000-4000-a000-000000000003",
  "young-adult":  "d0000000-0000-4000-a000-000000000004",
  mentor:         "d0000000-0000-4000-a000-000000000005",
  org:            "d0000000-0000-4000-a000-000000000006",
  teacher:        "d0000000-0000-4000-a000-000000000007",
  admin:          "d0000000-0000-4000-a000-000000000008",
};

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
  email?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}): AuthUser {
  return {
    id: input.id,
    phone: input.phone,
    email: input.email?.trim() || "",
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
    email: sessionUser.email || (metadata.email as string | undefined) || "",
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [devMode, setDevModeState] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const rawDevMode = await AsyncStorage.getItem(DEV_MODE_KEY);
        if (rawDevMode !== null) setDevModeState(rawDevMode === "true");

        // 1. Real users: restore from Supabase session (no localStorage needed)
        if (supabase && isSupabaseConfigured) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const hydrated = await hydrateFromSupabaseUser(data.session.user);
            if (hydrated) {
              setUser(hydrated);
              return;
            }
          }
        }

        // 2. Dev-switcher users only: restore from local key
        const rawDevUser = await AsyncStorage.getItem(DEV_USER_KEY);
        if (rawDevUser) {
          try {
            setUser(JSON.parse(rawDevUser) as AuthUser);
          } catch {
            await AsyncStorage.removeItem(DEV_USER_KEY);
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

    // Dev bypass: skip real SMS unless "Use Real OTP" is toggled on
    const useRealOtp = await getUseRealOtpSetting();
    if (DEV_OTP && !useRealOtp) return { success: true };

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

        setUser(nextUser);
        return { success: true };
      }

      return { success: false, error: "Неверный номер телефона или пароль" };
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

      // Dev bypass: accept the dev code without hitting Supabase,
      // unless the user has toggled "Use Real OTP" in the dev switcher.
      const useRealOtp = await getUseRealOtpSetting();
      const isDevBypass = DEV_OTP && !useRealOtp && otp === DEV_OTP;

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
        setUser(nextUser);
        return { success: true };
      }

      // Dev bypass: synthetic in-memory user, no Supabase session.
      // Reuse the stable dev UUID for this role so any incidental Supabase
      // calls at least pass UUID format validation (they'll be silently ignored
      // by ParentDataContext which skips writes when there's no real session).
      const nextUser = toAuthUser({
        id: DEV_IDS[role] ?? "d0000000-0000-4000-a000-000000000009",
        phone: normalized,
        role,
        firstName: firstName.trim(),
        lastName: lastName?.trim() || "",
      });
      setUser(nextUser);
      return { success: true };
    },
    [],
  );

  const finalizeRegistration = useCallback(async () => {
    // Real Supabase users: their session and um_user_profiles row are already
    // persisted by verifyOtpAndRegister → upsertRemoteProfile. Nothing to do.
    // Dev-bypass users: in-memory only — no persistence needed.
  }, []);

  const loginWithQR = useCallback(
    async (pin: string): Promise<AuthActionResult> => {
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from("child_profiles")
          .select("id, name, age_category, parent_user_id, qr_pin, qr_pin_expires_at, qr_pin_one_time_use")
          .eq("qr_pin", pin)
          .maybeSingle();

        if (error || !data) {
          return { success: false, error: "Неверный код" };
        }

        // Check if PIN is expired
        if (data.qr_pin_expires_at) {
          const expiresAt = new Date(data.qr_pin_expires_at);
          if (expiresAt < new Date()) {
            return { success: false, error: "Код истёк. Попросите родителя создать новый" };
          }
        }

        // If one-time use, invalidate the PIN immediately
        if (data.qr_pin_one_time_use) {
          await supabase
            .from("child_profiles")
            .update({ 
              qr_pin: null, 
              qr_pin_expires_at: null 
            })
            .eq("id", data.id);
        }

        const nextUser = toAuthUser({
          id: data.id,
          phone: "",
          role: "child",
          firstName: data.name,
        });
        setUser(nextUser);
        return { success: true };
      }

      return { success: false, error: "Неверный код" };
    },
    [],
  );

  const setUserRole = useCallback(
    async (role: UserRole) => {
      if (!user) return;
      const nextUser = { ...user, role };
      setUser(nextUser);
      // Persist for dev-switcher users; real users rely on Supabase session.
      if (devMode) {
        await AsyncStorage.setItem(DEV_USER_KEY, JSON.stringify(nextUser));
      }
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
    [user, devMode],
  );

  const devLogin = useCallback(async (role: UserRole) => {
    const nextUser = toAuthUser({
      id: DEV_IDS[role] ?? "d0000000-0000-4000-a000-000000000009",
      phone: "79991234567",
      email: `${role}@example.com`,
      role: role,
      firstName: "Dev",
      lastName: "User",
    });

    setUser(nextUser);
    await AsyncStorage.setItem(DEV_USER_KEY, JSON.stringify(nextUser));
  }, []);

  const setDevMode = useCallback(async (enabled: boolean) => {
    setDevModeState(enabled);
    await AsyncStorage.setItem(DEV_MODE_KEY, enabled ? "true" : "false");
  }, []);

  const logout = useCallback(async () => {
    if (supabase && isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
    await AsyncStorage.removeItem(DEV_USER_KEY);
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
      finalizeRegistration,
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
      finalizeRegistration,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
