import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const CLUBS = [
    { id: "1", name: "Художественная студия", students: 18, age: "6-11",  price: 6000, status: "active" },
    { id: "2", name: "Футбольная школа",       students: 24, age: "8-17",  price: 5000, status: "active" },
    { id: "3", name: "Программирование",       students: 15, age: "12-17", price: 10000, status: "active" },
    { id: "4", name: "Музыкальная школа",      students: 20, age: "6-14",  price: 7000, status: "active" },
    { id: "5", name: "Театральная студия",     students: 12, age: "9-16",  price: 5500, status: "paused" },
];

const CLUB_ICONS = ["🎨","⚽","💻","🎵","🎭"];

export default function OrgClubs() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const filtered = CLUBS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF7F0" }}>
            <LinearGradient colors={["#EA580C", "#F97316"]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white", flex: 1 }}>Управление кружками</Text>
                        <TouchableOpacity style={{ backgroundColor: "rgba(255,255,255,0.25)", padding: 8, borderRadius: 10 }}>
                            <Feather name="plus" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Search */}
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}>
                    <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Найти кружок..."
                        placeholderTextColor="#9CA3AF"
                        style={{ flex: 1, fontSize: 15 }}
                    />
                </View>

                {/* Summary */}
                <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
                    {[
                        { label: "Всего кружков", value: CLUBS.length, color: "#F97316" },
                        { label: "Всего учеников", value: CLUBS.reduce((s,c) => s+c.students, 0), color: "#6C5CE7" },
                        { label: "Активных", value: CLUBS.filter(c=>c.status==="active").length, color: "#22C55E" },
                    ].map(s => (
                        <View key={s.label} style={{ flex: 1, backgroundColor: "white", borderRadius: 16, padding: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: s.color }}>{s.value}</Text>
                            <Text style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 2 }}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Clubs List */}
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F1F2E", marginBottom: 12 }}>Список кружков</Text>
                {filtered.map((club, i) => (
                    <View key={club.id} style={{ backgroundColor: "white", borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                            <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: "#FFF7ED", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                                <Text style={{ fontSize: 24 }}>{CLUB_ICONS[i % CLUB_ICONS.length]}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: "700", fontSize: 15, color: "#1F1F2E" }}>{club.name}</Text>
                                <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{club.age} лет · {club.price}₸/мес</Text>
                            </View>
                            <View style={{ backgroundColor: club.status === "active" ? "#F0FDF4" : "#FEF2F2", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                                <Text style={{ fontSize: 12, fontWeight: "600", color: club.status === "active" ? "#22C55E" : "#EF4444" }}>
                                    {club.status === "active" ? "Активен" : "Пауза"}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Feather name="users" size={14} color="#9CA3AF" />
                                <Text style={{ color: "#6B7280", fontSize: 13, marginLeft: 6 }}>{club.students} учеников</Text>
                            </View>
                            <View style={{ flexDirection: "row", gap: 8 }}>
                                <TouchableOpacity style={{ backgroundColor: "#EDE9FE", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 }}>
                                    <Text style={{ color: "#6C5CE7", fontWeight: "600", fontSize: 13 }}>Изменить</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: "#FFF7ED", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 }}>
                                    <Text style={{ color: "#F97316", fontWeight: "600", fontSize: 13 }}>Расписание</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
