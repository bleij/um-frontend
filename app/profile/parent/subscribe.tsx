import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";

export default function ParentSubscribe() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <ScrollView
            style={{flex: 1, backgroundColor: "#FFFFFF"}}
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 60,
                paddingBottom: 100,
            }}
        >
            {/* TITLE */}
            <MotiView
                from={{opacity: 0, translateY: -10}}
                animate={{opacity: 1, translateY: 0}}
                transition={{duration: 400}}
            >
                <Text
                    style={{
                        fontSize: 42,
                        fontWeight: "800",
                        color: "#2E2C79",
                        textAlign: "center",
                        marginBottom: 6,
                    }}
                >
                    UM
                </Text>

                <Text
                    style={{
                        textAlign: "center",
                        fontSize: 28,
                        fontWeight: "700",
                        marginBottom: 4,
                    }}
                >
                    Подписки
                </Text>

                <Text
                    style={{
                        textAlign: "center",
                        fontSize: 13,
                        opacity: 0.6,
                        marginBottom: 40,
                    }}
                >
                    *для того, чтобы увидеть результат нужно купить подписку
                </Text>
            </MotiView>

            {/* CARD */}
            <MotiView
                from={{opacity: 0, translateY: 20}}
                animate={{opacity: 1, translateY: 0}}
                transition={{duration: 400, delay: 150}}
                style={{
                    borderWidth: 2,
                    borderColor: "#2E2C79",
                    borderRadius: 22,
                    padding: 20,
                    marginBottom: 40,
                }}
            >
                <View
                    style={{
                        alignSelf: "flex-end",
                        backgroundColor: "#2E2C79",
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: "600",
                        }}
                    >
                        лучшее решение
                    </Text>
                </View>

                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: "700",
                        marginBottom: 12,
                    }}
                >
                    1 месяц
                </Text>

                {[
                    "диагностика тестирования",
                    "дорожная карта",
                    "сопровождение ментора",
                    "подборка курсов/секций",
                    "еженедельный отчёт",
                    "достижение поставленной цели",
                ].map((t, i) => (
                    <Text
                        key={i}
                        style={{
                            fontSize: 15,
                            marginBottom: 6,
                        }}
                    >
                        ◦ {t}
                    </Text>
                ))}

                <View style={{marginTop: 14}}>
                    <View
                        style={{
                            alignSelf: "flex-start",
                            borderWidth: 1,
                            borderColor: "#2E2C79",
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            marginBottom: 6,
                        }}
                    >
                        <Text style={{fontSize: 12}}>20% скидка</Text>
                    </View>

                    <Text style={{fontSize: 20, fontWeight: "700"}}>
                        5000 тг/месяц
                    </Text>
                </View>
            </MotiView>

            {/* PAGINATION DOTS */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 40,
                }}
            >
                {[1, 2, 3].map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: i === 1 ? 10 : 8,
                            height: i === 1 ? 10 : 8,
                            backgroundColor: i === 1 ? "#2E2C79" : "#D3D3D3",
                            borderRadius: 999,
                            marginHorizontal: 6,
                        }}
                    />
                ))}
            </View>

            {/* BUTTON */}
            <TouchableOpacity
                onPress={() => router.replace("/(tabs)/chats")}
                style={{
                    backgroundColor: "black",
                    paddingVertical: 16,
                    borderRadius: 28,
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
                    Продолжить — 7 дней бесплатно
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}