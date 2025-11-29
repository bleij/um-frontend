import {
    View,
    Text,
    Image,
    Platform,
    Dimensions,
    Animated,
    PanResponder,
} from "react-native";
import {useRouter} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {MotiView} from "moti";
import {useRef, useState} from "react";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

const SLIDER_WIDTH = IS_DESKTOP ? 360 : width - 48;
const HANDLE_SIZE = 60;
const SLIDE_DISTANCE = SLIDER_WIDTH - HANDLE_SIZE - 4;

export default function UmoIntro() {
    const router = useRouter();

    const sliderX = useRef(new Animated.Value(0)).current;
    const fillWidth = sliderX.interpolate({
        inputRange: [0, SLIDE_DISTANCE],
        outputRange: [HANDLE_SIZE, SLIDER_WIDTH],
        extrapolate: "clamp",
    });

    const [completed, setCompleted] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,

            onPanResponderMove: (_, g) => {
                if (g.dx >= 0 && g.dx <= SLIDE_DISTANCE) {
                    sliderX.setValue(g.dx);
                }
            },

            onPanResponderRelease: (_, g) => {
                if (g.dx > SLIDE_DISTANCE * 0.7) {
                    Animated.timing(sliderX, {
                        toValue: SLIDE_DISTANCE,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        setCompleted(true);
                        setTimeout(() => {
                            router.push("/profile/youth/testing");
                        }, 300);
                    });
                } else {
                    Animated.spring(sliderX, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <LinearGradient
            colors={["#3F3C9F", "#FFFFFF", "#8D88D9"]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={{flex: 1}}
        >
            <View
                style={{
                    flex: 1,
                    paddingTop: 70,
                    paddingHorizontal: 24,
                    alignItems: "center",
                }}
            >
                {/* LOGO */}
                <MotiView
                    from={{opacity: 0, translateY: -20}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 500}}
                >
                    <Image
                        source={require("../../../assets/logo/umo.png")}
                        style={{width: 340, height: 150, resizeMode: "contain"}}
                    />
                </MotiView>

                {/* ROBOT */}
                <View style={{marginTop: 10, alignItems: "center"}}>
                    <MotiView
                        from={{opacity: 0, scale: 0.85}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 600, delay: 250}}
                    >
                        <Image
                            source={require("../../../assets/images/robot.png")}
                            style={{
                                width: IS_DESKTOP ? 300 : 340,
                                height: IS_DESKTOP ? 300 : 340,
                                resizeMode: "contain",
                            }}
                        />
                    </MotiView>

                    {/* SPEECH */}
                    <MotiView
                        from={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 600, delay: 400}}
                        style={{
                            backgroundColor: "rgba(63,60,159,0.15)",
                            paddingVertical: 12,
                            paddingHorizontal: 22,
                            borderRadius: 26,
                            marginTop: -18,
                        }}
                    >
                        <Text
                            style={{
                                color: "#2E2C79",
                                fontSize: 16,
                                fontWeight: "600",
                                textAlign: "center",
                            }}
                        >
                            Давай начнём наше{"\n"}тестирование
                        </Text>
                    </MotiView>
                </View>

                {/* SLIDER */}
                <View
                    style={{
                        marginTop: 44,
                        width: SLIDER_WIDTH,
                        height: 64,
                        borderRadius: 40,
                        borderWidth: 2,
                        borderColor: "#3F3C9F",
                        backgroundColor: "#E6E9FF",
                        overflow: "hidden",
                        justifyContent: "center",
                    }}
                >
                    {/* BLUE FILL */}
                    <Animated.View
                        style={{
                            position: "absolute",
                            height: "100%",
                            width: fillWidth,
                            backgroundColor: "#3F3C9F",
                        }}
                    />

                    {/* TEXT */}
                    <Text
                        style={{
                            position: "absolute",
                            alignSelf: "center",
                            color: completed ? "white" : "#3F3C9F",
                            fontWeight: "700",
                            fontSize: 18,
                        }}
                    >
                        {completed ? "начато" : "начать"}
                    </Text>

                    {/* HANDLE */}
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={{
                            width: HANDLE_SIZE,
                            height: HANDLE_SIZE,
                            borderRadius: HANDLE_SIZE / 2,
                            backgroundColor: completed ? "#2E2C79" : "#3F3C9F",
                            justifyContent: "center",
                            alignItems: "center",
                            transform: [{translateX: sliderX}],
                        }}
                    >
                        <Text style={{color: "white", fontSize: 26}}>➜</Text>
                    </Animated.View>
                </View>
            </View>
        </LinearGradient>
    );
}