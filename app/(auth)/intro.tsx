import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import { StatusBar } from "expo-status-bar";

export default function IntroScreen() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <View style={styles.root(isWeb)}>
            <View style={styles.card(isWeb)}>
                <StatusBar style="light" />
                <LinearGradient
                    colors={["#6C5CE7", "#8B7FE8"]}
                    style={styles.gradient}
                >
                    {/* Status Bar simulation wrapper for web layout spacing if needed */}
                    <View className="w-full flex-row justify-between items-center px-6 pt-12 pb-4">
                        {/* We use Expo StatusBar instead of mock UI */}
                    </View>

                    {/* Logo Section */}
                    <View className="flex-1 items-center justify-center">
                        <MotiView
                            from={{opacity: 0, scale: 0.4}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 600}}
                        >
                            <View className="items-center justify-center flex-col">
                                <Text className="text-[120px] font-black text-white leading-[120px] tracking-tight">
                                    UM
                                </Text>
                                <View className="mt-4 gap-y-1 items-center">
                                    <View className="h-2 w-32 bg-white/20 rounded-full" />
                                    <View className="h-2 w-24 bg-white/20 rounded-full" />
                                </View>
                            </View>
                        </MotiView>
                    </View>

                    {/* Buttons Section */}
                    <View className="w-full max-w-md px-6 space-y-4 pb-8 self-center mb-8">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/(auth)/login")}
                            className="w-full py-4 bg-white rounded-3xl items-center justify-center shadow-lg mb-4"
                        >
                            <Text className="text-[#6C5CE7] font-semibold text-lg">Войти</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/(auth)/register")}
                            className="w-full py-4 bg-[#5548C8] rounded-3xl items-center justify-center shadow-lg"
                        >
                            <Text className="text-white font-semibold text-lg">Регистрация</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
}

const styles = {
    root: (isWeb: boolean) => ({
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    }),

    card: (isWeb: boolean) => ({
        width: "100%",
        maxWidth: isWeb ? 720 : "100%",
        height: isWeb ? 680 : "100%",
        borderRadius: isWeb ? 28 : 0,
        overflow: "hidden",
        backgroundColor: "transparent",
    }),

    gradient: {
        flex: 1,
        position: "relative" as const,
    },
};