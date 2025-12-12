import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import WebOnly from "../../components/WebOnly";

export default function LoginScreen() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: isWeb ? "#2E2C79" : "#FFFFFF",
            }}
            contentContainerStyle={{paddingBottom: 60}}
        >

            {/* MAIN CONTAINER (WEB CARD) */}
            <View
                style={{
                    maxWidth: isWeb ? 680 : "100%",
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: isWeb ? "#FFFFFF" : "transparent",
                    paddingHorizontal: isWeb ? 36 : 0,
                    borderRadius: isWeb ? 32 : 0,
                    overflow: "hidden",

                    shadowColor: isWeb ? "#000" : undefined,
                    shadowOpacity: isWeb ? 0.07 : 0,
                    shadowRadius: isWeb ? 18 : 0,
                    shadowOffset: isWeb ? {width: 0, height: 6} : undefined,
                }}
            >

                {/* HEADER */}
                <View
                    style={{
                        height: 380,
                        backgroundColor: "#2E2C79",
                        borderBottomLeftRadius: 50,
                        borderBottomRightRadius: 50,
                        paddingHorizontal: 24,
                        paddingTop: 20,          // возвращаем комфортный верхний отступ для кнопки
                    }}
                >
                    {/* Назад */}
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-white text-base">← Назад</Text>
                    </TouchableOpacity>

                    {/* Центрированный блок */}
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >

                        {/* Лого */}
                        <MotiView
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 450 }}
                            style={{ marginBottom: 6 }}
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

                        {/* Заголовок */}
                        <MotiView
                            from={{ opacity: 0, translateY: -10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 450, delay: 150 }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 28,
                                    fontWeight: "700",
                                    textAlign: "center",
                                }}
                            >
                                Добро пожаловать!
                            </Text>
                        </MotiView>

                        {/* Подзаголовок */}
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 450, delay: 250 }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    opacity: 0.8,
                                    marginTop: 4,
                                    fontSize: 15,
                                    lineHeight: 20,
                                    textAlign: "center",
                                }}
                            >
                                Готов продолжить путь?
                            </Text>
                        </MotiView>

                    </View>
                </View>

                {/* INPUTS */}
                <View
                    className="mt-8"
                    style={{paddingHorizontal: isWeb ? 0 : 24}}
                >
                    {["Enter email", "Enter password"].map((placeholder, i) => (
                        <MotiView
                            key={i}
                            from={{opacity: 0, translateY: 20}}
                            animate={{opacity: 1, translateY: 0}}
                            transition={{duration: 350, delay: 120 + i * 70}}
                            style={{marginBottom: 20}}
                        >
                            <TextInput
                                placeholder={placeholder}
                                placeholderTextColor="#A5A5A5"
                                secureTextEntry={placeholder === "Enter password"}
                                className="border-2 border-[#2E2C79] rounded-2xl p-4 text-lg bg-white"
                            />
                        </MotiView>
                    ))}
                </View>

                {/* REMEMBER + FORGOT */}
                <View
                    className="flex-row justify-between items-center mt-2"
                    style={{paddingHorizontal: isWeb ? 0 : 24}}
                >
                    <View className="flex-row items-center">
                        <View className="w-5 h-5 rounded border border-gray-400 mr-2"/>
                        <Text className="text-sm">Запомнить меня</Text>
                    </View>

                    <Text className="text-[#2E2C79] text-sm">Забыли пароль?</Text>
                </View>

                {/* LOGIN BUTTON */}
                <MotiView
                    from={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 350, delay: 350}}
                    className="w-full mt-10 mb-4"
                    style={{flexDirection: "row", justifyContent: "center"}}
                >
                    <TouchableOpacity
                        onPress={() => router.push("/(tabs)/home")}
                        className="bg-[#2E2C79] h-14 rounded-full items-center justify-center"
                        style={{width: 230}}
                    >
                        <Text className="text-white text-lg font-semibold">
                            ВОЙТИ
                        </Text>
                    </TouchableOpacity>
                </MotiView>

                {/* SOCIAL DIVIDER */}
                <View className="flex-row items-center justify-center mt-14 px-10">
                    <View className="flex-1 h-[1px] bg-gray-300"/>
                    <Text className="mx-4 text-gray-500">войти с</Text>
                    <View className="flex-1 h-[1px] bg-gray-300"/>
                </View>

                {/* SOCIAL ICONS */}
                <MotiView
                    from={{opacity: 0, translateY: 12}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 350, delay: 450}}
                    className="mt-6 mb-12"
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

                <WebOnly style={{height: 20}}/>

            </View>
        </ScrollView>
    );
}