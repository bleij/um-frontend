import {
    View,
    Text,
    ScrollView,
    Platform,
    Dimensions,
    Image,
} from "react-native";
import {MotiView} from "moti";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LinearGradient} from "expo-linear-gradient";
import {Feather} from "@expo/vector-icons";

const {width} = Dimensions.get("window");

// ✅ ТОЛЬКО реальный десктоп
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export default function HomeScreen() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem("user_role").then(setRole);
    }, []);

    const roleContent: Record<string, any> = {
        mentor: {
            greeting: "Добро пожаловать, ментор",
            mainCard: "Сегодня у вас 3 активных чата",
            activities: [
                {title: "Новый запрос", icon: "message-square"},
                {title: "Проверка отчёта", icon: "file-text"},
                {title: "Созвон с учеником", icon: "video"},
            ],
        },
        parent: {
            greeting: "Приветствуем, родитель",
            mainCard: "Прогресс ребёнка за неделю",
            activities: [
                {title: "Результаты теста", icon: "bar-chart-2"},
                {title: "Рекомендация", icon: "award"},
                {title: "Новый отчёт", icon: "clipboard"},
            ],
        },
        youth: {
            greeting: "Привет!",
            mainCard: "Готов продолжить обучение?",
            activities: [
                {title: "Новый урок", icon: "book-open"},
                {title: "Доступный тест", icon: "check-circle"},
                {title: "Новое достижение", icon: "star"},
            ],
        },
        org: {
            greeting: "Панель организации",
            mainCard: "Общая статистика",
            activities: [
                {title: "Новые заявки", icon: "user-plus"},
                {title: "Отчёты групп", icon: "pie-chart"},
                {title: "Посещаемость", icon: "activity"},
            ],
        },
    };

    const data = roleContent[role ?? "parent"];

    return (
        <LinearGradient colors={["#FFFFFF", "#F3F2FF"]} style={{flex: 1}}>
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{
                    paddingTop: 40,
                    paddingBottom: 140,
                    paddingHorizontal: 20,
                    alignItems: IS_DESKTOP ? "center" : "stretch",
                }}
            >
                {/* LOGO */}
                <MotiView
                    from={{opacity: 0, translateY: -10}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 400}}
                    style={{alignItems: "center", marginBottom: 24, marginTop: IS_DESKTOP ? 60 : 40}}
                >
                    <Image
                        source={require("../../../assets/logo/logo_blue.png")}
                        style={{width: 140, height: 60, resizeMode: "contain"}}
                    />
                </MotiView>

                {/* ✅ ОБЁРТКА: 50% ТОЛЬКО НА ДЕСКТОПЕ */}
                <View
                    style={{
                        width: IS_DESKTOP ? "50%" : "100%",
                    }}
                >
                    <Content data={data}/>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

/* ------------------------- */
/* ВЕСЬ ОСНОВНОЙ КОНТЕНТ */

/* ------------------------- */

function Content({data}) {
    return (
        <>
            {/* GREETING */}
            <MotiView
                from={{opacity: 0, translateY: -15}}
                animate={{opacity: 1, translateY: 0}}
                transition={{duration: 500}}
                style={{marginBottom: 24}}
            >
                <Text style={{fontSize: 26, fontWeight: "700"}}>
                    {data.greeting}
                </Text>
            </MotiView>

            {/* MAIN CARD */}
            <MotiView
                from={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 450}}
                style={{borderRadius: 24, marginBottom: 40, overflow: "hidden"}}
            >
                <LinearGradient
                    colors={["#3F3C9F", "#8D88D9"]}
                    style={{
                        height: 180,
                        justifyContent: "center",
                        paddingHorizontal: 24,
                    }}
                >
                    <Text style={{color: "white", fontSize: 22, fontWeight: "700"}}>
                        {data.mainCard}
                    </Text>
                    <Text style={{color: "white", opacity: 0.8, marginTop: 8}}>
                        Обновлено только что
                    </Text>
                </LinearGradient>
            </MotiView>

            {/* ACTIVITIES */}
            <Text style={{fontSize: 20, fontWeight: "700", marginBottom: 18}}>
                Активности
            </Text>

            {data.activities.map((item, index) => (
                <MotiView
                    key={index}
                    from={{opacity: 0, translateY: 20}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 400, delay: 150 + index * 120}}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 20,
                    }}
                >
                    {/* ICON */}
                    <View
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: "#3F3C9F",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 16,
                        }}
                    >
                        <Feather name={item.icon} size={26} color="white"/>
                    </View>

                    {/* TEXT */}
                    <View
                        style={{
                            flex: 1,
                            minHeight: 64,
                            borderWidth: 2,
                            borderColor: "#3F3C9F",
                            borderRadius: 16,
                            justifyContent: "center",
                            paddingHorizontal: 16,
                            backgroundColor: "white",
                        }}
                    >
                        <Text style={{fontSize: 16, fontWeight: "600"}}>
                            {item.title}
                        </Text>
                        <Text style={{opacity: 0.6, fontSize: 13}}>
                            обновлено недавно
                        </Text>
                    </View>
                </MotiView>
            ))}
        </>
    );
}