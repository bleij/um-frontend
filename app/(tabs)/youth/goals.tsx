import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const GOALS = [
    {
        id: "1",
        title: "Стать разработчиком игр",
        progress: 65,
        steps: [
            { text: "Изучить Python", done: true },
            { text: "Создать первую игру", done: true },
            { text: "Изучить Unity", done: false },
            { text: "Опубликовать игру", done: false },
        ],
    },
    {
        id: "2",
        title: "Улучшить физическую форму",
        progress: 80,
        steps: [
            { text: "Посещать футбол 3 раза в неделю", done: true },
            { text: "Пробежать 5 км без остановки", done: true },
            { text: "Набрать мышечную массу", done: false },
        ],
    },
    {
        id: "3",
        title: "Развить лидерские качества",
        progress: 40,
        steps: [
            { text: "Пройти курс по лидерству", done: true },
            { text: "Стать капитаном команды", done: false },
            { text: "Организовать мероприятие", done: false },
        ],
    },
];

export default function YouthGoals() {
    const router = useRouter();

    const totalDone = GOALS.reduce((sum, g) => sum + g.steps.filter(s => s.done).length, 0);

    return (
        <View style={{ flex: 1, backgroundColor: "#F8F7FF" }}>
            <LinearGradient colors={["#6C5CE7", "#4F46E5"]} style={{ paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, marginBottom: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Feather name="target" size={22} color="white" style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Мои цели</Text>
                    </View>
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, paddingHorizontal: 28, marginBottom: 4 }}>
                        Ставь цели и достигай их шаг за шагом
                    </Text>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Add Goal */}
                <TouchableOpacity style={{ backgroundColor: "white", borderRadius: 18, padding: 16, marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#EDE9FE", borderStyle: "dashed" }}>
                    <Feather name="plus" size={20} color="#6C5CE7" />
                    <Text style={{ color: "#6C5CE7", fontWeight: "700", marginLeft: 8, fontSize: 15 }}>Добавить новую цель</Text>
                </TouchableOpacity>

                {/* Goals */}
                {GOALS.map(goal => {
                    const done = goal.steps.filter(s => s.done).length;
                    return (
                        <View key={goal.id} style={{ backgroundColor: "white", borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: "#6C5CE7", shadowOpacity: 0.06, shadowRadius: 12 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: "700", fontSize: 16, color: "#1F1F2E" }}>{goal.title}</Text>
                                    <Text style={{ color: "#9CA3AF", fontSize: 13, marginTop: 2 }}>{done} из {goal.steps.length} шагов выполнено</Text>
                                </View>
                                <Text style={{ fontWeight: "800", fontSize: 24, color: "#6C5CE7" }}>{goal.progress}%</Text>
                            </View>

                            {/* Progress Bar */}
                            <View style={{ height: 6, backgroundColor: "#F3F4F6", borderRadius: 999, marginBottom: 12, overflow: "hidden" }}>
                                <View style={{ height: 6, width: `${goal.progress}%`, backgroundColor: "#6C5CE7", borderRadius: 999 }} />
                            </View>

                            {/* Steps */}
                            {goal.steps.map((step, i) => (
                                <View key={i} style={{ flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 12, backgroundColor: step.done ? "#F0FDF4" : "#F9FAFB", marginBottom: 6 }}>
                                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: step.done ? "#22C55E" : "transparent", borderWidth: step.done ? 0 : 2, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center", marginRight: 10, flexShrink: 0 }}>
                                        {step.done && <Feather name="check" size={12} color="white" />}
                                    </View>
                                    <Text style={{ fontSize: 13, color: step.done ? "#9CA3AF" : "#374151", fontWeight: step.done ? "400" : "500", textDecorationLine: step.done ? "line-through" : "none", flex: 1 }}>{step.text}</Text>
                                </View>
                            ))}

                            <TouchableOpacity style={{ backgroundColor: "#EDE9FE", borderRadius: 12, padding: 10, alignItems: "center", marginTop: 8 }}>
                                <Text style={{ color: "#6C5CE7", fontWeight: "600", fontSize: 13 }}>Редактировать цель</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {/* Motivation */}
                <LinearGradient colors={["#6C5CE7", "#4F46E5"]} style={{ borderRadius: 20, padding: 18 }}>
                    <Text style={{ fontWeight: "800", color: "white", fontSize: 16, marginBottom: 6 }}>🎯 Продолжай двигаться вперёд!</Text>
                    <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 20 }}>
                        Ты уже выполнил {totalDone} шагов. Каждый шаг приближает тебя к успеху!
                    </Text>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}
