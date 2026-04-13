import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";

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
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
            >
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
                                paddingHorizontal: 18, paddingVertical: 9,
                                borderRadius: RADIUS.full, marginRight: 8,
                                backgroundColor: selectedChild === child ? COLORS.primary : COLORS.muted,
                            }}
                        >
                            <Text style={{
                                fontWeight: "600",
                                color: selectedChild === child ? "white" : COLORS.mutedForeground,
                            }}>{child}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Summary Stats */}
                <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
                    {[
                        { label: "Занятий", value: "24", icon: "calendar" as const },
                        { label: "Посещ.", value: "89%", icon: "check-circle" as const },
                        { label: "Навыки", value: "+12%", icon: "trending-up" as const },
                    ].map(stat => (
                        <View key={stat.label} style={{
                            flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.sm,
                            padding: 14, alignItems: "center",
                            borderWidth: 1, borderColor: COLORS.border,
                            ...SHADOWS.sm,
                        }}>
                            <Feather name={stat.icon} size={20} color={COLORS.primary} />
                            <Text style={{ fontSize: 20, fontWeight: "800", color: COLORS.foreground, marginTop: 6 }}>
                                {stat.value}
                            </Text>
                            <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginTop: 2 }}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Attendance Chart */}
                <View style={{
                    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 16, marginBottom: 16,
                    borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm,
                }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.foreground, marginBottom: 14 }}>
                        Посещаемость (%)
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "flex-end", height: 100, gap: 6 }}>
                        {ATTENDANCE.map(item => (
                            <View key={item.m} style={{ flex: 1, alignItems: "center" }}>
                                <View style={{
                                    width: "100%", borderRadius: 6,
                                    height: (item.v / maxAttendance) * 80,
                                    backgroundColor: COLORS.primary,
                                    opacity: 0.7 + (item.v / maxAttendance) * 0.3,
                                }} />
                                <Text style={{ fontSize: 10, color: COLORS.mutedForeground, marginTop: 4 }}>{item.m}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Skills */}
                <View style={{
                    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 16, marginBottom: 16,
                    borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm,
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
                        <Feather name="trending-up" size={18} color={COLORS.primary} />
                        <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.foreground, marginLeft: 8 }}>
                            Динамика навыков
                        </Text>
                    </View>
                    {SKILLS.map(skill => (
                        <View key={skill.label} style={{ marginBottom: 12 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: COLORS.foreground }}>{skill.label}</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                    <Text style={{ fontSize: 12, color: COLORS.mutedForeground }}>{skill.prev}%</Text>
                                    <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.primary }}>{skill.current}%</Text>
                                    <Text style={{ fontSize: 11, color: COLORS.success, fontWeight: "600" }}>
                                        +{skill.current - skill.prev}%
                                    </Text>
                                </View>
                            </View>
                            <View style={{ height: 6, backgroundColor: COLORS.muted, borderRadius: 999 }}>
                                <View style={{
                                    height: 6, width: `${skill.current}%`,
                                    backgroundColor: COLORS.primary, borderRadius: 999,
                                }} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* AI Recommendation */}
                <View style={{
                    backgroundColor: `${COLORS.primary}08`,
                    borderRadius: RADIUS.lg, padding: 16,
                    borderWidth: 1, borderColor: `${COLORS.primary}20`,
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                        <Feather name="cpu" size={16} color={COLORS.primary} />
                        <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.primary, marginLeft: 6 }}>
                            Рекомендации AI
                        </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: COLORS.foreground, lineHeight: 20 }}>
                        На основе анализа данных, рекомендуем добавить занятия по развитию лидерских качеств. {selectedChild} показывает высокую креативность — предлагаем театральную студию для комплексного развития.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
