import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";
import { useIsDesktop } from "../../../lib/useIsDesktop";

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
    const isDesktop = useIsDesktop();
    const totalDone = GOALS.reduce((sum, g) => sum + g.steps.filter(s => s.done).length, 0);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={{ paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
            >
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

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: isDesktop ? 32 : 100 }}>
                {/* Add Goal */}
                <TouchableOpacity style={{
                    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 16, marginBottom: 16,
                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                    borderWidth: 2, borderColor: `${COLORS.primary}20`, borderStyle: "dashed",
                }}>
                    <Feather name="plus" size={20} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary, fontWeight: "700", marginLeft: 8, fontSize: 15 }}>
                        Добавить новую цель
                    </Text>
                </TouchableOpacity>

                {/* Goals */}
                {GOALS.map(goal => {
                    const done = goal.steps.filter(s => s.done).length;
                    return (
                        <View key={goal.id} style={{
                            backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 18, marginBottom: 14,
                            borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.md,
                        }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: "700", fontSize: 16, color: COLORS.foreground }}>{goal.title}</Text>
                                    <Text style={{ color: COLORS.mutedForeground, fontSize: 13, marginTop: 2 }}>
                                        {done} из {goal.steps.length} шагов выполнено
                                    </Text>
                                </View>
                                <Text style={{ fontWeight: "800", fontSize: 24, color: COLORS.primary }}>{goal.progress}%</Text>
                            </View>

                            <View style={{ height: 6, backgroundColor: COLORS.muted, borderRadius: 999, marginBottom: 12, overflow: "hidden" }}>
                                <View style={{ height: 6, width: `${goal.progress}%`, backgroundColor: COLORS.primary, borderRadius: 999 }} />
                            </View>

                            {goal.steps.map((step, i) => (
                                <View key={i} style={{
                                    flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 12,
                                    backgroundColor: step.done ? `${COLORS.success}08` : COLORS.muted, marginBottom: 6,
                                }}>
                                    <View style={{
                                        width: 22, height: 22, borderRadius: 11, marginRight: 10,
                                        backgroundColor: step.done ? COLORS.success : "transparent",
                                        borderWidth: step.done ? 0 : 2, borderColor: COLORS.border,
                                        alignItems: "center", justifyContent: "center",
                                    }}>
                                        {step.done && <Feather name="check" size={12} color="white" />}
                                    </View>
                                    <Text style={{
                                        fontSize: 13, flex: 1, fontWeight: step.done ? "400" : "500",
                                        color: step.done ? COLORS.mutedForeground : COLORS.foreground,
                                        textDecorationLine: step.done ? "line-through" : "none",
                                    }}>{step.text}</Text>
                                </View>
                            ))}

                            <TouchableOpacity style={{
                                backgroundColor: `${COLORS.primary}10`, borderRadius: 12,
                                padding: 10, alignItems: "center", marginTop: 8,
                            }}>
                                <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}>Редактировать цель</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {/* Motivation */}
                <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={{ borderRadius: RADIUS.lg, padding: 18 }}
                >
                    <Text style={{ fontWeight: "800", color: "white", fontSize: 16, marginBottom: 6 }}>
                        Продолжай двигаться вперёд!
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 20 }}>
                        Ты уже выполнил {totalDone} шагов. Каждый шаг приближает тебя к успеху!
                    </Text>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}
