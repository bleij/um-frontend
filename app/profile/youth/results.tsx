import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Dimensions
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export default function YouthResults() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={["#3F3C9F", "#EDEBFF"]}
            style={{flex: 1}}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 60,
                    paddingBottom: 120,
                    alignItems: IS_DESKTOP ? "center" : "stretch"
                }}
            >
                {/* ✅ ОБЁРТКА */}
                <View style={{width: IS_DESKTOP ? "50%" : "100%"}}>

                    {/* TITLE */}
                    <MotiView
                        from={{opacity: 0, translateY: -10}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 400}}
                        style={{marginBottom: 30}}
                    >
                        <Text
                            style={{
                                fontSize: 30,
                                fontWeight: "800",
                                color: "white",
                                textAlign: "center",
                            }}
                        >
                            Твои результаты
                        </Text>
                    </MotiView>

                    {/* EMOJI */}
                    <MotiView
                        from={{opacity: 0, scale: 0.7}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 500}}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 30,
                        }}
                    >
                        <Text style={{fontSize: 64}}>🔥</Text>
                    </MotiView>

                    {/* TYPE CARD */}
                    <MotiView
                        from={{opacity: 0, translateY: 20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 400}}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 24,
                            padding: 24,
                            marginBottom: 26,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: 10,
                                color: "#2E2C79",
                            }}
                        >
                            Тип: Техно-энтузиаст
                        </Text>

                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                color: "#444",
                                lineHeight: 20,
                            }}
                        >
                            Тебе нравится разбираться в технологиях, ты любишь пробовать новое,
                            экспериментировать и работать с техникой и логикой.
                        </Text>
                    </MotiView>

                    {/* GRAPH */}
                    <MotiView
                        from={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 500}}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 22,
                            paddingVertical: 24,
                            marginBottom: 26,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignItems: "flex-end",
                                height: 140,
                            }}
                        >
                            {[85, 70, 55, 90].map((h, i) => (
                                <View
                                    key={i}
                                    style={{
                                        width: 18,
                                        height: h,
                                        backgroundColor: "#3F3C9F",
                                        borderRadius: 8,
                                    }}
                                />
                            ))}
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                marginTop: 12,
                            }}
                        >
                            <Text style={{fontSize: 13}}>Логика</Text>
                            <Text style={{fontSize: 13}}>Креатив</Text>
                            <Text style={{fontSize: 13}}>Коммуник.</Text>
                            <Text style={{fontSize: 13}}>Упорство</Text>
                        </View>
                    </MotiView>

                    {/* STATS */}
                    <MotiView
                        from={{opacity: 0, translateY: 20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 450}}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 22,
                            padding: 24,
                            marginBottom: 36,
                        }}
                    >
                        <Text style={{fontSize: 16, marginBottom: 10}}>
                            ⚡ Техника — <Text style={{fontWeight: "700"}}>88%</Text>
                        </Text>
                        <Text style={{fontSize: 16, marginBottom: 10}}>
                            🎨 Креатив — <Text style={{fontWeight: "700"}}>70%</Text>
                        </Text>
                        <Text style={{fontSize: 16}}>
                            💬 Общение — <Text style={{fontWeight: "700"}}>62%</Text>
                        </Text>
                    </MotiView>

                    {/* RECOMMENDATION */}
                    <View
                        style={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            padding: 20,
                            borderRadius: 20,
                            marginBottom: 40,
                        }}
                    >
                        <Text style={{fontSize: 15, lineHeight: 20}}>
                            Тебе отлично подойдут направления:
                            программирование, UI/UX, робототехника и геймдизайн.
                        </Text>
                    </View>

                    {/* BUTTON */}
                    <TouchableOpacity
                        onPress={() => router.push("/profile/common/subscribe")}
                        style={{
                            backgroundColor: "#2E2C79",
                            paddingVertical: 16,
                            borderRadius: 30,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontSize: 18,
                                fontWeight: "700",
                            }}
                        >
                            Перейти к курсам
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </LinearGradient>
    );
}