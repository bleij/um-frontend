import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";
import { useIsDesktop } from "../../../lib/useIsDesktop";

const TASK_ICONS: Record<string, string> = {
    "Художественная студия": "edit-3",
    "Программирование": "code",
    "Английский язык": "book",
    "Футбол": "activity",
};

const MOCK_TASKS = [
    { id: 1, title: "Нарисовать пейзаж", club: "Художественная студия", xp: 50, completed: true },
    { id: 2, title: "Сделать домашнее задание", club: "Программирование", xp: 40, completed: false },
    { id: 3, title: "Выучить 10 новых слов", club: "Английский язык", xp: 30, completed: false },
    { id: 4, title: "Пробежать 1 км", club: "Футбол", xp: 45, completed: false },
    { id: 5, title: "Слепить фигурку", club: "Художественная студия", xp: 35, completed: false },
    { id: 6, title: "Решить 5 задач по логике", club: "Программирование", xp: 50, completed: false },
];

export default function YouthTasks() {
    const router = useRouter();
    const isDesktop = useIsDesktop();
    const [tasks, setTasks] = useState(MOCK_TASKS);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const doneCount = tasks.filter(t => t.completed).length;
    const totalXP = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView edges={["top"]}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, marginBottom: 12 }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ padding: 8, marginRight: 8 }}
                    >
                        <Feather name="arrow-left" size={24} color={COLORS.foreground} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: "800", color: COLORS.foreground }}>Задания</Text>
                        <Text style={{ fontSize: 13, color: COLORS.mutedForeground }}>
                            Выполнено: {doneCount} из {tasks.length}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: isDesktop ? 32 : 100 }}>
                {/* Score Card */}
                <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={{ borderRadius: RADIUS.lg, padding: 20, marginBottom: 24, ...SHADOWS.lg }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        <View style={{ alignItems: "center" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                <Feather name="star" size={20} color={COLORS.accent} />
                                <Text style={{ fontSize: 28, fontWeight: "900", color: "white", marginLeft: 6 }}>{totalXP}</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Заработано XP</Text>
                        </View>
                        <View style={{ width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.3)" }} />
                        <View style={{ alignItems: "center" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                <Feather name="check-circle" size={20} color="white" />
                                <Text style={{ fontSize: 28, fontWeight: "900", color: "white", marginLeft: 6 }}>{doneCount}</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Выполнено</Text>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={{ fontSize: 18, fontWeight: "800", color: COLORS.foreground, marginBottom: 16, marginLeft: 4 }}>
                    Твои дела
                </Text>

                {tasks.map(task => {
                    const iconName = TASK_ICONS[task.club] || "file-text";
                    return (
                        <TouchableOpacity
                            key={task.id}
                            onPress={() => toggleTask(task.id)}
                            style={{
                                backgroundColor: task.completed ? `${COLORS.success}08` : COLORS.card,
                                borderRadius: RADIUS.lg, padding: 16, marginBottom: 12,
                                flexDirection: "row", alignItems: "center",
                                borderWidth: 2, borderColor: task.completed ? `${COLORS.success}30` : COLORS.border,
                                ...SHADOWS.sm,
                            }}
                        >
                            <View style={{
                                width: 44, height: 44, borderRadius: 14,
                                backgroundColor: `${COLORS.primary}10`,
                                alignItems: "center", justifyContent: "center",
                                marginRight: 14,
                            }}>
                                <Feather name={iconName as any} size={20} color={COLORS.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 15, fontWeight: "700",
                                    color: task.completed ? COLORS.mutedForeground : COLORS.foreground,
                                    textDecorationLine: task.completed ? "line-through" : "none",
                                }}>
                                    {task.title}
                                </Text>
                                <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginTop: 2 }}>{task.club}</Text>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                {task.completed ? (
                                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.success, alignItems: "center", justifyContent: "center" }}>
                                        <Feather name="check" size={16} color="white" />
                                    </View>
                                ) : (
                                    <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: COLORS.border }} />
                                )}
                                <Text style={{ fontSize: 11, fontWeight: "700", color: task.completed ? COLORS.success : COLORS.primary, marginTop: 4 }}>
                                    +{task.xp} XP
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* Motivation */}
                {doneCount === tasks.length ? (
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.secondary]}
                        style={{ borderRadius: RADIUS.lg, padding: 24, alignItems: "center", marginTop: 12 }}
                    >
                        <Feather name="award" size={36} color={COLORS.accent} style={{ marginBottom: 8 }} />
                        <Text style={{ fontSize: 20, fontWeight: "900", color: "white" }}>Все задания выполнены!</Text>
                        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 4, textAlign: "center" }}>
                            Ты молодец! Лови бонус +100 XP к уровню!
                        </Text>
                    </LinearGradient>
                ) : (
                    <View style={{
                        backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 24,
                        alignItems: "center", marginTop: 12,
                        borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm,
                    }}>
                        <Feather name="target" size={28} color={COLORS.primary} style={{ marginBottom: 8 }} />
                        <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.primary }}>
                            Еще {tasks.length - doneCount} заданий до успеха!
                        </Text>
                        <Text style={{ fontSize: 13, color: COLORS.mutedForeground, marginTop: 4, textAlign: "center" }}>
                            Выполни всё до конца недели и получи специальный значок.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
