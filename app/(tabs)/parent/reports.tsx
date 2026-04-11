import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const SKILLS = [
    { label: "Коммуникация", current: 85, prev: 75 },
    { label: "Лидерство", current: 65, prev: 55 },
    { label: "Креативность", current: 90, prev: 85 },
    { label: "Логика", current: 75, prev: 70 },
    { label: "Дисциплина", current: 70, prev: 65 },
];

const ATTENDANCE = [
    { m: "Сен", v: 90 }, { m: "Окт", v: 85 }, { m: "Ноя", v: 95 },
    { m: "Дек", v: 88 }, { m: "Янв", v: 92 }, { m: "Фев", v: 87 },
];

export default function ParentReports() {
    const router = useRouter();
    const [selectedChild, setSelectedChild] = useState("Анна");
    const children = ["Анна", "Дмитрий"];

    const maxAttendance = Math.max(...ATTENDANCE.map(a => a.v));

    return (
        <View style={{ flex: 1, backgroundColor: "#F8F7FF" }}>
            <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Отчеты и аналитика</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                {/* Child Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {children.map(child => (
                        <TouchableOpacity
                            key={child}
                            onPress={() => setSelectedChild(child)}
                            style={{
                                paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, marginRight: 8,
                                backgroundColor: selectedChild === child ? "#6C5CE7" : "white",
                                shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4
                            }}
                        >
                            <Text style={{ fontWeight: "600", color: selectedChild === child ? "white" : "#6B7280" }}>{child}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Summary Stats */}
                <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
                    {[
                        { label: "Занятий", value: "24", icon: "calendar", color: "#6C5CE7" },
                        { label: "Посещ.", value: "89%", icon: "check-circle", color: "#22C55E" },
                        { label: "Навыки", value: "+12%", icon: "trending-up", color: "#F59E0B" },
                    ].map(stat => (
                        <View key={stat.label} style={{ flex: 1, backgroundColor: "white", borderRadius: 16, padding: 14, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}>
                            <Feather name={stat.icon as any} size={20} color={stat.color} />
                            <Text style={{ fontSize: 20, fontWeight: "800", color: "#1F1F2E", marginTop: 6 }}>{stat.value}</Text>
                            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Attendance Chart */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F1F2E", marginBottom: 14 }}>Посещаемость (%)</Text>
                    <View style={{ flexDirection: "row", alignItems: "flex-end", height: 100, gap: 6 }}>
                        {ATTENDANCE.map(item => (
                            <View key={item.m} style={{ flex: 1, alignItems: "center" }}>
                                <View style={{
                                    width: "100%", borderRadius: 6,
                                    height: (item.v / maxAttendance) * 80,
                                    backgroundColor: "#6C5CE7",
                                }} />
                                <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{item.m}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Skills */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
                        <Feather name="trending-up" size={18} color="#6C5CE7" />
                        <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F1F2E", marginLeft: 8 }}>Динамика навыков</Text>
                    </View>
                    {SKILLS.map(skill => (
                        <View key={skill.label} style={{ marginBottom: 12 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>{skill.label}</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                    <Text style={{ fontSize: 12, color: "#9CA3AF" }}>{skill.prev}%</Text>
                                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#6C5CE7" }}>{skill.current}%</Text>
                                    <Text style={{ fontSize: 11, color: "#22C55E", fontWeight: "600" }}>+{skill.current - skill.prev}%</Text>
                                </View>
                            </View>
                            <View style={{ height: 6, backgroundColor: "#F3F4F6", borderRadius: 999 }}>
                                <View style={{ height: 6, width: `${skill.current}%`, backgroundColor: "#6C5CE7", borderRadius: 999 }} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* AI Recommendation */}
                <LinearGradient colors={["#EDE9FE", "#EFF6FF"]} style={{ borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#DDD6FE" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                        <Feather name="cpu" size={16} color="#6C5CE7" />
                        <Text style={{ fontSize: 14, fontWeight: "700", color: "#6C5CE7", marginLeft: 6 }}>Рекомендации AI</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
                        На основе анализа данных, рекомендуем добавить занятия по развитию лидерских качеств. {selectedChild} показывает высокую креативность — предлагаем театральную студию для комплексного развития.
                    </Text>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}
