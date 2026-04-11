import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const CLUBS = [
    { id: "art", name: "Художественная студия" },
    { id: "football", name: "Футбол" },
    { id: "coding", name: "Программирование" },
];

const SESSIONS = [
    { date: "21 фев", day: "ПН" },
    { date: "23 фев", day: "СР" },
    { date: "26 фев", day: "ПН" },
    { date: "28 фев", day: "СР" },
];

const MOCK_STUDENTS = [
    { id: "1", name: "Анна Петрова", avatar: "https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop", attendance: [true, true, true, false] },
    { id: "2", name: "Мария Иванова", avatar: "https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop", attendance: [true, false, true, true] },
    { id: "3", name: "София Смирнова", avatar: "https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop", attendance: [true, true, true, true] },
    { id: "4", name: "Елизавета Новикова", avatar: "https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop", attendance: [false, true, true, true] },
];

export default function OrgAttendance() {
    const router = useRouter();
    const [selectedClub, setSelectedClub] = useState("art");

    const getRate = (arr: boolean[]) => Math.round((arr.filter(Boolean).length / arr.length) * 100);

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF7F0" }}>
            <LinearGradient colors={["#EA580C", "#F97316"]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Посещаемость</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Selector */}
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
                                backgroundColor: selectedClub === club.id ? "#F97316" : "white",
                                shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5
                            }}
                        >
                            <Text style={{ color: selectedClub === club.id ? "white" : "#6B7280", fontWeight: "700" }}>{club.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Table Header */}
                <View style={{ backgroundColor: "#F9FAFB", borderTopLeftRadius: 16, borderTopRightRadius: 16, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
                    <View style={{ flex: 1, padding: 12 }}>
                        <Text style={{ fontSize: 12, fontWeight: "700", color: "#6B7280" }}>Ученик</Text>
                    </View>
                    {SESSIONS.map((s, i) => (
                        <View key={i} style={{ width: 45, padding: 8, alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#E5E7EB" }}>
                            <Text style={{ fontSize: 10, fontWeight: "800", color: "#111827" }}>{s.day}</Text>
                            <Text style={{ fontSize: 8, color: "#9CA3AF" }}>{s.date}</Text>
                        </View>
                    ))}
                    <View style={{ width: 45, padding: 8, alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#E5E7EB" }}>
                        <Text style={{ fontSize: 10, fontWeight: "800", color: "#6B7280" }}>%</Text>
                    </View>
                </View>

                {/* Table Body */}
                <View style={{ backgroundColor: "white", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 }}>
                    {MOCK_STUDENTS.map((student, sIdx) => (
                        <View key={student.id} style={{ flexDirection: "row", borderBottomWidth: sIdx === MOCK_STUDENTS.length - 1 ? 0 : 1, borderBottomColor: "#F3F4F6" }}>
                            <View style={{ flex: 1, padding: 10, flexDirection: "row", alignItems: "center" }}>
                                <Image source={{ uri: student.avatar }} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }} />
                                <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: "500", color: "#1F1F2E" }}>{student.name}</Text>
                            </View>
                            {student.attendance.map((att, i) => (
                                <View key={i} style={{ width: 45, alignItems: "center", justifyContent: "center", borderLeftWidth: 1, borderLeftColor: "#F3F4F6" }}>
                                    <Feather 
                                        name={att ? "check-circle" : "circle"} 
                                        size={18} 
                                        color={att ? "#22C55E" : "#D1D5DB"} 
                                    />
                                </View>
                            ))}
                            <View style={{ width: 45, alignItems: "center", justifyContent: "center", borderLeftWidth: 1, borderLeftColor: "#F3F4F6" }}>
                                <Text style={{ fontSize: 12, fontWeight: "700", color: getRate(student.attendance) > 70 ? "#22C55E" : "#F97316" }}>
                                    {getRate(student.attendance)}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                    <View style={{ flex: 1, backgroundColor: "white", padding: 16, borderRadius: 18, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 }}>
                        <Text style={{ fontSize: 24, fontWeight: "800", color: "#22C55E" }}>92%</Text>
                        <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Средняя посещ.</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: "white", padding: 16, borderRadius: 18, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 }}>
                        <Text style={{ fontSize: 24, fontWeight: "800", color: "#F97316" }}>4</Text>
                        <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Занятий</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
