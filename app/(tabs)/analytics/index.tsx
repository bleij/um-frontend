import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Dimensions, Image,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Calendar, LocaleConfig} from "react-native-calendars";
import {Ionicons} from "@expo/vector-icons";
import {useMemo, useState} from "react";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

/* ---------- русская локаль для календаря ---------- */
LocaleConfig.locales["ru"] = {
    monthNames: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ],
    monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    dayNames: [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
    ],
    dayNamesShort: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
    today: "Сегодня",
};
LocaleConfig.defaultLocale = "ru";

/* ---------- демо-события ---------- */
const EVENTS: Record<string, { id: string; time: string; title: string }[]> = {
    "2025-12-11": [
        {id: "1", time: "11:00–12:00", title: "Робототехника"},
        {id: "2", time: "14:00–15:30", title: "Программирование"},
    ],
    "2025-12-03": [
        {id: "3", time: "17:00–18:00", title: "Шахматный клуб"},
    ],
};

function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `${d} ${months[(m || 1) - 1]} ${y}`;
}

export default function AnalyticsScreen() {
    const today = new Date();
    const initialDate = today.toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const dayEvents = useMemo(
        () => EVENTS[selectedDate] || [],
        [selectedDate]
    );

    const markedDates = useMemo(() => {
        const marked: any = {};

        // помечаем все даты с событиями точкой
        Object.keys(EVENTS).forEach((date) => {
            marked[date] = {
                marked: true,
                dotColor: "#3F3C9F",
            };
        });

        // выделяем выбранную дату
        marked[selectedDate] = {
            ...(marked[selectedDate] || {}),
            selected: true,
            selectedColor: "#3F3C9F",
            selectedTextColor: "white",
        };

        return marked;
    }, [selectedDate]);

    return (
        <LinearGradient
            colors={["#F4F5FF", "#FFFFFF"]}
            style={{flex: 1}}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingTop: 40,
                    paddingBottom: 120,
                    paddingHorizontal: 16,
                    alignItems: "center",
                }}
            >
                {/* ограничение ширины как в других экранах */}
                <View style={{width: IS_DESKTOP ? "55%" : "100%"}}>
                    {/* заголовок */}
                    <View style={{alignItems: "center", paddingTop: 40, marginBottom: 20}}>
                        <Image
                            source={require("../../../assets/logo/logo_blue.png")}
                            style={{width: 140, height: 60, resizeMode: "contain"}}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "700",
                                color: "#2E2C79",
                            }}
                        >
                            Календарь
                        </Text>

                    </View>

                    {/* карточка с месяцем */}
                    <View
                        style={{
                            backgroundColor: "white",
                            borderRadius: 24,
                            padding: 8,
                            marginBottom: 16,
                            shadowColor: "#000",
                            shadowOpacity: Platform.OS === "web" ? 0.06 : 0.12,
                            shadowRadius: 10,
                            shadowOffset: {width: 0, height: 4},
                            elevation: 4,
                        }}
                    >
                        <Calendar
                            current={initialDate}
                            onDayPress={(day) => setSelectedDate(day.dateString)}
                            markedDates={markedDates}
                            firstDay={1}
                            enableSwipeMonths
                            theme={{
                                backgroundColor: "transparent",
                                calendarBackground: "transparent",
                                textSectionTitleColor: "#8E8AA8",
                                monthTextColor: "#2E2C79",
                                arrowColor: "#3F3C9F",
                                todayTextColor: "#3F3C9F",
                                dayTextColor: "#111",
                                textDayFontSize: 14,
                                textMonthFontSize: 18,
                                textMonthFontWeight: "700",
                                textDayHeaderFontSize: 12,
                            }}
                            style={{
                                borderRadius: 20,
                            }}
                        />
                    </View>

                    {/* карточка списка занятий */}
                    <View
                        style={{
                            backgroundColor: "white",
                            borderRadius: 24,
                            paddingVertical: 16,
                            paddingHorizontal: 18,
                            shadowColor: "#000",
                            shadowOpacity: Platform.OS === "web" ? 0.04 : 0.08,
                            shadowRadius: 8,
                            shadowOffset: {width: 0, height: 3},
                            elevation: 3,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "#2E2C79",
                                }}
                            >
                                {formatDate(selectedDate)}
                            </Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Ionicons
                                    name="calendar-clear-outline"
                                    size={16}
                                    color="#8E8AA8"
                                />
                                <Text
                                    style={{
                                        marginLeft: 6,
                                        fontSize: 13,
                                        color: "#8E8AA8",
                                    }}
                                >
                                    {dayEvents.length
                                        ? `${dayEvents.length} занятия`
                                        : "нет занятий"}
                                </Text>
                            </View>
                        </View>

                        {dayEvents.length === 0 && (
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#777",
                                    paddingVertical: 8,
                                }}
                            >
                                На выбранную дату занятий пока нет.
                            </Text>
                        )}

                        {dayEvents.map((e) => (
                            <View
                                key={e.id}
                                style={{
                                    borderRadius: 18,
                                    borderWidth: 1,
                                    borderColor: "#E0E2FF",
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    marginBottom: 10,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        width: 6,
                                        height: 40,
                                        borderRadius: 999,
                                        backgroundColor: "#3F3C9F",
                                        marginRight: 10,
                                    }}
                                />

                                <View style={{flex: 1}}>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: "#8E8AA8",
                                            marginBottom: 2,
                                        }}
                                    >
                                        {e.time}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                        }}
                                    >
                                        {e.title}
                                    </Text>
                                </View>

                                <Ionicons
                                    name="chevron-forward"
                                    size={18}
                                    color="#8E8AA8"
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}