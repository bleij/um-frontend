import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../../constants/theme";
import { useIsDesktop } from "../../../../lib/useIsDesktop";

const MOCK_STUDENTS: Record<string, any> = {
    "1": { name: "Анна Петрова",    age: 8,  level: 5, xp: 1250, progress: 85 },
    "2": { name: "Максим Иванов",   age: 14, level: 8, xp: 2450, progress: 78 },
    "3": { name: "София Смирнова",  age: 10, level: 6, xp: 1680, progress: 92 },
};

const SKILLS = [
    { label: "Коммуникация", value: 85 },
    { label: "Лидерство",    value: 65 },
    { label: "Креативность", value: 90 },
    { label: "Логика",       value: 75 },
    { label: "Дисциплина",   value: 70 },
];

const TESTS = [
    { name: "Креативность",           score: 92, date: "15 янв" },
    { name: "Логическое мышление",    score: 78, date: "20 янв" },
    { name: "Эмоциональный интеллект",score: 85, date: "1 фев"  },
];

const CLUBS = [
    { name: "Художественная студия", attendance: 95 },
    { name: "Программирование",      attendance: 88 },
    { name: "Английский язык",       attendance: 92 },
];

const XP_HISTORY = [800, 950, 1050, 1150, 1200, 1250];
const XP_MONTHS  = ["Сен","Окт","Ноя","Дек","Янв","Фев"];

const RECS = [
    { title: "Театральная студия",  reason: "Развитие коммуникативных навыков", priority: "high" },
    { title: "Шахматный клуб",      reason: "Улучшение стратегического мышления", priority: "medium" },
];

export default function MentorStudentProfile() {
    const router = useRouter();
    const isDesktop = useIsDesktop();
    const { id } = useLocalSearchParams<{ id: string }>();
    const student = MOCK_STUDENTS[id ?? "1"] ?? MOCK_STUDENTS["1"];

    const maxXp = Math.max(...XP_HISTORY);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Профиль ученика</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: isDesktop ? 32 : 100 }}>

                {/* Student Card */}
                <View style={{ backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 20, alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.md }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: `${COLORS.primary}10`, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.primary }}>{student.name.charAt(0)}</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: "800", color: "#1F1F2E", marginBottom: 2 }}>{student.name}</Text>
                    <Text style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>{student.age} лет • Level {student.level}</Text>

                    <View style={{ flexDirection: "row", gap: 24 }}>
                        {[["XP", student.xp], ["Прогресс", `${student.progress}%`], ["Достижений", "12"]].map(([label, val]) => (
                            <View key={label} style={{ alignItems: "center" }}>
                                <Text style={{ fontSize: 22, fontWeight: "800", color: COLORS.primary }}>{val}</Text>
                                <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{label}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ flexDirection: "row", gap: 10, marginTop: 16, width: "100%" }}>
                        <TouchableOpacity
                            onPress={() => router.push("/(tabs)/mentor/learning-path" as any)}
                            style={{ flex: 1, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                        >
                            <Feather name="map" size={16} color="white" />
                            <Text style={{ color: "white", fontWeight: "700", fontSize: 14, marginLeft: 6 }}>План развития</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/(tabs)/chats" as any)}
                            style={{ backgroundColor: `${COLORS.primary}10`, borderRadius: 14, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" }}
                        >
                            <Feather name="message-circle" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Skills */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
                        <Feather name="trending-up" size={18} color={COLORS.primary} />
                        <Text style={{ fontWeight: "700", fontSize: 15, color: "#1F1F2E", marginLeft: 8 }}>Профиль навыков</Text>
                    </View>
                    {SKILLS.map(skill => (
                        <View key={skill.label} style={{ marginBottom: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                                <Text style={{ fontSize: 13, color: "#374151" }}>{skill.label}</Text>
                                <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.primary }}>{skill.value}%</Text>
                            </View>
                            <View style={{ height: 6, backgroundColor: "#F3F4F6", borderRadius: 999 }}>
                                <View style={{ height: 6, width: `${skill.value}%`, backgroundColor: COLORS.primary, borderRadius: 999 }} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* XP Chart */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 }}>
                    <Text style={{ fontWeight: "700", fontSize: 15, color: "#1F1F2E", marginBottom: 14 }}>Динамика развития (XP)</Text>
                    <View style={{ flexDirection: "row", alignItems: "flex-end", height: 80, gap: 6 }}>
                        {XP_HISTORY.map((xp, i) => (
                            <View key={i} style={{ flex: 1, alignItems: "center" }}>
                                <View style={{ width: "100%", borderRadius: 6, height: (xp / maxXp) * 72, backgroundColor: COLORS.primary }} />
                                <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{XP_MONTHS[i]}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Tests */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                        <Feather name="award" size={18} color={COLORS.primary} />
                        <Text style={{ fontWeight: "700", fontSize: 15, color: "#1F1F2E", marginLeft: 8 }}>Результаты тестов</Text>
                    </View>
                    {TESTS.map((test, i) => (
                        <View key={i} style={{ padding: 12, backgroundColor: "#F9FAFB", borderRadius: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                                <View>
                                    <Text style={{ fontWeight: "600", fontSize: 13 }}>{test.name}</Text>
                                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>{test.date}</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "800", color: COLORS.primary }}>{test.score}%</Text>
                            </View>
                            <View style={{ height: 5, backgroundColor: "#E5E7EB", borderRadius: 999 }}>
                                <View style={{ height: 5, width: `${test.score}%`, backgroundColor: COLORS.primary, borderRadius: 999 }} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Club Attendance */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 }}>
                    <Text style={{ fontWeight: "700", fontSize: 15, color: "#1F1F2E", marginBottom: 12 }}>Посещаемость кружков</Text>
                    {CLUBS.map((club, i) => (
                        <View key={i} style={{ marginBottom: 12 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                                <Text style={{ fontSize: 13, color: "#374151" }}>{club.name}</Text>
                                <Text style={{ fontSize: 13, fontWeight: "700", color: "#22C55E" }}>{club.attendance}%</Text>
                            </View>
                            <View style={{ height: 6, backgroundColor: "#F3F4F6", borderRadius: 999 }}>
                                <View style={{ height: 6, width: `${club.attendance}%`, backgroundColor: "#22C55E", borderRadius: 999 }} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Recommendations */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 }}>
                    <Text style={{ fontWeight: "700", fontSize: 15, color: "#1F1F2E", marginBottom: 12 }}>Мои рекомендации</Text>
                    {RECS.map((rec, i) => (
                        <View key={i} style={{ padding: 12, borderRadius: 14, borderWidth: 2, borderColor: rec.priority === "high" ? COLORS.primary : COLORS.border, backgroundColor: rec.priority === "high" ? `${COLORS.primary}08` : COLORS.muted, marginBottom: 8 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                                <Text style={{ fontWeight: "700", fontSize: 13, color: COLORS.primary }}>{rec.title}</Text>
                                {rec.priority === "high" && (
                                    <View style={{ backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
                                        <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>Приоритет</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={{ fontSize: 12, color: "#6B7280" }}>{rec.reason}</Text>
                        </View>
                    ))}
                    <TouchableOpacity style={{ backgroundColor: `${COLORS.primary}10`, borderRadius: 12, padding: 12, alignItems: "center", marginTop: 4 }}>
                        <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}>+ Добавить рекомендацию</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
