import {Stack} from "expo-router";
import {ThemeProvider, DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useColorScheme} from "react-native";
import "../global.css";

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "fade",
                }}
            >
                {/* AUTH + INTRO (показываются первыми) */}
                <Stack.Screen name="(auth)"/>

                {/* ROLE + ONBOARDING (идут после авторизации) */}
                <Stack.Screen name="onboarding"/>

                {/* MAIN TABS (доступно только после входа) */}
                <Stack.Screen name="(tabs)"/>

                {/* если вдруг понадобится модальное окно */}
                <Stack.Screen name="modal" options={{presentation: "modal"}}/>

                <Stack.Screen
                    name="modal/course"
                    options={{presentation: "modal"}}
                />
            </Stack>
        </ThemeProvider>
    );
}