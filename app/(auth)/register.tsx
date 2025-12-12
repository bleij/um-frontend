import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform, Dimensions,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import WebOnly from "../../components/WebOnly";

export default function RegisterScreen() {
    const router = useRouter();

    const isWeb = Platform.OS === "web";
    const {width} = Dimensions.get("window");
    const IS_DESKTOP = Platform.OS === "web" && width >= 900;

    return (
        <ScrollView
            className="flex-1"
            style={{
                backgroundColor: isWeb ? "#2E2C79" : "#FFFFFF",
            }}
            contentContainerStyle={{paddingBottom: 60}}
        >
            {/* MAIN CONTAINER */}
            <View
                style={{
                    maxWidth: isWeb ? 680 : "100%",   // ⬅ шире
                    width: "100%",
                    alignSelf: "center",

                    backgroundColor: isWeb ? "#FFFFFF" : "transparent",

                    paddingHorizontal: isWeb ? 36 : 0, // чуть больше паддинг, только web

                    borderRadius: isWeb ? 32 : 0,      // ⬅ красивое скругление
                    overflow: "hidden",

                    // лёгкая тень, только web
                    shadowColor: isWeb ? "#000" : undefined,
                    shadowOpacity: isWeb ? 0.07 : 0,
                    shadowRadius: isWeb ? 18 : 0,
                    shadowOffset: isWeb ? {width: 0, height: 6} : undefined,
                }}
            >

                {/* HEADER */}
                <View
                    className="h-[380px] px-6 pt-12"
                    style={{
                        backgroundColor: "#2E2C79",
                        borderBottomLeftRadius: 50,
                        borderBottomRightRadius: 50,
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-white text-base">← Назад</Text>
                    </TouchableOpacity>

                    <View className="items-center mt-4">

                        <MotiView
                            from={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 450}}
                            style={{marginBottom: 6}}
                        >
                            <Image
                                source={require("../../assets/logo/logo_white.png")}
                                style={{
                                    width: 180,
                                    height: 180,
                                    resizeMode: "contain",
                                }}
                            />
                        </MotiView>

                        <MotiView
                            from={{opacity: 0, translateY: -10}}
                            animate={{opacity: 1, translateY: 0}}
                            transition={{duration: 450, delay: 150}}
                        >
                            <Text className="text-white text-[26px] mt-2 font-bold text-center">
                                Создайте свой аккаунт
                            </Text>
                        </MotiView>

                        <MotiView
                            from={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 450, delay: 250}}
                        >
                            <Text className="text-white opacity-80 mt-1 text-center text-[14px] leading-5">
                                Мы здесь, чтобы ты достиг цели{"\n"}Ты готов?
                            </Text>
                        </MotiView>

                    </View>
                </View>

                {/* INPUTS */}
                <View className="mt-8" style={{paddingHorizontal: isWeb ? 0 : 24}}>

                    {["Enter email", "Enter password", "Repeat password"].map(
                        (placeholder, i) => (
                            <MotiView
                                key={i}
                                from={{opacity: 0, translateY: 20}}
                                animate={{opacity: 1, translateY: 0}}
                                transition={{duration: 350, delay: 100 + i * 50}}
                                style={{marginBottom: 20}}
                            >
                                <TextInput
                                    placeholder={placeholder}
                                    placeholderTextColor="#A5A5A5"
                                    secureTextEntry={placeholder === "Enter password"}
                                    className="border-2 border-[#5E4BF5] rounded-2xl p-4 text-lg"
                                />
                            </MotiView>
                        )
                    )}

                </View>

                {/* BUTTON */}
                <MotiView
                    from={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 350, delay: 350}}
                    className="w-full mt-2 mb-4"
                    style={{flexDirection: "row", justifyContent: "center"}}
                >
                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/role")}
                        className="bg-[#2B1F9A] h-14 rounded-full items-center justify-center"
                        style={{width: 230}}
                    >
                        <Text className="text-white text-lg font-semibold">
                            начать
                        </Text>
                    </TouchableOpacity>
                </MotiView>

                {/* DIVIDER */}
                <View className="flex-row items-center justify-center mt-10">
                    <View className="flex-1 h-[1px] bg-gray-300"/>
                    <Text className="mx-3 text-gray-500 text-sm">
                        зарегистрироваться через
                    </Text>
                    <View className="flex-1 h-[1px] bg-gray-300"/>
                </View>

                {/* ICONS */}
                <MotiView
                    from={{opacity: 0, translateY: 10}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 300, delay: 450}}
                    className="mt-6 mb-10"
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Image source={require("../../assets/icons/apple.png")} className="w-9 h-9 mx-4"/>
                    <Image source={require("../../assets/icons/google.png")} className="w-9 h-9 mx-4"/>
                    <Image source={require("../../assets/icons/facebook.png")} className="w-9 h-9 mx-4"/>
                </MotiView>

                {/* LOGIN */}
                <MotiView
                    from={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 300, delay: 500}}
                    className="items-center mb-12"
                >
                    <Text className="text-gray-600 text-[13px]">
                        уже есть аккаунт?{" "}
                        <Text
                            className="text-[#2B1F9A] font-semibold"
                            onPress={() => router.push("./login")}
                        >
                            Войти
                        </Text>
                    </Text>

                    {/* ДОП ОТСТУП ТОЛЬКО НА WEB */}
                    <WebOnly style={{height: 20}}/>
                </MotiView>

            </View>

        </ScrollView>
    );
}