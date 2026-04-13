import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";

const CLUBS = [
    { id: "1", name: "Художественная студия", students: 18, age: "6-11",  price: 6000, status: "active" },
    { id: "2", name: "Футбольная школа",       students: 24, age: "8-17",  price: 5000, status: "active" },
    { id: "3", name: "Программирование",       students: 15, age: "12-17", price: 10000, status: "active" },
    { id: "4", name: "Музыкальная школа",      students: 20, age: "6-14",  price: 7000, status: "active" },
    { id: "5", name: "Театральная студия",     students: 12, age: "9-16",  price: 5500, status: "paused" },
];

const CLUB_ICONS: Record<string, string> = {
    "Художественная студия": "edit-3",
    "Футбольная школа": "activity",
    "Программирование": "code",
    "Музыкальная школа": "music",
    "Театральная студия": "film",
};

export default function OrgClubs() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const filtered = CLUBS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
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
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.muted, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 }}>
                    <Feather name="search" size={18} color={COLORS.mutedForeground} style={{ marginRight: 8 }} />
                    <TextInput value={search} onChangeText={setSearch} placeholder="Найти кружок..." placeholderTextColor={COLORS.mutedForeground} style={{ flex: 1, fontSize: 15, color: COLORS.foreground }} />
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
                    {[
                        { label: "Всего кружков", value: CLUBS.length },
                        { label: "Всего учеников", value: CLUBS.reduce((s,c) => s+c.students, 0) },
                        { label: "Активных", value: CLUBS.filter(c=>c.status==="active").length },
                    ].map(s => (
                        <View key={s.label} style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.sm, padding: 12, alignItems: "center", borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: COLORS.primary }}>{s.value}</Text>
                            <Text style={{ fontSize: 11, color: COLORS.mutedForeground, textAlign: "center", marginTop: 2 }}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.foreground, marginBottom: 12 }}>Список кружков</Text>
                {filtered.map((club) => {
                    const iconName = CLUB_ICONS[club.name] || "book-open";
                    return (
                        <View key={club.id} style={{ backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                                <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: `${COLORS.primary}10`, alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                                    <Feather name={iconName as any} size={24} color={COLORS.primary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: "700", fontSize: 15, color: COLORS.foreground }}>{club.name}</Text>
                                    <Text style={{ fontSize: 13, color: COLORS.mutedForeground, marginTop: 2 }}>{club.age} лет · {club.price}₸/мес</Text>
                                </View>
                                <View style={{ backgroundColor: club.status === "active" ? `${COLORS.success}15` : `${COLORS.destructive}15`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                                    <Text style={{ fontSize: 12, fontWeight: "600", color: club.status === "active" ? COLORS.success : COLORS.destructive }}>
                                        {club.status === "active" ? "Активен" : "Пауза"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Feather name="users" size={14} color={COLORS.mutedForeground} />
                                    <Text style={{ color: COLORS.mutedForeground, fontSize: 13, marginLeft: 6 }}>{club.students} учеников</Text>
                                </View>
                                <View style={{ flexDirection: "row", gap: 8 }}>
                                    <TouchableOpacity style={{ backgroundColor: `${COLORS.primary}10`, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 }}>
                                        <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}>Изменить</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: `${COLORS.primary}08`, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 }}>
                                        <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}>Расписание</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
