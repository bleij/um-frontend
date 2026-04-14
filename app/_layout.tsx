import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { ParentDataProvider } from "../contexts/ParentDataContext";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ParentDataProvider>
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
    </ParentDataProvider>
  );
}
