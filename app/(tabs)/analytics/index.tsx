import {
    View,
    Text,
    ScrollView,
    Platform,
    Dimensions,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";

const { width } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

/* ---------- русская локаль для календаря ---------- */
LocaleConfig.locales["ru"] = {
    monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    dayNamesShort: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
    today: "Сегодня",
};
LocaleConfig.defaultLocale = "ru";

/* ---------- демо-события ---------- */
const EVENTS: Record<string, { id: string; time: string; title: string }[]> = {
    "2025-12-11": [
        { id: "1", time: "11:00–12:00", title: "Робототехника" },
        { id: "2", time: "14:00–15:30", title: "Программирование" },
    ],
    "2025-12-03": [
        { id: "3", time: "17:00–18:00", title: "Шахматный клуб" },
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

    const dayEvents = useMemo(() => EVENTS[selectedDate] || [], [selectedDate]);

    const markedDates = useMemo(() => {
        const marked: any = {};
        Object.keys(EVENTS).forEach((date) => {
            marked[date] = { marked: true, dotColor: COLORS.primary };
        });
        marked[selectedDate] = {
            ...(marked[selectedDate] || {}),
            selected: true,
            selectedColor: COLORS.primary,
            selectedTextColor: "white",
        };
        return marked;
    }, [selectedDate]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingTop: 12, paddingBottom: 120, paddingHorizontal: 16, alignItems: "center" }}>
                    <View style={{ width: IS_DESKTOP ? "55%" : "100%" }}>
                        {/* Header */}
                        <Text style={{ fontSize: 24, fontWeight: "700", color: COLORS.foreground, marginBottom: 16 }}>
                            Календарь
                        </Text>

                        {/* Calendar Card */}
                        <View style={{
                            backgroundColor: COLORS.card,
                            borderRadius: RADIUS.lg,
                            padding: 8,
                            marginBottom: 16,
                            borderWidth: 1,
                            borderColor: COLORS.border,
                            ...SHADOWS.md,
                        }}>
                            <Calendar
                                current={initialDate}
                                onDayPress={(day) => setSelectedDate(day.dateString)}
                                markedDates={markedDates}
                                firstDay={1}
                                enableSwipeMonths
                                theme={{
                                    backgroundColor: "transparent",
                                    calendarBackground: "transparent",
                                    textSectionTitleColor: COLORS.mutedForeground,
                                    monthTextColor: COLORS.foreground,
                                    arrowColor: COLORS.primary,
                                    todayTextColor: COLORS.primary,
                                    dayTextColor: COLORS.foreground,
                                    textDayFontSize: 14,
                                    textMonthFontSize: 18,
                                    textMonthFontWeight: "700",
                                    textDayHeaderFontSize: 12,
                                }}
                                style={{ borderRadius: 20 }}
                            />
                        </View>

                        {/* Events Card */}
                        <View style={{
                            backgroundColor: COLORS.card,
                            borderRadius: RADIUS.lg,
                            paddingVertical: 16,
                            paddingHorizontal: 18,
                            borderWidth: 1,
                            borderColor: COLORS.border,
                            ...SHADOWS.sm,
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.foreground }}>
                                    {formatDate(selectedDate)}
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Feather name="calendar" size={14} color={COLORS.mutedForeground} />
                                    <Text style={{ marginLeft: 6, fontSize: 13, color: COLORS.mutedForeground }}>
                                        {dayEvents.length ? `${dayEvents.length} занятия` : "нет занятий"}
                                    </Text>
                                </View>
                            </View>

                            {dayEvents.length === 0 && (
                                <Text style={{ fontSize: 14, color: COLORS.mutedForeground, paddingVertical: 8 }}>
                                    На выбранную дату занятий пока нет.
                                </Text>
                            )}

                            {dayEvents.map((e) => (
                                <View key={e.id} style={{
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor: COLORS.border,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    marginBottom: 10,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}>
                                    <View style={{
                                        width: 4, height: 40, borderRadius: 2,
                                        backgroundColor: COLORS.primary,
                                        marginRight: 12,
                                    }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginBottom: 2 }}>
                                            {e.time}
                                        </Text>
                                        <Text style={{ fontSize: 15, fontWeight: "600", color: COLORS.foreground }}>
                                            {e.title}
                                        </Text>
                                    </View>
                                    <Feather name="chevron-right" size={18} color={COLORS.mutedForeground} />
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}