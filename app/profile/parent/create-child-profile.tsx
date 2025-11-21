import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";

export default function ParentCreateChildProfile() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: isWeb ? "#3F3C9F" : "#3F3C9F",
            }}
            contentContainerStyle={{
                paddingBottom: 60,
                paddingTop: 60,
            }}
        >
            {/* WEB CONTAINER */}
            <View
                style={{
                    maxWidth: isWeb ? 680 : "100%",
                    width: "100%",
                    alignSelf: "center",

                    backgroundColor: isWeb ? "#FFFFFF22" : "transparent",
                    borderRadius: isWeb ? 32 : 0,
                    paddingHorizontal: isWeb ? 36 : 24,
                    paddingBottom: 40,

                    shadowColor: isWeb ? "#000" : undefined,
                    shadowOpacity: isWeb ? 0.06 : 0,
                    shadowRadius: isWeb ? 16 : 0,
                    shadowOffset: isWeb ? {width: 0, height: 4} : undefined,
                }}
            >
                {/* TITLE */}
                <MotiView
                    from={{opacity: 0, translateY: -15}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 400}}
                    style={{marginBottom: 25}}
                >
                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: "700",
                            color: "white",
                        }}
                    >
                        Создайте{"\n"}профиль ребёнка
                    </Text>
                </MotiView>

                {/* INPUTS */}
                {[
                    "Имя",
                    "Возраст",
                    "Пол",
                    "Школа",
                    "Интересы",
                    "Цель",
                ].map((label, index) => (
                    <MotiView
                        key={index}
                        from={{opacity: 0, translateY: 20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 350, delay: 150 + index * 70}}
                        style={{marginBottom: 18}}
                    >
                        <View
                            style={{
                                borderWidth: 2,
                                borderColor: "white",
                                borderRadius: 14,
                                paddingVertical: 12,
                                paddingHorizontal: 14,
                                backgroundColor: "rgba(255,255,255,0.15)",
                            }}
                        >
                            <TextInput
                                placeholder={label}
                                placeholderTextColor="#EEEEEE"
                                style={{
                                    flex: 1,
                                    fontSize: 16,
                                    color: "white",
                                }}
                            />
                        </View>
                    </MotiView>
                ))}

                {/* BUTTON */}
                <MotiView
                    from={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 350, delay: 700}}
                    style={{marginTop: 20, alignItems: "center"}}
                >
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/profile/parent/umo-intro") // следующий экран (робот)
                        }
                        style={{
                            backgroundColor: "white",
                            paddingVertical: 14,
                            paddingHorizontal: 40,
                            borderRadius: 999,
                        }}
                    >
                        <Text
                            style={{
                                color: "#3F3C9F",
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            продолжить
                        </Text>
                    </TouchableOpacity>
                </MotiView>
            </View>
        </ScrollView>
    );
}