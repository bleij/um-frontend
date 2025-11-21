import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RoleSelect() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";

    const handleSelect = async (role: string, route: string) => {
        await AsyncStorage.setItem("user_role", role);
        router.push(route);
    };

    const roles = [
        {label: "родитель", role: "parent", route: "/profile/parent/create-profile"},
        {label: "молодёжь", role: "youth", route: "/profile/youth/create-profile"},
        {label: "ментор", role: "mentor", route: "/profile/mentor/create-profile"},
        {label: "организация", role: "org", route: "/profile/org/create-profile"},
    ];

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}
            contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 0,
            }}
        >
            <View
                style={{
                    maxWidth: isWeb ? 680 : "100%",
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: isWeb ? "#FFFFFF" : "transparent",
                    borderRadius: isWeb ? 32 : 0,
                    overflow: "hidden",

                    shadowColor: isWeb ? "#000" : undefined,
                    shadowOpacity: isWeb ? 0.07 : 0,
                    shadowRadius: isWeb ? 18 : 0,
                    shadowOffset: isWeb ? {width: 0, height: 6} : undefined,
                }}
            >

                {/* TOP WHITE SECTION */}
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        alignItems: "center",
                        paddingTop: 40,
                        paddingBottom: 28,
                    }}
                >
                    <MotiView
                        from={{opacity: 0, scale: 0.7, translateY: -20}}
                        animate={{opacity: 1, scale: 1, translateY: 0}}
                        transition={{duration: 450}}
                    >
                        <Image
                            source={require("../../assets/logo/logo_blue.png")}
                            style={{
                                width: 140,
                                height: 140,
                                resizeMode: "contain",
                            }}
                        />
                    </MotiView>
                </View>

                {/* GRADIENT SECTION */}
                <LinearGradient
                    colors={["#3F3C9F", "#F9F9F9"]}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={{
                        borderTopLeftRadius: 60,
                        borderTopRightRadius: 60,
                        paddingTop: 40,
                        paddingBottom: 80,
                        alignItems: "center",
                        paddingHorizontal: isWeb ? 80 : 32,
                        width: "100%",
                    }}
                >

                    {/* TITLE */}
                    <MotiView
                        from={{opacity: 0, translateY: -10}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 450}}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 28,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: 40,
                                lineHeight: 32,
                            }}
                        >
                            Выберите свою{"\n"}роль
                        </Text>
                    </MotiView>

                    {/* ROLE BUTTONS */}
                    {roles.map((item, idx) => (
                        <MotiView
                            key={idx}
                            from={{opacity: 0, translateY: 20}}
                            animate={{opacity: 1, translateY: 0}}
                            transition={{duration: 350, delay: 150 + idx * 80}}
                            style={{
                                width: "100%",
                                marginBottom: 20,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handleSelect(item.role, item.route)}
                                style={{
                                    width: "100%",
                                    paddingVertical: 16,
                                    borderRadius: 30,
                                    backgroundColor: "rgba(45,45,45,0.15)",
                                    borderWidth: 2,
                                    borderColor: "#2E2C79",
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontSize: 18,
                                        fontWeight: "600",
                                        color: "white",
                                    }}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        </MotiView>
                    ))}

                </LinearGradient>
            </View>
        </ScrollView>
    );
}