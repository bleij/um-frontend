import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    Dimensions,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Feather} from "@expo/vector-icons";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export default function RoleSelect() {
    const router = useRouter();

    const handleSelect = async (role: string, route: string) => {
        await AsyncStorage.setItem("user_role", role);
        router.push(route);
    };

    const roles = [
        {
            label: "Родитель",
            role: "parent",
            route: "/profile/parent/create-profile",
            icon: "user",
        },
        {
            label: "Молодёжь",
            role: "youth",
            route: "/profile/youth/create-profile",
            icon: "zap",
        },
        {
            label: "Ментор",
            role: "mentor",
            route: "/profile/mentor/create-profile",
            icon: "briefcase",
        },
        {
            label: "Организация",
            role: "org",
            route: "/profile/organization/create-profile",
            icon: "layers",
        },
    ];

    return (
        <LinearGradient
            colors={["#3F3C9F", "#EDEBFF"]}
            style={{flex: 1}}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 40,
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: IS_DESKTOP ? "50%" : "100%",
                        paddingHorizontal: 24,
                        paddingTop: 50,
                        alignItems: "center",
                    }}
                >
                    {/* LOGO */}
                    <MotiView
                        from={{opacity: 0, translateY: -12}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 400}}
                        style={{marginBottom: 28}}
                    >
                        <Image
                            source={require("../../assets/logo/logo_white.png")}
                            style={{width: 140, height: 60, resizeMode: "contain"}}
                        />
                    </MotiView>

                    {/* TITLE */}
                    <MotiView
                        from={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 450}}
                        style={{marginBottom: 36}}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 24,
                                fontWeight: "700",
                                textAlign: "center",
                                lineHeight: 30,
                            }}
                        >
                            Выберите свою роль
                        </Text>
                    </MotiView>

                    {/* GRID 2x2 */}
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        {roles.map((item, idx) => (
                            <MotiView
                                key={idx}
                                from={{opacity: 0, translateY: 20}}
                                animate={{opacity: 1, translateY: 0}}
                                transition={{
                                    duration: 350,
                                    delay: 120 + idx * 80,
                                }}
                                style={{
                                    width: "48%",
                                    marginBottom: 20,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        handleSelect(item.role, item.route)
                                    }
                                    style={{
                                        backgroundColor: "rgba(255,255,255,0.14)",
                                        borderRadius: 26,
                                        paddingVertical: 22,
                                        alignItems: "center",
                                        borderWidth: 2,
                                        borderColor: "rgba(255,255,255,0.35)",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 58,
                                            height: 58,
                                            borderRadius: 29,
                                            backgroundColor: "rgba(255,255,255,0.25)",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginBottom: 10,
                                        }}
                                    >
                                        <Feather
                                            name={item.icon as any}
                                            size={26}
                                            color="white"
                                        />
                                    </View>

                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 16,
                                            fontWeight: "600",
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}