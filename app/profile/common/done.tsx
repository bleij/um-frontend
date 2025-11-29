import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
    Dimensions,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export default function DoneScreen() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    // читаем сохранённую роль
    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => setRole(v));
    }, []);

    const handleStart = () => {
        if (!role) return;

        if (role === "mentor") {
            router.push("/(tabs)/home");
            return;
        }

        if (role === "parent") {
            router.push("/profile/parent/umo-intro");
            return;
        }

        if (role === "youth") {
            router.push("/profile/youth/umo-intro");
            return;
        }

        if (role === "org") {
            router.push("/profile/organization/umo-intro");
            return;
        }
    };

    return (
        <LinearGradient
            colors={["#3F3C9F", "#8D88D9"]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{flex: 1}}
        >
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        paddingTop: 60,
                        paddingHorizontal: 20,
                    }}
                >
                    {/* LOGO */}
                    <MotiView
                        from={{opacity: 0, translateY: -20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 500}}
                        style={{marginBottom: 30}}
                    >
                        <Image
                            source={require("../../../assets/logo/logo_white.png")}
                            style={{
                                width: 200,
                                height: 80,
                                resizeMode: "contain",
                            }}
                        />
                    </MotiView>

                    {/* CARD */}
                    <MotiView
                        from={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 500}}
                        style={{
                            width: IS_DESKTOP ? "50%" : "100%",
                            backgroundColor: "white",
                            borderRadius: 36,
                            paddingVertical: 48,
                            paddingHorizontal: 28,
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.15,
                            shadowRadius: 18,
                            shadowOffset: {width: 0, height: 8},
                        }}
                    >
                        {/* CHECK ICON */}
                        <LinearGradient
                            colors={["#3F3C9F", "#8D88D9"]}
                            style={{
                                width: 140,
                                height: 140,
                                borderRadius: 70,
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 26,
                            }}
                        >
                            <Text style={{fontSize: 72, color: "white"}}>✓</Text>
                        </LinearGradient>

                        {/* TITLE */}
                        <Text
                            style={{
                                fontSize: 30,
                                fontWeight: "800",
                                color: "#2E2C79",
                                marginBottom: 12,
                                textAlign: "center",
                            }}
                        >
                            Всё готово
                        </Text>

                        {/* SUBTEXT */}
                        <Text
                            style={{
                                fontSize: 16,
                                color: "#555",
                                textAlign: "center",
                                lineHeight: 22,
                                marginBottom: 36,
                            }}
                        >
                            Профиль успешно создан
                            {"\n"}можно начинать работу в системе
                        </Text>

                        {/* BUTTON */}
                        <TouchableOpacity
                            onPress={handleStart}
                            style={{
                                width: "100%",
                                backgroundColor: "#3430B5",
                                paddingVertical: 18,
                                borderRadius: 999,
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 18,
                                    fontWeight: "700",
                                    textAlign: "center",
                                }}
                            >
                                начать
                            </Text>
                        </TouchableOpacity>
                    </MotiView>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}