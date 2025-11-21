import React, {useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    StyleSheet,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useRouter} from "expo-router";
import {MotiView} from "moti";

export default function IntroScreen() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <View style={styles.root(isWeb)}>
            <View style={styles.card(isWeb)}>
                <LinearGradient
                    colors={["#5A4FF3", "#A8B4FF"]}
                    style={styles.gradient}
                >
                    {/* LOGO */}
                    <View style={styles.logoWrap}>
                        <MotiView
                            from={{opacity: 0, scale: 0.4}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 600}}
                        >
                            <Image
                                source={require("../../assets/logo/logo_white.png")}
                                style={styles.logo(isWeb)}
                            />
                        </MotiView>
                    </View>

                    {/* LOWER BUTTON BAR, STRICT 50/50 */}
                    <View style={styles.bottomBar}>
                        {/* LEFT BUTTON */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/(auth)/login")}
                            style={styles.leftBox}
                        >
                            <Text style={styles.btnText}>Sign in</Text>
                        </TouchableOpacity>

                        {/* RIGHT BUTTON */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/(auth)/register")}
                            style={styles.rightBox}
                        >
                            <Text style={styles.btnText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
}

const BOX_HEIGHT = 120;

const styles = {
    root: (isWeb: boolean) => ({
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isWeb ? "#FFFFFF" : "#FFFFFF",
    }),

    card: (isWeb: boolean) => ({
        width: "100%",
        maxWidth: isWeb ? 720 : "100%",
        height: isWeb ? 680 : "100%",
        borderRadius: isWeb ? 28 : 0,
        overflow: "hidden",
        backgroundColor: isWeb ? "#FFFFFF" : "transparent",
    }),

    gradient: {
        flex: 1,
        position: "relative",
    },

    logoWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    logo: (isWeb: boolean) => ({
        width: isWeb ? 320 : 220,
        height: isWeb ? 320 : 220,
        resizeMode: "contain",
    }),

    bottomBar: {
        flexDirection: "row",
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: BOX_HEIGHT,
    },

    leftBox: {
        flex: 1,
        backgroundColor: "#2E2C79",
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 100,
    },

    rightBox: {
        flex: 1,
        backgroundColor: "#3F2CCF",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 100,
    },

    btnText: {
        fontSize: 28,
        fontWeight: "700",
        color: "white",
    },
};