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

export default function ParentTesting() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <LinearGradient
            colors={["#6A63D8", "#C7C4F2"]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{flex: 1}}
        >
            <ScrollView
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
                            fontSize: 28,
                            fontWeight: "700",
                            color: "white",
                            marginBottom: 20,
                        }}
                    >
                        Тестирование
                    </Text>
                </MotiView>

                {/* TIMER */}
                <View
                    style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 20,
                        width: 140,
                        marginBottom: 30,
                    }}
                >
                    <Text style={{color: "white", fontWeight: "600", textAlign: "center"}}>
                        5 минут
                    </Text>
                </View>

                {/* QUESTION BLOCK */}
                <View
                    style={{
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 20,
                        marginBottom: 40,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "700",
                            marginBottom: 20,
                            color: "#3A3A3A",
                        }}
                    >
                        Вопрос 1/10
                    </Text>

                    <Text style={{fontSize: 16, marginBottom: 20}}>
                        Что больше всего интересует вашего ребенка?
                    </Text>

                    {["другое", "другое", "другое"].map((text, i) => (
                        <TouchableOpacity
                            key={i}
                            style={{
                                backgroundColor: "#EFEFFE",
                                borderRadius: 30,
                                paddingVertical: 14,
                                paddingHorizontal: 20,
                                marginBottom: 15,
                            }}
                        >
                            <Text style={{textAlign: "center", fontSize: 16}}>{text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* BUTTON */}
                <TouchableOpacity
                    onPress={() => router.push("/profile/parent/results")}
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
                        Следующий вопрос
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}