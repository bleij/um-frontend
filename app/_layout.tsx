import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { ParentDataProvider } from "../contexts/ParentDataContext";
import "../global.css";

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const authScreen = segments[1];

    if (!user && !inAuthGroup) {
      router.replace("/intro");
      return;
    }

    if (user && inAuthGroup && authScreen !== "role") {
      router.replace("/(tabs)/home");
    }
  }, [isLoading, router, segments, user]);

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
          name="test/index"
          options={{ presentation: "fullScreenModal" }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ParentDataProvider>
        <RootNavigator />
      </ParentDataProvider>
    </AuthProvider>
  );
}
