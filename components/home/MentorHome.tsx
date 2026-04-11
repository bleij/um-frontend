import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_STUDENTS = [
    {
        id: "1", name: "Анна Петрова", age: 8, level: 5, xp: 1250, progress: 85,
        skills: { com: 85, lead: 65, cre: 90, log: 75, dis: 70 },
    },
    {
        id: "2", name: "Максим Иванов", age: 14, level: 8, xp: 2450, progress: 78,
        skills: { com: 78, lead: 65, cre: 85, log: 80, dis: 72 },
    },
    {
        id: "3", name: "София Смирнова", age: 10, level: 6, xp: 1680, progress: 92,
        skills: { com: 90, lead: 75, cre: 88, log: 85, dis: 80 },
    },
];

const SKILL_LABELS = ["Ком.", "Лид.", "Кре.", "Лог.", "Дис."];

export default function MentorHome() {
    const router = useRouter();

    const avgProgress = Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.progress, 0) / MOCK_STUDENTS.length);

    return (
        <View style={{ flex: 1, backgroundColor: "#F0FDF9" }}>
            <LinearGradient colors={["#0D9488", "#14B8A6"]} style={{ paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                        <Text style={{ fontSize: 22, fontWeight: "800", color: "white" }}>Мои подопечные</Text>
                        <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 2 }}>Ментор • Анна Сергеевна</Text>
                    </View>

                    {/* Stats */}
                    <View style={{ flexDirection: "row", paddingHorizontal: 20, marginTop: 16, gap: 10 }}>
                        {[
                            { label: "Учеников", value: `${MOCK_STUDENTS.length}` },
                            { label: "Планов", value: "15" },
                            { label: "Ср. прогресс", value: `${avgProgress}%` },
                        ].map(stat => (
                            <View key={stat.label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 14, padding: 12, alignItems: "center" }}>
                                <Text style={{ fontSize: 22, fontWeight: "800", color: "white" }}>{stat.value}</Text>
                                <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: "#1F1F2E", marginBottom: 12 }}>Список учеников</Text>

                {MOCK_STUDENTS.map(student => {
                    const skillVals = Object.values(student.skills);
                    const maxSkill = Math.max(...skillVals);
                    return (
                        <TouchableOpacity
                            key={student.id}
                            onPress={() => router.push(`/(tabs)/mentor/student/${student.id}` as any)}
                            style={{ backgroundColor: "white", borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: "#0D9488", shadowOpacity: 0.08, shadowRadius: 12 }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#CCFBF1", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                                    <Text style={{ fontSize: 22, fontWeight: "700", color: "#0D9488" }}>{student.name.charAt(0)}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: "700", fontSize: 16, color: "#1F1F2E" }}>{student.name}</Text>
                                    <Text style={{ color: "#6B7280", fontSize: 13 }}>{student.age} лет</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                        <View style={{ backgroundColor: "#EDE9FE", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, marginRight: 8 }}>
                                            <Text style={{ color: "#6C5CE7", fontSize: 11, fontWeight: "600" }}>Level {student.level}</Text>
                                        </View>
                                        <Text style={{ color: "#9CA3AF", fontSize: 12 }}>{student.xp} XP</Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={{ fontSize: 28, fontWeight: "800", color: "#0D9488" }}>{student.progress}%</Text>
                                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>Прогресс</Text>
                                </View>
                            </View>

                            {/* Mini skill bars */}
                            <View style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}>
                                {skillVals.map((val, i) => (
                                    <View key={i} style={{ flex: 1, alignItems: "center" }}>
                                        <View style={{ width: "100%", height: 50, justifyContent: "flex-end" }}>
                                            <View style={{ height: (val / maxSkill) * 44, backgroundColor: "#14B8A6", borderRadius: 4 }} />
                                        </View>
                                        <Text style={{ fontSize: 9, color: "#9CA3AF", marginTop: 3 }}>{SKILL_LABELS[i]}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Actions */}
                            <View style={{ flexDirection: "row", gap: 8 }}>
                                <TouchableOpacity
                                    onPress={() => router.push(`/(tabs)/mentor/learning-path` as any)}
                                    style={{ flex: 1, backgroundColor: "#0D9488", borderRadius: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                                >
                                    <Feather name="map" size={14} color="white" />
                                    <Text style={{ color: "white", fontWeight: "700", fontSize: 13, marginLeft: 6 }}>План развития</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => router.push("/(tabs)/chats" as any)}
                                    style={{ backgroundColor: "#CCFBF1", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, alignItems: "center", justifyContent: "center" }}
                                >
                                    <Feather name="message-circle" size={18} color="#0D9488" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* Quick Stats */}
                <View style={{ backgroundColor: "white", borderRadius: 20, padding: 18, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
                        <Feather name="trending-up" size={18} color="#0D9488" />
                        <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F1F2E", marginLeft: 8 }}>Общая статистика</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <View style={{ flex: 1, backgroundColor: "#EDE9FE", borderRadius: 14, padding: 14, alignItems: "center" }}>
                            <Text style={{ fontSize: 24, fontWeight: "800", color: "#6C5CE7" }}>42</Text>
                            <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 2 }}>Рекомендаций</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: "#F0FDF4", borderRadius: 14, padding: 14, alignItems: "center" }}>
                            <Text style={{ fontSize: 24, fontWeight: "800", color: "#22C55E" }}>28</Text>
                            <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 2 }}>Целей достигнуто</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
