import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useParentData } from "../../../contexts/ParentDataContext";

export default function ParentChildDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { childrenProfile } = useParentData();
    
    const child = childrenProfile.find(c => c.id === id) || childrenProfile[0];

    if (!child) return null;

    const SKILLS = [
        { label: "Коммуникация", value: 75, color: "#6C5CE7" },
        { label: "Лидерство", value: 65, color: "#6C5CE7" },
        { label: "Креативность", value: 80, color: "#6C5CE7" },
        { label: "Логика", value: 70, color: "#6C5CE7" },
        { label: "Дисциплина", value: 75, color: "#6C5CE7" },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Профиль ребенка</Text>
                    </View>
                </SafeAreaView>

                {/* Header Info */}
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: "white", alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 }}>
                        <Text style={{ fontSize: 36, fontWeight: "800", color: "#6C5CE7" }}>{(child.name || "").charAt(0)}</Text>
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: "800", color: "white" }}>{child.name}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>
                        {child.ageCategory === "child" ? "Ребенок (6-11 лет)" : "Подросток (12-17 лет)"}
                    </Text>

                    <View style={{ flexDirection: "row", gap: 30, marginTop: 24 }}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: "white" }}>1,250</Text>
                            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>XP</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: "white" }}>Level 5</Text>
                            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Уровень</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: "white" }}>12</Text>
                            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Наград</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Motivation Box */}
                <View style={{ backgroundColor: "#EFF6FF", padding: 16, borderRadius: 20, marginBottom: 20, flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "white", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        <Feather name="info" size={20} color="#3B82F6" />
                    </View>
                    <Text style={{ flex: 1, fontSize: 13, color: "#1E40AF", lineHeight: 18 }}>
                        После прохождения теста здесь появятся рекомендации AI по кружкам и активностям.
                    </Text>
                </View>

                {/* Soft Skills (Simplified as Progress Bars) */}
                <View style={{ backgroundColor: "white", borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                        <Feather name="target" size={20} color="#6C5CE7" />
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937", marginLeft: 8 }}>Гибкие навыки</Text>
                    </View>
                    
                    {SKILLS.map((skill, i) => (
                        <View key={i} style={{ marginBottom: 14 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                                <Text style={{ fontSize: 13, color: "#4B5563", fontWeight: "500" }}>{skill.label}</Text>
                                <Text style={{ fontSize: 13, fontWeight: "700", color: skill.color }}>{skill.value}%</Text>
                            </View>
                            <View style={{ height: 6, backgroundColor: "#F3F4F6", borderRadius: 3 }}>
                                <View style={{ height: 6, width: `${skill.value}%`, backgroundColor: skill.color, borderRadius: 3 }} />
                            </View>
                        </View>
                    ))}
                    <Text style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 4 }}>
                        Данные обновляются на основе результатов тестирований
                    </Text>
                </View>

                {/* Test Status */}
                <View style={{ backgroundColor: "white", borderRadius: 24, padding: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                        <Feather name="award" size={20} color="#6C5CE7" />
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937", marginLeft: 8 }}>Статус тестирования</Text>
                    </View>
                    
                    <View style={{ backgroundColor: "#FEF3C7", padding: 16, borderRadius: 18, marginBottom: 16 }}>
                        <Text style={{ fontWeight: "700", color: "#92400E", fontSize: 14 }}>Тест не пройден</Text>
                        <Text style={{ color: "#B45309", fontSize: 12, marginTop: 4 }}>Пройдите тест для получения персональных рекомендаций</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={() => router.push("/app/parent/testing" as any)}
                        style={{ backgroundColor: "#6C5CE7", paddingVertical: 14, borderRadius: 14, alignItems: "center" }}
                    >
                        <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>Пройти тест</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
