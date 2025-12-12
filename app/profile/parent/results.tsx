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

export default function ParentResults() {
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
                {/* ✅ ОБЁРТКА ШИРИНЫ */}
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
                            Результаты тестирования
                        </Text>
                    </MotiView>

                    {/* STAR */}
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
                        <Text style={{fontSize: 64}}>⭐</Text>
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
                            elevation: 8,
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
                            Тип личности: Исследователь
                        </Text>

                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                color: "#444",
                                lineHeight: 20,
                            }}
                        >
                            Ребёнок любознательный, любит разбираться в устройстве вещей,
                            задаёт много вопросов и тянется к логике и экспериментам.
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
                            {[60, 90, 45, 70].map((h, i) => (
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
                            <Text style={{fontSize: 13}}>Настойчив.</Text>
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
                            📌 Креативность — <Text style={{fontWeight: "700"}}>90%</Text>
                        </Text>
                        <Text style={{fontSize: 16, marginBottom: 10}}>
                            📌 Аналитика — <Text style={{fontWeight: "700"}}>65%</Text>
                        </Text>
                        <Text style={{fontSize: 16}}>
                            📌 Общение — <Text style={{fontWeight: "700"}}>72%</Text>
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
                            Рекомендуем обратить внимание на направления:
                            робототехника, программирование, математика и естественные науки.
                        </Text>
                    </View>

                    {/* BUTTON */}
                    <TouchableOpacity
                        onPress={() => router.push("/profile/parent/testing")}
                        style={{
                            backgroundColor: "#433fd2",
                            paddingVertical: 16,
                            borderRadius: 30,
                            marginBottom: 12,
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
                            Пройти тестирование заново для другого ребёнка
                        </Text>
                    </TouchableOpacity>

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
                            Продолжить
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </LinearGradient>
    );
}