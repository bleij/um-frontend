import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Image,
    Dimensions,
} from "react-native";
import {MotiView} from "moti";
import {useEffect, useMemo, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

const PERIODS = ["неделя", "месяц", "год"];

const ROLE_DATA = {
    parent: {
        name: "Олжас",
        age: "10 лет",
        charts: {
            неделя: [20, 35, 50, 70],
            месяц: [40, 60, 90, 120],
            год: [60, 100, 140, 190],
        },
        notes: [
            "улучшил внимание",
            "стабильный интерес к математике",
            "стал увереннее в заданиях",
            "высокая вовлечённость",
        ],
    },

    youth: {
        name: "Ты",
        age: "15 лет",
        charts: {
            неделя: [30, 50, 60, 90],
            месяц: [70, 100, 130, 170],
            год: [90, 140, 170, 210],
        },
        notes: [
            "стало легче учиться",
            "лучше концентрация",
            "меньше прокрастинации",
            "виден рост мотивации",
        ],
    },

    mentor: {
        name: "Группа учеников",
        age: "12–16 лет",
        charts: {
            неделя: [40, 70, 90, 120],
            месяц: [80, 120, 160, 200],
            год: [120, 170, 210, 260],
        },
        notes: [
            "ученики активны",
            "стабильный рост",
            "хороший отклик",
            "низкий процент отсева",
        ],
    },

    org: {
        name: "Центр UM",
        age: "все группы",
        charts: {
            неделя: [60, 90, 120, 160],
            месяц: [120, 160, 210, 260],
            год: [160, 220, 280, 340],
        },
        notes: [
            "рост регистраций",
            "высокая посещаемость",
            "хорошее удержание",
            "прибыль растёт",
        ],
    },
};

export default function AnalyticsScreen() {
    const [role, setRole] = useState<string | null>(null);
    const [period, setPeriod] = useState("неделя");

    useEffect(() => {
        AsyncStorage.getItem("user_role").then(setRole);
    }, []);

    const data = ROLE_DATA[role ?? "parent"];

    const chartData = data.charts[period];

    return (
        <ScrollView
            style={{flex: 1, backgroundColor: "#FFFFFF"}}
            contentContainerStyle={{
                paddingTop: 60,
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
                style={{alignItems: "center", marginBottom: 24}}
            >
                <Image
                    source={require("../../../assets/logo/logo_blue.png")}
                    style={{width: 140, height: 60, resizeMode: "contain"}}
                />
            </MotiView>

            {/* ✅ ОБЁРТКА ШИРИНЫ */}
            <View style={{width: IS_DESKTOP ? "50%" : "100%"}}>

                {/* PROFILE CARD */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#F2F2F2",
                        borderRadius: 24,
                        padding: 16,
                        marginBottom: 25,
                    }}
                >
                    <View
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: 50,
                            backgroundColor: "#3430B5",
                            marginRight: 20,
                        }}
                    />

                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>
                            {data.name}
                        </Text>

                        <Text style={{opacity: 0.6, marginBottom: 10}}>
                            {data.age}
                        </Text>

                        {/* PERIOD BUTTONS */}
                        <View style={{flexDirection: "row", gap: 8}}>
                            {PERIODS.map((p) => {
                                const active = p === period;

                                return (
                                    <TouchableOpacity
                                        key={p}
                                        onPress={() => setPeriod(p)}
                                        style={{
                                            borderRadius: 12,
                                            paddingVertical: 6,
                                            paddingHorizontal: 12,
                                            backgroundColor: active
                                                ? "#3430B5"
                                                : "white",
                                            borderWidth: 1,
                                            borderColor: "#3430B5",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: active ? "white" : "#3430B5",
                                                fontWeight: "600",
                                                fontSize: 13,
                                            }}
                                        >
                                            {p}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* CHART */}
                <View
                    style={{
                        backgroundColor: "#F3F2FF",
                        padding: 20,
                        borderRadius: 24,
                        marginBottom: 30,
                        height: 260,
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <View style={{flexDirection: "row", alignItems: "flex-end", gap: 20}}>
                        {chartData.map((value, i) => (
                            <MotiView
                                key={i}
                                from={{height: 0, opacity: 0}}
                                animate={{height: value, opacity: 1}}
                                transition={{duration: 500, delay: i * 120}}
                                style={{
                                    width: 30,
                                    backgroundColor: "#3430B5",
                                    borderRadius: 8,
                                }}
                            />
                        ))}
                    </View>
                </View>

                {/* NOTES */}
                <View
                    style={{
                        flexDirection: "row",
                        gap: 20,
                        marginBottom: 40,
                    }}
                >
                    <View
                        style={{
                            width: "38%",
                            height: 140,
                            backgroundColor: "#3430B5",
                            borderRadius: 20,
                        }}
                    />

                    <View style={{flex: 1, justifyContent: "space-between"}}>
                        {data.notes.map((t, i) => (
                            <Text
                                key={i}
                                style={{
                                    backgroundColor: "#F2F2F2",
                                    paddingVertical: 8,
                                    paddingHorizontal: 10,
                                    borderRadius: 10,
                                    fontSize: 13,
                                }}
                            >
                                {t}
                            </Text>
                        ))}
                    </View>
                </View>

            </View>
        </ScrollView>
    );
}