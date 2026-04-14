import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";
import { useIsDesktop } from "../../../lib/useIsDesktop";

const STUDENTS = [
    { id: "1",  name: "Анна Петрова",      age: 8,  club: "Художественная студия", progress: 85, attendance: 95 },
    { id: "2",  name: "Максим Иванов",     age: 14, club: "Программирование",       progress: 78, attendance: 88 },
    { id: "3",  name: "София Смирнова",    age: 10, club: "Музыкальная школа",      progress: 92, attendance: 97 },
    { id: "4",  name: "Дмитрий Козлов",   age: 12, club: "Футбольная школа",       progress: 65, attendance: 80 },
    { id: "5",  name: "Алина Новикова",    age: 9,  club: "Театральная студия",     progress: 70, attendance: 72 },
    { id: "6",  name: "Артём Сидоров",     age: 15, club: "Программирование",       progress: 88, attendance: 90 },
];

const CLUBS_FILTER = ["Все", "Художественная студия", "Программирование", "Музыкальная школа", "Футбольная школа", "Театральная студия"];

export default function OrgStudents() {
    const router = useRouter();
    const isDesktop = useIsDesktop();
    const [search, setSearch] = useState("");
    const [activeClub, setActiveClub] = useState("Все");

    const filtered = STUDENTS.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchClub   = activeClub === "Все" || s.club === activeClub;
        return matchSearch && matchClub;
    });

    const avgProgress    = Math.round(filtered.reduce((s, st) => s + st.progress, 0)    / (filtered.length || 1));
    const avgAttendance  = Math.round(filtered.reduce((s, st) => s + st.attendance, 0)  / (filtered.length || 1));

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Ученики</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: isDesktop ? 32 : 100 }} stickyHeaderIndices={[0]}>

                {/* Sticky Search + Filter section */}
                <View style={{ backgroundColor: COLORS.background, paddingBottom: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}>
                        <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Найти ученика..."
                            placeholderTextColor="#9CA3AF"
                            style={{ flex: 1, fontSize: 15 }}
                        />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {CLUBS_FILTER.map(club => (
                            <TouchableOpacity
                                key={club}
                                onPress={() => setActiveClub(club)}
                                style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: activeClub === club ? COLORS.primary : COLORS.muted, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 }}
                            >
                                <Text style={{ fontWeight: "600", fontSize: 13, color: activeClub === club ? "white" : "#6B7280" }}>{club}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Summary */}
                <View style={{ flexDirection: "row", gap: 10, marginBottom: 20, marginTop: 8 }}>
                    {[
                        { label: "Учеников", value: filtered.length, ico: "users", color: COLORS.primary },
                        { label: "Ср. прогресс", value: `${avgProgress}%`, ico: "trending-up", color: COLORS.primary },
                        { label: "Посещаемость", value: `${avgAttendance}%`, ico: "check-circle", color: "#22C55E" },
                    ].map(s => (
                        <View key={s.label} style={{ flex: 1, backgroundColor: "white", borderRadius: 16, padding: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}>
                            <Feather name={s.ico as any} size={18} color={s.color} />
                            <Text style={{ fontSize: 20, fontWeight: "800", color: "#1F1F2E", marginTop: 6 }}>{s.value}</Text>
                            <Text style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 2 }}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Students */}
                {filtered.map(student => (
                    <Pressable 
                        key={student.id} 
                        onPress={() => router.push(`/organization/student/${student.id}` as any)}
                        style={SHADOWS.sm}
                        className="bg-white rounded-3xl p-4 mb-4 border border-gray-100"
                    >
                        <View className="flex-row items-center mb-4">
                            <View className="w-12 h-12 rounded-2xl bg-purple-50 items-center justify-center mr-4">
                                <Text className="text-xl font-bold text-primary">{student.name.charAt(0)}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-gray-900 text-base">{student.name}</Text>
                                <Text className="text-xs text-gray-500 mt-0.5">{student.age} лет • {student.club}</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={COLORS.mutedForeground} />
                        </View>

                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <View className="flex-row justify-between mb-1.5">
                                    <Text className="text-[10px] uppercase font-bold text-gray-400">Прогресс</Text>
                                    <Text className="text-[10px] font-black text-primary">{student.progress}%</Text>
                                </View>
                                <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <View style={{ width: `${student.progress}%` }} className="h-full bg-primary" />
                                </View>
                            </View>
                            <View className="flex-1">
                                <View className="flex-row justify-between mb-1.5">
                                    <Text className="text-[10px] uppercase font-bold text-gray-400">Посещаемость</Text>
                                    <Text className="text-[10px] font-black text-green-600">{student.attendance}%</Text>
                                </View>
                                <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <View style={{ width: `${student.attendance}%` }} className="h-full bg-green-500" />
                                </View>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

import { Pressable } from "react-native";
