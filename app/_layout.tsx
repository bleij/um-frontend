import {Stack} from "expo-router";
import {ThemeProvider, DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useColorScheme} from "react-native";

import * as SplashScreen from "expo-splash-screen";
import {useEffect} from "react";
import {useFonts, ProstoOne_400Regular} from "@expo-google-fonts/prosto-one";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    // загружаем шрифт
    const [fontsLoaded] = useFonts({
        ProstoOne_400Regular,
    });

    // скрываем splash после загрузки
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "fade",
                }}
            >
                {/* AUTH + INTRO */}
                <Stack.Screen name="(auth)"/>

                {/* ROLE + ONBOARDING */}
                <Stack.Screen name="onboarding"/>

                {/* MAIN TABS */}
                <Stack.Screen name="(tabs)"/>

                {/* MODAL (если понадобится) */}
                <Stack.Screen name="modal" options={{presentation: "modal"}}/>
            </Stack>
        </ThemeProvider>
    );
}