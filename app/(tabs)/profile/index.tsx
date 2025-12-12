import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions,
} from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {useRouter} from "expo-router";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export default function ProfileScreen() {
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        AsyncStorage.getItem("user_role").then(setRole);
    }, []);

    const name = "Халилова Сабина";
    const phone = "87777777777";
    const email = "sab@bk.ru";

    return (
        <LinearGradient colors={["#F4F5FF", "#FFFFFF"]} style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingBottom: 140}}>
                {/* LOGO */}
                <View style={{alignItems: "center", paddingTop: 40, marginBottom: 20, marginTop: IS_DESKTOP ? 60 : 40}}>
                    <Image
                        source={require("../../../assets/logo/logo_blue.png")}
                        style={{width: 140, height: 60, resizeMode: "contain"}}
                    />
                </View>

                {/* WRAPPER */}
                <View
                    style={{
                        width: IS_DESKTOP ? "50%" : "100%",
                        alignSelf: "center",
                        paddingHorizontal: 20,
                    }}
                >
                    {/* HEADER */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 28,
                        }}
                    >
                        <View
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 999,
                                backgroundColor: "#3F3C9F",
                                marginRight: 18,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons name="person" size={44} color="white"/>
                        </View>

                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>{name}</Text>
                            <Text style={{marginTop: 4, opacity: 0.7}}>
                                {phone}
                            </Text>
                            <Text style={{opacity: 0.7}}>{email}</Text>
                        </View>

                        <TouchableOpacity>
                            <Ionicons name="settings-outline" size={24} color="#3F3C9F"/>
                        </TouchableOpacity>
                    </View>

                    {/* ROLE CONTENT */}
                    {role === "parent" && <ParentBlock/>}
                    {role === "mentor" && <MentorBlock/>}
                    {role === "youth" && <YouthBlock/>}
                    {role === "org" && <OrgBlock/>}

                    {/* SUBSCRIPTION */}
                    {role !== "mentor" && (
                        <View style={{marginTop: 40}}>
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: "700",
                                    marginBottom: 16,
                                }}
                            >
                                Подписка
                            </Text>

                            <View
                                style={{
                                    backgroundColor: "#EEF0FF",
                                    borderRadius: 24,
                                    padding: 24,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        textAlign: "center",
                                        marginBottom: 18,
                                        fontWeight: "700",
                                    }}
                                >
                                    Premium
                                </Text>

                                <TouchableOpacity
                                    onPress={() => router.push("profile/common/subscribe")}
                                    style={{
                                        backgroundColor: "#3F3C9F",
                                        paddingVertical: 14,
                                        borderRadius: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Управлять подпиской
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

/* ---------------- PARENT ---------------- */

function ParentBlock() {
    const [activeChild, setActiveChild] = useState<null | { name: string; age: string }>(null);

    return (
        <View>
            <Text style={{fontSize: 24, fontWeight: "700", marginBottom: 16}}>
                Мои дети
            </Text>

            <ChildCard
                name="Алия"
                age="8"
                onPress={() => setActiveChild({name: "Алия", age: "8"})}
            />
            <ChildCard
                name="Асия"
                age="13"
                onPress={() => setActiveChild({name: "Асия", age: "13"})}
            />

            <TouchableOpacity
                style={{
                    marginTop: 10,
                    width: 46,
                    height: 46,
                    borderRadius: 999,
                    backgroundColor: "#3F3C9F",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Ionicons name="add" size={24} color="white"/>
            </TouchableOpacity>

            {/* ✅ МОДАЛКА */}
            {activeChild && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: "85%",
                            backgroundColor: "white",
                            borderRadius: 24,
                            padding: 24,
                        }}
                    >
                        <Text style={{fontSize: 22, fontWeight: "700", marginBottom: 12}}>
                            {activeChild.name}
                        </Text>

                        <Text style={{fontSize: 16, marginBottom: 20}}>
                            Возраст: {activeChild.age} лет
                        </Text>

                        <TouchableOpacity
                            style={{
                                backgroundColor: "#3F3C9F",
                                paddingVertical: 12,
                                borderRadius: 14,
                                marginBottom: 12,
                            }}
                        >
                            <Text style={{color: "white", textAlign: "center"}}>
                                Смотреть прогресс
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveChild(null)}
                            style={{
                                paddingVertical: 12,
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: "#3F3C9F",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#3F3C9F",
                                    textAlign: "center",
                                }}
                            >
                                Закрыть
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

function ChildCard({name, age, onPress}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: "#EEF0FF",
                borderRadius: 22,
                padding: 20,
                marginBottom: 16,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text style={{fontSize: 16, fontWeight: "600"}}>
                    {name}, {age} лет
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#3F3C9F"/>
            </View>
        </TouchableOpacity>
    );
}

/* ---------------- MENTOR ---------------- */

function MentorBlock() {
    const router = useRouter();

    return (
        <View style={{marginBottom: 30}}>
            <Text style={{fontSize: 24, fontWeight: "700", marginBottom: 16}}>
                Мои ученики
            </Text>

            <View
                style={{
                    backgroundColor: "#EEF0FF",
                    borderRadius: 22,
                    padding: 20,
                    marginBottom: 16,
                }}
            >
                <Text style={{fontSize: 16, marginBottom: 6}}>
                    Активных учеников: <Text style={{fontWeight: "700"}}>5</Text>
                </Text>
                <Text style={{fontSize: 16}}>
                    Проверено заданий: <Text style={{fontWeight: "700"}}>32</Text>
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => router.push("(tabs)/analytics")}
                style={{
                    backgroundColor: "#3F3C9F",
                    paddingVertical: 14,
                    borderRadius: 20,
                }}
            >
                <Text style={{color: "white", textAlign: "center", fontWeight: "600"}}>
                    Перейти в аналитику
                </Text>
            </TouchableOpacity>
        </View>
    );
}

/* ---------------- YOUTH ---------------- */

function YouthBlock() {
    const router = useRouter();

    return (
        <View style={{marginBottom: 30}}>
            <Text style={{fontSize: 24, fontWeight: "700", marginBottom: 16}}>
                Мой прогресс
            </Text>

            <View
                style={{
                    backgroundColor: "#EEF0FF",
                    borderRadius: 22,
                    padding: 24,
                    marginBottom: 16,
                }}
            >
                <Text style={{fontSize: 16}}>Пройдено курсов: 3</Text>
                <Text style={{fontSize: 16, marginTop: 6}}>
                    Активный курс: Программирование
                </Text>
                <Text style={{fontSize: 16, marginTop: 6}}>
                    Достижений: 7
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => router.push("(tabs)/analytics")}
                style={{
                    backgroundColor: "#3F3C9F",
                    paddingVertical: 14,
                    borderRadius: 20,
                }}
            >
                <Text style={{color: "white", textAlign: "center", fontWeight: "600"}}>
                    Смотреть достижения
                </Text>
            </TouchableOpacity>
        </View>
    );
}

/* ---------------- ORGANIZATION ---------------- */

function OrgBlock() {
    const router = useRouter();

    return (
        <View style={{marginBottom: 30}}>
            <Text style={{fontSize: 24, fontWeight: "700", marginBottom: 16}}>
                Организация
            </Text>

            <View
                style={{
                    backgroundColor: "#EEF0FF",
                    borderRadius: 22,
                    padding: 24,
                    marginBottom: 16,
                }}
            >
                <Text style={{fontSize: 16}}>Преподавателей: 12</Text>
                <Text style={{fontSize: 16, marginTop: 6}}>Учеников: 248</Text>
                <Text style={{fontSize: 16, marginTop: 6}}>Групп: 18</Text>
            </View>

            <TouchableOpacity
                onPress={() => router.push("(tabs)/analytics")}
                style={{
                    backgroundColor: "#3F3C9F",
                    paddingVertical: 14,
                    borderRadius: 20,
                }}
            >
                <Text style={{color: "white", textAlign: "center", fontWeight: "600"}}>
                    Панель управления
                </Text>
            </TouchableOpacity>
        </View>
    );
}