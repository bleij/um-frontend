import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";

export default function DoneScreen() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    const [role, setRole] = useState<string | null>(null);

    // читаем сохранённую роль
    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => setRole(v));
    }, []);

    const handleStart = () => {
        if (!role) return;

        // mentor — сразу в чаты
        if (role === "mentor") {
            router.push("/(tabs)/chats");
            return;
        }

        // parent — свой первый экран пути
        if (role === "parent") {
            router.push("/profile/parent/umo-intro");
            return;
        }

        // youth — свой аналогичный экран
        if (role === "youth") {
            router.push("/profile/youth/umo-intro");
            return;
        }

        // organization — свой первый экран
        if (role === "org") {
            router.push("/profile/org/umo-intro");
            return;
        }
    };

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}
            contentContainerStyle={{paddingBottom: 40}}
        >
            <View
                style={{
                    maxWidth: isWeb ? 680 : "100%",
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: isWeb ? "#FFFFFF" : "transparent",
                    borderRadius: isWeb ? 32 : 0,
                    paddingHorizontal: isWeb ? 32 : 24,
                    paddingBottom: 50,
                    shadowColor: isWeb ? "#000" : undefined,
                    shadowOpacity: isWeb ? 0.06 : 0,
                    shadowRadius: isWeb ? 14 : 0,
                    shadowOffset: isWeb ? {width: 0, height: 4} : undefined,
                }}
            >
                {/* HEADER */}
                <View
                    style={{
                        height: 240,
                        backgroundColor: "#2E2C79",
                        borderBottomLeftRadius: 50,
                        borderBottomRightRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: 20,
                    }}
                >
                    <MotiView
                        from={{opacity: 0, scale: 0.4}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 500}}
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: 999,
                            backgroundColor: "white",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{fontSize: 70, color: "#2E2C79"}}>✓</Text>
                    </MotiView>

                    <MotiView
                        from={{opacity: 0, translateY: 20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 450, delay: 200}}
                        style={{marginTop: 18}}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 28,
                                fontWeight: "700",
                                textAlign: "center",
                            }}
                        >
                            Готово
                        </Text>
                    </MotiView>
                </View>

                {/* BUTTON */}
                <View style={{marginTop: 50}}>
                    <TouchableOpacity
                        onPress={handleStart}
                        style={{
                            backgroundColor: "#3430B5",
                            paddingVertical: 15,
                            borderRadius: 999,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 18,
                                fontWeight: "600",
                                textAlign: "center",
                            }}
                        >
                            начать
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}