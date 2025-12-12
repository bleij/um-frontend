import React, {useEffect, useMemo, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Dimensions,
    Image,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Feather} from "@expo/vector-icons";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

type Role = "parent" | "youth" | "org" | "mentor";

const SUBSCRIPTIONS = {
    parent: [
        {title: "Базовый", price: "4 900 ₸ / мес", features: ["Диагностика ребёнка", "Подбор курсов", "Рекомендации"]},
        {
            title: "Стандарт",
            price: "9 900 ₸ / мес",
            popular: true,
            features: ["Детальная диагностика", "Индивидуальная дорожная карта", "Подбор курсов", "Еженедельные отчёты"],
        },
        {
            title: "Премиум",
            price: "14 900 ₸ / мес",
            features: ["Полное сопровождение", "Личный ментор", "Аналитика прогресса", "Отчёты + рекомендации"]
        },
    ],
    youth: [
        {title: "Старт", price: "3 900 ₸ / мес", features: ["Тестирование", "Подбор направления", "Доступ к курсам"]},
        {
            title: "Развитие",
            price: "7 900 ₸ / мес",
            popular: true,
            features: ["Полный доступ к курсам", "Прогресс и достижения", "Отчёты"],
        },
        {title: "Про", price: "11 900 ₸ / мес", features: ["Ментор", "Индивидуальный план", "Полная аналитика"]},
    ],
    org: [
        {
            title: "Базовый",
            price: "19 900 ₸ / мес",
            features: ["Профиль организации", "Приём заявок", "Список учеников"]
        },
        {
            title: "Команда",
            price: "29 900 ₸ / мес",
            popular: true,
            features: ["Менторы", "Отчёты", "Аналитика групп"],
        },
        {title: "Бизнес", price: "49 900 ₸ / мес", features: ["Финансовые отчёты", "Экспорт данных", "API доступ"]},
    ],
} as const;

function planKey(role: Role) {
    return `subscription_plan_${role}`;
}

export default function SubscribeScreen() {
    const router = useRouter();
    const [role, setRole] = useState<Role | null>(null);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => setRole((v as Role) || "parent"));
    }, []);

    useEffect(() => {
        if (!role) return;
        AsyncStorage.getItem(planKey(role)).then((v) => setSelected(v));
    }, [role]);

    const plans = useMemo(() => {
        if (!role) return [];
        if (role === "mentor") return [];
        return SUBSCRIPTIONS[role as keyof typeof SUBSCRIPTIONS] ?? [];
    }, [role]);

    async function choosePlan(title: string) {
        if (!role) return;
        await AsyncStorage.setItem(planKey(role), title);
        setSelected(title);
        router.replace("/(tabs)/home"); // после выбора подписки отправляем на home (первый таб)
    }

    return (
        <LinearGradient colors={["#3F3C9F", "#ECEBFF"]} style={{flex: 1}}>
            <ScrollView
                contentContainerStyle={{
                    paddingTop: 60,
                    paddingBottom: 120,
                    paddingHorizontal: 20,
                    alignItems: IS_DESKTOP ? "center" : "stretch",
                }}
            >
                <View style={{width: IS_DESKTOP ? "50%" : "100%"}}>
                    <MotiView
                        from={{opacity: 0, translateY: -10}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 400}}
                        style={{alignItems: "center", marginBottom: 10}}
                    >
                        <Image
                            source={require("../../../assets/logo/logo_white.png")}
                            style={{width: 160, height: 120, resizeMode: "contain"}}
                        />
                    </MotiView>

                    <Text style={{
                        fontSize: 28,
                        fontWeight: "800",
                        textAlign: "center",
                        color: "white",
                        marginBottom: 10
                    }}>
                        Подписки
                    </Text>

                    <Text style={{textAlign: "center", fontSize: 14, opacity: 0.8, color: "white", marginBottom: 28}}>
                        выберите подходящий план
                    </Text>

                    {plans.map((plan, i) => {
                        const isSelected = selected === plan.title;

                        return (
                            <MotiView
                                key={`${plan.title}_${i}`}
                                from={{opacity: 0, translateY: 20}}
                                animate={{opacity: 1, translateY: 0}}
                                transition={{duration: 350, delay: i * 120}}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 26,
                                    padding: 22,
                                    marginBottom: 24,
                                    borderWidth: plan.popular || isSelected ? 2 : 1,
                                    borderColor: isSelected ? "#2E2C79" : plan.popular ? "#3F3C9F" : "rgba(15, 23, 42, 0.08)",
                                }}
                            >
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    {plan.popular ? (
                                        <View
                                            style={{
                                                backgroundColor: "#3F3C9F",
                                                paddingVertical: 4,
                                                paddingHorizontal: 10,
                                                borderRadius: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text style={{color: "white", fontSize: 12}}>популярный</Text>
                                        </View>
                                    ) : (
                                        <View/>
                                    )}

                                    {isSelected ? (
                                        <View
                                            style={{
                                                backgroundColor: "#2E2C79",
                                                paddingVertical: 4,
                                                paddingHorizontal: 10,
                                                borderRadius: 10,
                                                marginBottom: 10,
                                                flexDirection: "row",
                                                gap: 6,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Feather name="check" size={14} color="white"/>
                                            <Text style={{color: "white", fontSize: 12}}>выбран</Text>
                                        </View>
                                    ) : null}
                                </View>

                                <Text style={{fontSize: 22, fontWeight: "700", marginBottom: 6}}>{plan.title}</Text>

                                <Text style={{fontSize: 18, fontWeight: "800", color: "#3F3C9F", marginBottom: 16}}>
                                    {plan.price}
                                </Text>

                                {plan.features.map((f, idx) => (
                                    <View key={idx}
                                          style={{flexDirection: "row", alignItems: "center", marginBottom: 8}}>
                                        <Feather name="check" size={18} color="#3F3C9F"/>
                                        <Text style={{marginLeft: 10, fontSize: 15}}>{f}</Text>
                                    </View>
                                ))}

                                <TouchableOpacity
                                    onPress={() => choosePlan(plan.title)}
                                    style={{
                                        backgroundColor: isSelected ? "#2E2C79" : "#3F3C9F",
                                        marginTop: 20,
                                        paddingVertical: 14,
                                        borderRadius: 999,
                                    }}
                                >
                                    <Text
                                        style={{textAlign: "center", color: "white", fontSize: 16, fontWeight: "700"}}>
                                        {isSelected ? "оставить выбранным" : "выбрать"}
                                    </Text>
                                </TouchableOpacity>
                            </MotiView>
                        );
                    })}
                </View>
            </ScrollView>
        </LinearGradient>
    );
}