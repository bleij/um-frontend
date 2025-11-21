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

export default function ParentResults() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}
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
                        fontSize: 32,
                        fontWeight: "800",
                        color: "#111",
                        marginBottom: 20,
                        textAlign: "center",
                    }}
                >
                    Результаты
                </Text>
            </MotiView>

            {/* STAR + CONFETTI */}
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
                <Text style={{fontSize: 60}}>⭐</Text>
            </MotiView>

            {/* PERSONALITY BOX */}
            <View
                style={{
                    borderWidth: 2,
                    borderColor: "#2E2C79",
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 40,
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "700",
                        textAlign: "center",
                        marginBottom: 12,
                        color: "#2E2C79",
                    }}
                >
                    Тип личности
                </Text>

                <Text
                    style={{
                        textAlign: "center",
                        fontSize: 15,
                        color: "#333",
                        lineHeight: 20,
                    }}
                >
                    краткое описание
                </Text>
            </View>

            {/* GRAPH MOCK */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 20,
                }}
            >
                {[40, 80, 55, 20].map((h, i) => (
                    <View
                        key={i}
                        style={{
                            width: 6,
                            height: h,
                            backgroundColor: "#2E2C79",
                            marginHorizontal: 10,
                            borderRadius: 3,
                        }}
                    />
                ))}
            </View>

            {/* STATS */}
            <View style={{marginBottom: 40}}>
                <Text style={{fontSize: 16}}>Отчёт:</Text>
                <Text style={{marginTop: 6, fontSize: 16}}>
                    креативность – 90%
                </Text>
                <Text style={{fontSize: 16}}>
                    аналитика – 65%
                </Text>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
                onPress={() => router.push("/profile/parent/subscribe")}
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
                        fontWeight: "600",
                    }}
                >
                    Продолжить
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}