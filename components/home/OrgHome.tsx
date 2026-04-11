import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const STATS = [
    { label: "Кружков", value: "8", icon: "book-open", color: "#6C5CE7", bg: "#EDE9FE" },
    { label: "Учеников", value: "124", icon: "users", color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Заявок", value: "15", icon: "clipboard", color: "#F97316", bg: "#FFF7ED" },
    { label: "Посещ.", value: "92%", icon: "bar-chart-2", color: "#22C55E", bg: "#F0FDF4" },
];

const CLUBS = [
    { id: "1", name: "Художественная студия", students: 18 },
    { id: "2", name: "Футбольная школа",       students: 24 },
    { id: "3", name: "Программирование",       students: 15 },
    { id: "4", name: "Музыкальная школа",      students: 20 },
];

const QUICK_ACTIONS = [
    { label: "Заявки",       icon: "clipboard", badge: 15, route: "/(tabs)/organization/applications" },
    { label: "Расписание",   icon: "calendar",  badge: 0,  route: "/(tabs)/organization/schedule" },
    { label: "Посещаемость", icon: "check-square", badge: 0, route: "/(tabs)/organization/attendance" },
    { label: "Задания",      icon: "file-text", badge: 0,  route: "/(tabs)/organization/tasks" },
    { label: "Отчёты",       icon: "bar-chart-2", badge: 0, route: "/(tabs)/analytics" },
    { label: "Ученики",      icon: "users",     badge: 0,  route: "/(tabs)/organization/students" },
];

export default function OrgHome() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF7F0" }}>
            <LinearGradient colors={["#EA580C", "#F97316"]} style={{ paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 12, flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: "white" }}>Панель управления</Text>
                            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 2 }}>Центр детского развития «Звёздочка»</Text>
                        </View>
                        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" }}>
                            <Feather name="briefcase" size={22} color="white" />
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Stats Grid */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                    {STATS.map(stat => (
                        <View key={stat.label} style={{ width: "47%", backgroundColor: "white", borderRadius: 18, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 }}>
                            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: stat.bg, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                                <Feather name={stat.icon as any} size={20} color={stat.color} />
                            </View>
                            <Text style={{ fontSize: 26, fontWeight: "800", color: "#1F1F2E" }}>{stat.value}</Text>
                            <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F1F2E", marginBottom: 12 }}>Быстрые действия</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                    {QUICK_ACTIONS.map(item => (
                        <TouchableOpacity
                            key={item.label}
                            onPress={() => router.push(item.route as any)}
                            style={{ width: "47%", backgroundColor: "white", borderRadius: 18, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, position: "relative" }}
                        >
                            <Feather name={item.icon as any} size={24} color="#F97316" style={{ marginBottom: 8 }} />
                            <Text style={{ fontWeight: "600", fontSize: 14, color: "#1F1F2E" }}>{item.label}</Text>
                            {item.badge > 0 && (
                                <View style={{ position: "absolute", top: 10, right: 12, backgroundColor: "#EF4444", borderRadius: 10, minWidth: 20, height: 20, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
                                    <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>{item.badge}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* My Clubs */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F1F2E" }}>Мои кружки</Text>
                    <TouchableOpacity onPress={() => router.push("/(tabs)/organization/clubs" as any)}>
                        <Text style={{ color: "#F97316", fontWeight: "600", fontSize: 14 }}>+ Добавить</Text>
                    </TouchableOpacity>
                </View>
                {CLUBS.map(club => (
                    <View key={club.id} style={{ backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#FFF7ED", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                            <Feather name="book-open" size={20} color="#F97316" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: "700", fontSize: 14, color: "#1F1F2E" }}>{club.name}</Text>
                            <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>{club.students} учеников</Text>
                        </View>
                        <View style={{ backgroundColor: "#F0FDF4", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                            <Text style={{ color: "#22C55E", fontWeight: "600", fontSize: 12 }}>Активен</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
