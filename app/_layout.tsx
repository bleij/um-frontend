import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { COLORS, LAYOUT, RADIUS, SHADOWS, TYPOGRAPHY } from "../constants/theme";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { DevSettingsProvider } from "../contexts/DevSettingsContext";
import { ParentDataProvider } from "../contexts/ParentDataContext";
import "../global.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DevRoleSwitcher } from "../components/DevRoleSwitcher";

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { user, isLoading, devMode } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    // The `auth/` directory (no parens) hosts the OAuth callback flow.
    // Treat it the same as (auth) for guard purposes.
    const inOAuthFlow = segments[0] === "auth";
    const authScreen = segments[1] as string;

    // Allow unauthenticated users through both auth groups
    if (!user && !inAuthGroup && !inOAuthFlow) {
      router.replace("/intro");
      return;
    }

    // Don't bounce the OAuth callback / complete-profile pages even when
    // the user is technically signed in — they need to finish the flow.
    const isOAuthCallbackScreen =
      inOAuthFlow &&
      (authScreen === "callback" || authScreen === "complete-profile");

    // Skip auto-redirect to home if devMode is enabled or user is mid-register
    if (
      user &&
      inAuthGroup &&
      (authScreen as string) !== "role" &&
      (authScreen as string) !== "register" &&
      !devMode
    ) {
      router.replace("/(tabs)/home");
    }

    // For the `auth/` directory: redirect to home once the flow completes,
    // but leave callback/complete-profile alone so they can do their work.
    if (user && inOAuthFlow && !isOAuthCallbackScreen && !devMode) {
      router.replace("/(tabs)/home");
    }
  }, [isLoading, router, segments, user, devMode]);

  if (isLoading) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        {/* AUTH + INTRO (показываются первыми) */}
        <Stack.Screen name="(auth)" />
        {/* OAuth callback flow — lives at /auth/callback and /auth/complete-profile */}
        <Stack.Screen name="auth" />

        {/* PROFILE CREATION (идут после выбора роли) */}
        <Stack.Screen name="profile" />

        {/* MAIN TABS (доступно только после входа) */}
        <Stack.Screen name="(tabs)" />

        {/* если вдруг понадобится модальное окно */}
        {/* <Stack.Screen name="modal" options={{presentation: "modal"}}/> */}

        {/* <Stack.Screen
                  name="modal/course"
                  options={{presentation: "modal"}}
              /> */}

        {/* TEST ROUTE */}
        <Stack.Screen
          name="parent/testing/index"
          options={{ presentation: "fullScreenModal" }}
        />
      </Stack>
      <DevRoleSwitcher />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ParentDataProvider>
          <DevSettingsProvider>
            <RootNavigator />
          </DevSettingsProvider>
        </ParentDataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
