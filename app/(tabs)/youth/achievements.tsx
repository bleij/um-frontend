import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";

const { width } = Dimensions.get("window");

const ACHIEVEMENT_ICONS: Record<string, string> = {
    "Первые шаги": "log-in", "Художник": "edit-3", "Спортсмен": "activity",
    "Программист": "code", "Отличник": "star", "Музыкант": "music",
    "Читатель": "book", "Друг": "users", "Исследователь": "search",
    "Мастер": "award", "Гений": "cpu", "Легенда": "shield",
};

const ACHIEVEMENTS = [
    { id: 1, name: "Первые шаги", description: "Зарегистрировался в системе", unlocked: true },
    { id: 2, name: "Художник", description: "Посетил 5 занятий по рисованию", unlocked: true },
    { id: 3, name: "Спортсмен", description: "Посетил 5 занятий спортом", unlocked: true },
    { id: 4, name: "Программист", description: "Написал первую программу", unlocked: true },
    { id: 5, name: "Отличник", description: "Выполнил 20 заданий", unlocked: true },
    { id: 6, name: "Музыкант", description: "Посетил 5 музыкальных занятий", unlocked: false },
    { id: 7, name: "Читатель", description: "Прочитай 10 книг", unlocked: false },
    { id: 8, name: "Друг", description: "Найди 5 друзей в системе", unlocked: false },
    { id: 9, name: "Исследователь", description: "Попробуй 10 разных кружков", unlocked: false },
    { id: 10, name: "Мастер", description: "Достигни Level 10", unlocked: false },
    { id: 11, name: "Гений", description: "Набери 5000 XP", unlocked: false },
    { id: 12, name: "Легенда", description: "Получи все достижения", unlocked: false },
];

export default function YouthAchievements() {
    const router = useRouter();
    const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
    const progress = (unlockedCount / ACHIEVEMENTS.length) * 100;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView edges={["top"]}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, marginBottom: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                        <Feather name="arrow-left" size={24} color={COLORS.foreground} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: "800", color: COLORS.foreground }}>Достижения</Text>
                        <Text style={{ fontSize: 13, color: COLORS.mutedForeground }}>
                            Открыто {unlockedCount} из {ACHIEVEMENTS.length}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Progress Card */}
                <View style={{
                    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 20, marginBottom: 24,
                    borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.md,
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                        <Feather name="zap" size={20} color={COLORS.primary} />
                        <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.foreground, marginLeft: 8 }}>
                            Твой прогресс
                        </Text>
                    </View>
                    <View style={{ height: 10, backgroundColor: COLORS.muted, borderRadius: 5, overflow: "hidden" }}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={{ height: "100%", width: `${progress}%`, borderRadius: 5 }}
                        />
                    </View>
                    <Text style={{ fontSize: 13, color: COLORS.mutedForeground, textAlign: "center", marginTop: 10, fontWeight: "600" }}>
                        {Math.round(progress)}% завершено
                    </Text>
                </View>

                {/* Grid */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                    {ACHIEVEMENTS.map(item => {
                        const iconName = ACHIEVEMENT_ICONS[item.name] || "award";
                        return (
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
                                        colors={[COLORS.primary, COLORS.secondary]}
                                        style={{
                                            flex: 1, borderRadius: RADIUS.lg, padding: 10,
                                            alignItems: "center", justifyContent: "center",
                                            ...SHADOWS.md,
                                        }}
                                    >
                                        <Feather name={iconName as any} size={28} color="white" style={{ marginBottom: 4 }} />
                                        <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: "800", color: "white", textAlign: "center" }}>
                                            {item.name}
                                        </Text>
                                        <Text numberOfLines={2} style={{ fontSize: 7, color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 2 }}>
                                            {item.description}
                                        </Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={{
                                        flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 10,
                                        alignItems: "center", justifyContent: "center",
                                        borderWidth: 1, borderColor: COLORS.border,
                                    }}>
                                        <View style={{ opacity: 0.2, alignItems: "center" }}>
                                            <Feather name="lock" size={28} color={COLORS.mutedForeground} style={{ marginBottom: 4 }} />
                                            <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: "800", color: COLORS.mutedForeground, textAlign: "center" }}>
                                                {item.name}
                                            </Text>
                                            <Text numberOfLines={2} style={{ fontSize: 7, color: COLORS.mutedForeground, textAlign: "center", marginTop: 2 }}>
                                                {item.description}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Bottom Motivation */}
                <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={{ borderRadius: RADIUS.lg, padding: 20, marginTop: 12 }}
                >
                    <Text style={{ textAlign: "center", fontWeight: "800", color: "white", fontSize: 15 }}>
                        Продолжай собирать достижения!
                    </Text>
                    <Text style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>
                        Выполняй задания каждый день и посещай занятия, чтобы открыть все легендарные значки!
                    </Text>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}
