import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";
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
  loginWithGoogle: () => Promise<AuthActionResult>;
  loginWithQR: (pin: string) => Promise<AuthActionResult>;
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

  const email =
    sessionUser.email ||
    (metadata.email as string | undefined) ||
    "";

  // Accept users who have either phone OR email (OAuth users have email but no phone)
  if (!phone && !email) return null;

  // Google/OAuth users have `full_name` or `name` in metadata
  const fullName = ((metadata.full_name || metadata.name || "") as string).trim();
  const nameParts = fullName.split(" ").filter(Boolean);
  const oauthFirstName = nameParts[0] ?? "";
  const oauthLastName = nameParts.slice(1).join(" ");

  return toAuthUser({
    id: sessionUser.id,
    phone,
    email,
    role: parseRole(
      (remoteProfile?.role as string | null) ||
        (metadata.role as string | undefined),
    ),
    firstName:
      (remoteProfile?.first_name as string | null) ||
      (metadata.first_name as string | undefined) ||
      oauthFirstName,
    lastName:
      (remoteProfile?.last_name as string | null) ||
      (metadata.last_name as string | undefined) ||
      oauthLastName,
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [devMode, setDevModeState] = useState(false);
  // Track whether the initial bootstrap has finished so the onAuthStateChange
  // listener doesn't clobber a dev-switcher user that was just restored.
  const bootstrapDone = useRef(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

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
              bootstrapDone.current = true;
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
        bootstrapDone.current = true;
        setIsLoading(false);
      }
    };

    bootstrap();

    // Subscribe to auth state changes — critical for OAuth redirects.
    // When the Google OAuth callback fires, Supabase sets the session and
    // emits SIGNED_IN here so we hydrate the user without a page reload.
    if (supabase && isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Ignore events that fire before bootstrap finishes to avoid a race
        // where INITIAL_SESSION clobbers a just-restored dev user.
        if (!bootstrapDone.current) return;

        if (event === "SIGNED_IN" && session?.user) {
          const hydrated = await hydrateFromSupabaseUser(session.user);
          if (hydrated) setUser(hydrated);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          await AsyncStorage.removeItem(DEV_USER_KEY);
        } else if (event === "USER_UPDATED" && session?.user) {
          const hydrated = await hydrateFromSupabaseUser(session.user);
          if (hydrated) setUser(hydrated);
        }
      });
      unsubscribe = data.subscription.unsubscribe;
    }

    return () => {
      unsubscribe?.();
    };
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

  const loginWithGoogle = useCallback(async (): Promise<AuthActionResult> => {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, error: "Supabase не настроен" };
    }

    // Build the redirect URL based on platform
    const redirectTo =
      Platform.OS === "web" && typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "umapp://auth/callback";

    if (Platform.OS === "web") {
      // Web: Supabase opens Google OAuth in the same tab and redirects back.
      // detectSessionInUrl:true handles the token from the URL automatically.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) return { success: false, error: error.message };
      // Browser is now navigating to Google — this function won't return
      // before the page unloads, so the return value is effectively unused.
      return { success: true };
    }

    // Native (iOS / Android):
    //
    // Strategy: open the OAuth URL in an in-app browser. On iOS,
    // ASWebAuthenticationSession intercepts the umapp:// redirect and returns
    // the URL directly via openAuthSessionAsync. On Android, Chrome Custom Tabs
    // fire a deep-link intent instead — the app opens at /auth/callback, which
    // calls WebBrowser.maybeCompleteAuthSession() to close the lingering tab,
    // and then parses the tokens from the Linking URL directly.
    //
    // Either way the session ends up set and onAuthStateChange notifies us.
    try {
      await WebBrowser.warmUpAsync();

      const { data: urlData, error: urlError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (urlError || !urlData.url) {
        await WebBrowser.coolDownAsync();
        return { success: false, error: urlError?.message ?? "Не удалось получить URL авторизации" };
      }

      // Open the OAuth flow. On iOS this returns when the redirect fires.
      // On Android this may return { type: 'cancel' } if the deep-link intent
      // took over before openAuthSessionAsync could intercept it — that's fine,
      // the callback screen handles session parsing via Linking in that case.
      const result = await WebBrowser.openAuthSessionAsync(urlData.url, redirectTo);
      await WebBrowser.coolDownAsync();

      if (result.type === "success") {
        // iOS (and some Android) path: tokens are in the returned URL.
        const raw = result.url;
        const hashPart = raw.split("#")[1] ?? "";
        const queryPart = raw.split("?")[1]?.split("#")[0] ?? "";
        const hashParams = new URLSearchParams(hashPart);
        const queryParams = new URLSearchParams(queryPart);

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const code = queryParams.get("code");

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError || !sessionData.user) {
            return { success: false, error: sessionError?.message ?? "Ошибка сессии" };
          }
          const hydrated = await hydrateFromSupabaseUser(sessionData.user);
          if (hydrated) setUser(hydrated);
          return { success: true };
        }

        if (code) {
          const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError || !exchangeData.user) {
            return { success: false, error: exchangeError?.message ?? "Ошибка обмена кода" };
          }
          const hydrated = await hydrateFromSupabaseUser(exchangeData.user);
          if (hydrated) setUser(hydrated);
          return { success: true };
        }
      }

      // Android path: the deep-link fired a system intent which opened
      // /auth/callback. That screen parses the tokens and calls
      // maybeCompleteAuthSession(). We return success here; onAuthStateChange
      // will notify us once the session is set by the callback screen.
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message ?? "Неизвестная ошибка" };
    }
  }, []);

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
      loginWithGoogle,
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
      loginWithGoogle,
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
