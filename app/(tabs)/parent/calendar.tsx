import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const WEEKDAYS = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

function getCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days: (number | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
}

export default function ParentCalendar() {
    const router = useRouter();
    const now = new Date();
    const [currentDate, setCurrentDate] = useState({ year: now.getFullYear(), month: now.getMonth() });
    const [selectedDay, setSelectedDay] = useState(now.getDate());

    const days = getCalendarDays(currentDate.year, currentDate.month);

    const prevMonth = () => {
        setCurrentDate(prev => {
            const d = new Date(prev.year, prev.month - 1);
            return { year: d.getFullYear(), month: d.getMonth() };
        });
    };
    const nextMonth = () => {
        setCurrentDate(prev => {
            const d = new Date(prev.year, prev.month + 1);
            return { year: d.getFullYear(), month: d.getMonth() };
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F8F7FF" }}>
            <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Календарь</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                {/* Calendar Card */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, marginBottom: 16 }}>
                    {/* Month Switcher */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <TouchableOpacity onPress={prevMonth} style={{ padding: 8, backgroundColor: "#F3F0FF", borderRadius: 10 }}>
                            <Feather name="chevron-left" size={20} color="#6C5CE7" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 17, fontWeight: "700", color: "#1F1F2E" }}>
                            {MONTHS[currentDate.month]} {currentDate.year}
                        </Text>
                        <TouchableOpacity onPress={nextMonth} style={{ padding: 8, backgroundColor: "#F3F0FF", borderRadius: 10 }}>
                            <Feather name="chevron-right" size={20} color="#6C5CE7" />
                        </TouchableOpacity>
                    </View>

                    {/* Weekday Headers */}
                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                        {WEEKDAYS.map(d => (
                            <View key={d} style={{ flex: 1, alignItems: "center" }}>
                                <Text style={{ fontSize: 12, fontWeight: "600", color: "#9CA3AF" }}>{d}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {days.map((day, index) => (
                            <View key={index} style={{ width: "14.28%", aspectRatio: 1, padding: 2 }}>
                                {day ? (
                                    <TouchableOpacity
                                        onPress={() => setSelectedDay(day)}
                                        style={{
                                            flex: 1, borderRadius: 10, alignItems: "center", justifyContent: "center",
                                            backgroundColor: day === selectedDay ? "#6C5CE7" : "transparent"
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: day === selectedDay ? "700" : "400", color: day === selectedDay ? "white" : "#374151" }}>{day}</Text>
                                    </TouchableOpacity>
                                ) : <View style={{ flex: 1 }} />}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Classes */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F1F2E", marginBottom: 12 }}>
                        Занятия на {selectedDay} {MONTHS[currentDate.month].toLowerCase()}
                    </Text>
                    <View style={{ alignItems: "center", paddingVertical: 32 }}>
                        <Feather name="calendar" size={40} color="#D1D5DB" />
                        <Text style={{ color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                            На этот день нет запланированных занятий
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
