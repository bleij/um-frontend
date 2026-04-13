import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/theme";

export default function IntroScreen() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
            <View style={{ width: "100%", maxWidth: isWeb ? 428 : "100%", height: isWeb ? 680 : "100%", borderRadius: isWeb ? 28 : 0, overflow: "hidden" }}>
                <StatusBar style="light" />
                <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    {/* Logo */}
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <MotiView
                            from={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 800, type: "timing" }}
                        >
                            <View style={{
                                width: 128,
                                height: 128,
                                borderRadius: 32,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderWidth: 2,
                                borderColor: "rgba(255,255,255,0.2)",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 24,
                            }}>
                                <Text style={{ fontSize: 56, fontWeight: "800", color: "white", letterSpacing: -1 }}>
                                    UM
                                </Text>
                            </View>
                        </MotiView>

                        <MotiView
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 500, delay: 400 }}
                        >
                            <Text style={{ fontSize: 22, fontWeight: "700", color: "white", marginBottom: 4, textAlign: "center" }}>
                                Universal Mind
                            </Text>
                            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                                Раскрой потенциал своего ребёнка
                            </Text>
                        </MotiView>
                    </View>

                    {/* Buttons */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 500, delay: 600 }}
                        style={{ width: "100%", paddingHorizontal: 24, paddingBottom: 48, maxWidth: 400, alignSelf: "center" }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/(auth)/login")}
                            style={{
                                width: "100%",
                                paddingVertical: 16,
                                backgroundColor: "white",
                                borderRadius: 20,
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 12,
                            }}
                        >
                            <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 16 }}>Войти</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/(auth)/register")}
                            style={{
                                width: "100%",
                                paddingVertical: 16,
                                backgroundColor: "rgba(255,255,255,0.15)",
                                borderRadius: 20,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 1.5,
                                borderColor: "rgba(255,255,255,0.3)",
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Регистрация</Text>
                        </TouchableOpacity>
                    </MotiView>
                </LinearGradient>
            </View>
        </View>
    );
}