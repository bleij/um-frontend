import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";

const MOCK_TASKS = [
    {
        id: "1",
        title: "Нарисовать пейзаж",
        club: "Художественная студия",
        clubId: "art",
        assignedTo: "Все ученики",
        dueDate: "28 фев 2026",
        xp: 50,
        completed: 12,
        total: 18,
    },
    {
        id: "2",
        title: "Техника ведения мяча",
        club: "Футбол",
        clubId: "football",
        assignedTo: "Все ученики",
        dueDate: "1 мар 2026",
        xp: 45,
        completed: 18,
        total: 24,
    },
    {
        id: "3",
        title: "Создать простую программу",
        club: "Программирование",
        clubId: "coding",
        assignedTo: "Все ученики",
        dueDate: "2 мар 2026",
        xp: 60,
        completed: 8,
        total: 15,
    },
];

const CLUBS = [
    { id: "all", name: "Все кружки" },
    { id: "art", name: "Художественная студия" },
    { id: "football", name: "Футбол" },
    { id: "coding", name: "Программирование" },
];

export default function OrgTasks() {
    const router = useRouter();
    const [selectedClub, setSelectedClub] = useState("all");

    const filtered = selectedClub === "all" ? MOCK_TASKS : MOCK_TASKS.filter(t => t.clubId === selectedClub);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white", flex: 1 }}>Задания</Text>
                        <TouchableOpacity style={{ backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 }}>
                            <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>+ Создать</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    {CLUBS.map(club => (
                        <TouchableOpacity
                            key={club.id}
                            onPress={() => setSelectedClub(club.id)}
                            style={{ 
                                paddingHorizontal: 16, 
                                paddingVertical: 10, 
                                borderRadius: 14, 
                                marginRight: 8,
                                backgroundColor: selectedClub === club.id ? COLORS.primary : COLORS.muted,
                                shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5
                            }}
                        >
                            <Text style={{ color: selectedClub === club.id ? "white" : "#6B7280", fontWeight: "700" }}>{club.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Tasks */}
                {filtered.map(task => {
                    const percent = Math.round((task.completed / task.total) * 100);
                    return (
                        <View key={task.id} style={{ backgroundColor: "white", borderRadius: 22, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: "800", color: "#1F1F2E" }}>{task.title}</Text>
                                    <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{task.club}</Text>
                                </View>
                                <View style={{ backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, height: 24 }}>
                                    <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>+{task.xp} XP</Text>
                                </View>
                            </View>

                            <View style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 14, marginBottom: 16 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                                    <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Назначено:</Text>
                                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>{task.assignedTo}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Срок:</Text>
                                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>{task.dueDate}</Text>
                                </View>
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text style={{ fontSize: 13, fontWeight: "600", color: "#4B5563" }}>Выполнено: {task.completed} / {task.total}</Text>
                                    <Text style={{ fontSize: 13, fontWeight: "800", color: COLORS.primary }}>{percent}%</Text>
                                </View>
                                <View style={{ height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                                    <View style={{ height: 8, width: `${percent}%`, backgroundColor: COLORS.primary, borderRadius: 4 }} />
                                </View>
                            </View>

                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <TouchableOpacity style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: `${COLORS.primary}10`, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: COLORS.primary, fontWeight: "700", fontSize: 13 }}>Изменить</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: 40, width: 40, borderRadius: 10, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" }}>
                                    <Feather name="trash-2" size={18} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
