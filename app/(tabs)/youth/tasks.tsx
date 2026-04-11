import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_TASKS = [
    { id: 1, title: "Нарисовать пейзаж", club: "Художественная студия", xp: 50, completed: true, emoji: "🎨" },
    { id: 2, title: "Сделать домашнее задание", club: "Программирование", xp: 40, completed: false, emoji: "💻" },
    { id: 3, title: "Выучить 10 новых слов", club: "Английский язык", xp: 30, completed: false, emoji: "📚" },
    { id: 4, title: "Пробежать 1 км", club: "Футбол", xp: 45, completed: false, emoji: "⚽" },
    { id: 5, title: "Слепить фигурку", club: "Художественная студия", xp: 35, completed: false, emoji: "🎨" },
    { id: 6, title: "Решить 5 задач по логике", club: "Программирование", xp: 50, completed: false, emoji: "🧩" },
];

export default function YouthTasks() {
    const router = useRouter();
    const [tasks, setTasks] = useState(MOCK_TASKS);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const doneCount = tasks.filter(t => t.completed).length;
    const totalXP = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0);

    return (
        <View style={{ flex: 1, backgroundColor: "#FDF2F8" }}>
            <LinearGradient 
                colors={["#FCE7F3", "#F3E8FF"]} 
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }} 
            />
            
            <SafeAreaView edges={["top"]}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, marginBottom: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8, backgroundColor: "white", borderRadius: 20 }}>
                        <Feather name="arrow-left" size={24} color="#EC4899" />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: "800", color: "#1F2937" }}>Задания</Text>
                        <Text style={{ fontSize: 13, color: "#6B7280" }}>Выполнено: {doneCount} из {tasks.length}</Text>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Score Card */}
                <LinearGradient 
                    colors={["#EC4899", "#D946EF"]} 
                    start={{x:0, y:0}} end={{x:1, y:1}}
                    style={{ borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: "#D946EF", shadowOpacity: 0.3, shadowRadius: 15 }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        <View style={{ alignItems: "center" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                <Feather name="star" size={20} color="#FDE047" fill="#FDE047" />
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

                <Text style={{ fontSize: 18, fontWeight: "800", color: "#1F2937", marginBottom: 16, marginLeft: 4 }}>Твои дела</Text>

                {tasks.map(task => (
                    <TouchableOpacity
                        key={task.id}
                        onPress={() => toggleTask(task.id)}
                        style={{ 
                            backgroundColor: task.completed ? "#F0FDF4" : "white",
                            borderRadius: 22,
                            padding: 16,
                            marginBottom: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            borderWidth: 2,
                            borderColor: task.completed ? "#4ADE80" : "transparent",
                            shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10
                        }}
                    >
                        <Text style={{ fontSize: 32, marginRight: 16 }}>{task.emoji}</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ 
                                fontSize: 16, 
                                fontWeight: "700", 
                                color: task.completed ? "#9CA3AF" : "#1F2937",
                                textDecorationLine: task.completed ? "line-through" : "none"
                            }}>
                                {task.title}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{task.club}</Text>
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            {task.completed ? (
                                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#22C55E", alignItems: "center", justifyContent: "center" }}>
                                    <Feather name="check" size={18} color="white" />
                                </View>
                            ) : (
                                <View style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#E5E7EB" }} />
                            )}
                            <Text style={{ fontSize: 11, fontWeight: "800", color: task.completed ? "#22C55E" : "#EC4899", marginTop: 4 }}>
                                +{task.xp} XP
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Motivation Card */}
                {doneCount === tasks.length ? (
                    <LinearGradient 
                        colors={["#FBBF24", "#F59E0B"]} 
                        style={{ borderRadius: 24, padding: 24, alignItems: "center", marginTop: 12 }}
                    >
                        <Text style={{ fontSize: 40, marginBottom: 8 }}>🎉</Text>
                        <Text style={{ fontSize: 20, fontWeight: "900", color: "white" }}>Все задания выполнены!</Text>
                        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 4, textAlign: "center" }}>
                            Ты молодец! Лови бонус +100 XP к уровню!
                        </Text>
                    </LinearGradient>
                ) : (
                    <View style={{ backgroundColor: "white", borderRadius: 24, padding: 24, alignItems: "center", marginTop: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 }}>
                        <Text style={{ fontSize: 32, marginBottom: 8 }}>🎯</Text>
                        <Text style={{ fontSize: 16, fontWeight: "800", color: "#EC4899" }}>
                            Еще {tasks.length - doneCount} заданий до успеха!
                        </Text>
                        <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4, textAlign: "center" }}>
                            Выполни всё до конца недели и получи специальный значок.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
