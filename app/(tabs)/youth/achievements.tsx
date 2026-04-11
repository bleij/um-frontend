import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ACHIEVEMENTS = [
    { id: 1, name: "Первые шаги", emoji: "👣", description: "Зарегистрировался в системе", unlocked: true, colors: ["#60A5FA", "#2563EB"] },
    { id: 2, name: "Художник", emoji: "🎨", description: "Посетил 5 занятий по рисованию", unlocked: true, colors: ["#FBBF24", "#D97706"] },
    { id: 3, name: "Спортсмен", emoji: "⚽", description: "Посетил 5 занятий спортом", unlocked: true, colors: ["#4ADE80", "#16A34A"] },
    { id: 4, name: "Программист", emoji: "💻", description: "Написал первую программу", unlocked: true, colors: ["#A78BFA", "#7C3AED"] },
    { id: 5, name: "Отличник", emoji: "⭐", description: "Выполнил 20 заданий", unlocked: true, colors: ["#F472B6", "#DB2777"] },
    { id: 6, name: "Музыкант", emoji: "🎵", description: "Посетил 5 музыкальных занятий", unlocked: false, colors: ["#818CF8", "#4F46E5"] },
    { id: 7, name: "Читатель", emoji: "📚", description: "Прочитай 10 книг", unlocked: false, colors: ["#FB923C", "#EA580C"] },
    { id: 8, name: "Друг", emoji: "👥", description: "Найди 5 друзей в системе", unlocked: false, colors: ["#2DD4BF", "#0D9488"] },
    { id: 9, name: "Исследователь", emoji: "🔍", description: "Попробуй 10 разных кружков", unlocked: false, colors: ["#F87171", "#DC2626"] },
    { id: 10, name: "Мастер", emoji: "🏆", description: "Достигни Level 10", unlocked: false, colors: ["#F59E0B", "#D97706"] },
    { id: 11, name: "Гений", emoji: "🧠", description: "Набери 5000 XP", unlocked: false, colors: ["#8B5CF6", "#7C3AED"] },
    { id: 12, name: "Легенда", emoji: "👑", description: "Получи все достижения", unlocked: false, colors: ["#FCD34D", "#B45309"] },
];

export default function YouthAchievements() {
    const router = useRouter();
    const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
    const progress = (unlockedCount / ACHIEVEMENTS.length) * 100;

    return (
        <View style={{ flex: 1, backgroundColor: "#FDF2F8" }}>
            <LinearGradient 
                colors={["#FCE7F3", "#F3E8FF", "#FEF3C7"]} 
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }} 
            />
            
            <SafeAreaView edges={["top"]}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, marginBottom: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8, backgroundColor: "white", borderRadius: 20 }}>
                        <Feather name="arrow-left" size={24} color="#6C5CE7" />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: "800", color: "#1F2937" }}>Достижения</Text>
                        <Text style={{ fontSize: 13, color: "#6B7280" }}>Открыто {unlockedCount} из {ACHIEVEMENTS.length}</Text>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Progress Card */}
                <View style={{ backgroundColor: "white", borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                        <Feather name="zap" size={20} color="#6C5CE7" />
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937", marginLeft: 8 }}>Твой прогресс</Text>
                    </View>
                    <View style={{ height: 12, backgroundColor: "#F3F4F6", borderRadius: 6, overflow: "hidden" }}>
                        <LinearGradient 
                            colors={["#6C5CE7", "#EC4899"]} 
                            start={{x:0, y:0}} end={{x:1, y:0}}
                            style={{ height: "100%", width: `${progress}%`, borderRadius: 6 }} 
                        />
                    </View>
                    <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: 10, fontWeight: "600" }}>
                        {Math.round(progress)}% завершено
                    </Text>
                </View>

                {/* Grid */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                    {ACHIEVEMENTS.map(item => (
                        <View 
                            key={item.id} 
                            style={{ 
                                width: (width - 48) / 3, 
                                height: (width - 48) / 3 + 20,
                                marginBottom: 16,
                            }}
                        >
                            {item.unlocked ? (
                                <LinearGradient
                                    colors={item.colors as any}
                                    style={{ flex: 1, borderRadius: 20, padding: 10, alignItems: "center", justifyContent: "center", shadowColor: item.colors[0], shadowOpacity: 0.2, shadowRadius: 8 }}
                                >
                                    <Text style={{ fontSize: 32, marginBottom: 4 }}>{item.emoji}</Text>
                                    <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: "800", color: "white", textAlign: "center" }}>{item.name}</Text>
                                    <Text numberOfLines={2} style={{ fontSize: 7, color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 2 }}>{item.description}</Text>
                                </LinearGradient>
                            ) : (
                                <View style={{ flex: 1, backgroundColor: "white", borderRadius: 20, padding: 10, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E5E7EB" }}>
                                    <View style={{ opacity: 0.2, alignItems: "center" }}>
                                        <Text style={{ fontSize: 32, marginBottom: 4 }}>🔒</Text>
                                        <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: "800", color: "#6B7280", textAlign: "center" }}>{item.name}</Text>
                                        <Text numberOfLines={2} style={{ fontSize: 7, color: "#9CA3AF", textAlign: "center", marginTop: 2 }}>{item.description}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Bottom Motivation */}
                <LinearGradient 
                    colors={["#6C5CE7", "#4338CA"]} 
                    style={{ borderRadius: 24, padding: 20, marginTop: 12 }}
                >
                    <Text style={{ textAlign: "center", fontWeight: "800", color: "white", fontSize: 15 }}>💪 Продолжай собирать достижения!</Text>
                    <Text style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>
                        Выполняй задания каждый день и посещай занятия, чтобы открыть все легендарные значки!
                    </Text>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}
