import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import {useRouter} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {MotiView} from "moti";

export default function UmoIntro() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <LinearGradient
            colors={["#5A4FF3", "#A8B4FF"]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{
                flex: 1,
                paddingTop: 80,
                paddingHorizontal: 24,
            }}
        >
            {/* WEB CONTAINER */}
            <View
                style={{
                    maxWidth: isWeb ? 680 : "100%",
                    width: "100%",
                    alignSelf: "center",
                    flex: 1,
                }}
            >
                {/* TITLE */}
                <MotiView
                    from={{opacity: 0, translateY: -20}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 500}}
                    style={{alignItems: "center", marginBottom: 20}}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 34,
                            fontWeight: "800",
                            textAlign: "center",
                        }}
                    >
                        Встречайте{" "}
                        <Text style={{color: "#EDEAFF"}}>UMO!</Text>
                    </Text>
                </MotiView>

                {/* ROBOT + BUBBLE */}
                <View style={{alignItems: "center"}}>
                    <MotiView
                        from={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 600, delay: 150}}
                    >
                        <Image
                            source={require("../../../assets/images/robot.png")}
                            style={{width: 260, height: 260, resizeMode: "contain"}}
                        />
                    </MotiView>

                    {/* SPEECH BUBBLE */}
                    <MotiView
                        from={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 600, delay: 300}}
                        style={{
                            backgroundColor: "rgba(255,255,255,0.35)",
                            paddingVertical: 10,
                            paddingHorizontal: 18,
                            borderRadius: 20,
                            marginTop: -20,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "500",
                                textAlign: "center",
                            }}
                        >
                            Давай начнём наше{"\n"}тестирование
                        </Text>
                    </MotiView>
                </View>

                {/* BUTTON */}
                <MotiView
                    from={{opacity: 0, translateY: 20}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 600, delay: 450}}
                    style={{
                        marginTop: 40,
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.push("/profile/parent/testing")}
                        style={{
                            backgroundColor: "rgba(0,0,0,0.25)",
                            paddingVertical: 16,
                            paddingHorizontal: 34,
                            borderRadius: 30,
                            borderWidth: 2,
                            borderColor: "white",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 20,
                                fontWeight: "700",
                            }}
                        >
                            Начать
                        </Text>
                    </TouchableOpacity>
                </MotiView>
            </View>
        </LinearGradient>
    );
}