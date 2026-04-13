import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useParentData } from "../../contexts/ParentDataContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, RADIUS, SHADOWS } from "../../constants/theme";

export default function ParentHome() {
    const router = useRouter();
    const { parentProfile, childrenProfile: children, activeChildId, setActiveChildId } = useParentData();

    const getRecommendations = () => {
        if (children.length === 0) return [];
        return [
            { id: "1", title: "Лего-конструирование", age: "6-11", for: children[0]?.name || "Ваш ребенок", rating: "4.8" },
            { id: "2", title: "Программирование Python", age: "12-17", for: children[0]?.name || "Ваш ребенок", rating: "4.9" },
        ];
    };

    const recommendations = getRecommendations();
    const upcomingClasses: any[] = [];

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    {/* Header */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                        <Pressable onPress={() => router.push("/profile")} style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 44, height: 44, borderRadius: 22,
                                backgroundColor: `${COLORS.primary}15`,
                                alignItems: "center", justifyContent: "center",
                            }}>
                                <Feather name="user" size={20} color={COLORS.primary} />
                            </View>
                            <View style={{ marginLeft: 12 }}>
                                <Text style={{ color: COLORS.mutedForeground, fontSize: 13 }}>Добро пожаловать</Text>
                                <Text style={{ color: COLORS.foreground, fontWeight: "700", fontSize: 18 }}>
                                    {parentProfile?.firstName || "Родитель"}
                                </Text>
                            </View>
                        </Pressable>
                        <Pressable
                            style={{
                                width: 44, height: 44, borderRadius: 22,
                                backgroundColor: COLORS.muted,
                                alignItems: "center", justifyContent: "center",
                            }}
                        >
                            <Feather name="bell" size={20} color={COLORS.foreground} />
                        </Pressable>
                    </View>

                    {/* Children Cards */}
                    <View style={{ marginBottom: 28 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontWeight: "700", fontSize: 18, color: COLORS.foreground }}>Мои дети</Text>
                            <Pressable onPress={() => router.push("/parent/children" as any)}>
                                <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: "500" }}>Все</Text>
                            </Pressable>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {children.map((child) => (
                                <Pressable
                                    key={child.id}
                                    onPress={() => router.push(`/parent/child/${child.id}` as any)}
                                    style={{
                                        marginRight: 12,
                                        width: 130,
                                        padding: 16,
                                        backgroundColor: COLORS.card,
                                        borderRadius: RADIUS.lg,
                                        alignItems: "center",
                                        borderWidth: 2,
                                        borderColor: activeChildId === child.id ? COLORS.primary : COLORS.border,
                                        ...SHADOWS.md,
                                    }}
                                >
                                    <View style={{
                                        width: 52, height: 52, borderRadius: 26,
                                        backgroundColor: `${COLORS.primary}10`,
                                        alignItems: "center", justifyContent: "center",
                                        marginBottom: 10,
                                    }}>
                                        <Text style={{ color: COLORS.primary, fontWeight: "700", fontSize: 20 }}>
                                            {child.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <Text style={{ fontWeight: "600", color: COLORS.foreground, textAlign: "center", marginBottom: 4 }}>
                                        {child.name}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginBottom: 8 }}>
                                        {child.age} лет
                                    </Text>
                                    <View style={{
                                        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
                                        backgroundColor: child.talentProfile ? `${COLORS.success}15` : `${COLORS.destructive}15`,
                                    }}>
                                        <Text style={{
                                            fontSize: 10, fontWeight: "600",
                                            color: child.talentProfile ? COLORS.success : COLORS.destructive,
                                        }}>
                                            {child.talentProfile ? "Тест пройден" : "Нужен тест"}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* AI Recommendations */}
                    <View style={{ marginBottom: 28 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <View>
                                <Text style={{ fontWeight: "700", fontSize: 18, color: COLORS.foreground }}>Рекомендации AI</Text>
                                <Text style={{ fontSize: 13, color: COLORS.mutedForeground, marginTop: 2 }}>
                                    Основаны на диагностике
                                </Text>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {recommendations.map((rec) => (
                                <Pressable
                                    key={rec.id}
                                    onPress={() => router.push(`/(tabs)/parent/club/${rec.id}` as any)}
                                    style={{
                                        marginRight: 12,
                                        width: 240,
                                        backgroundColor: COLORS.card,
                                        borderRadius: RADIUS.lg,
                                        overflow: "hidden",
                                        borderWidth: 1,
                                        borderColor: COLORS.border,
                                        ...SHADOWS.md,
                                    }}
                                >
                                    <View style={{ height: 120, backgroundColor: COLORS.muted, justifyContent: "center", alignItems: "center" }}>
                                        <Feather name="book-open" size={32} color={COLORS.mutedForeground} />
                                        <View style={{
                                            position: "absolute", top: 8, right: 8,
                                            backgroundColor: COLORS.card,
                                            paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
                                            flexDirection: "row", alignItems: "center",
                                        }}>
                                            <Feather name="star" size={11} color={COLORS.accent} />
                                            <Text style={{ fontSize: 11, fontWeight: "600", marginLeft: 3, color: COLORS.foreground }}>
                                                {rec.rating}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ padding: 14 }}>
                                        <Text style={{ fontWeight: "600", color: COLORS.foreground, marginBottom: 4, lineHeight: 20 }}>
                                            {rec.title}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginBottom: 8 }}>
                                            {rec.age}
                                        </Text>
                                        <View style={{
                                            backgroundColor: `${COLORS.primary}10`,
                                            alignSelf: "flex-start",
                                            paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
                                        }}>
                                            <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: "500" }}>
                                                Для: {rec.for}
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Upcoming Classes */}
                    <View style={{ marginBottom: 28 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontWeight: "700", fontSize: 18, color: COLORS.foreground }}>Ближайшие занятия</Text>
                            <Pressable onPress={() => router.push("/(tabs)/parent/calendar" as any)}>
                                <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: "500" }}>Календарь</Text>
                            </Pressable>
                        </View>
                        {upcomingClasses.length > 0 ? (
                            <View />
                        ) : (
                            <View style={{
                                backgroundColor: COLORS.card,
                                padding: 32,
                                borderRadius: RADIUS.lg,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: COLORS.border,
                                ...SHADOWS.sm,
                            }}>
                                <Feather name="calendar" size={32} color={COLORS.mutedForeground} style={{ marginBottom: 12 }} />
                                <Text style={{ color: COLORS.mutedForeground, textAlign: "center", fontWeight: "500", marginBottom: 12 }}>
                                    Нет запланированных занятий
                                </Text>
                                <Pressable onPress={() => router.push("/catalog")}>
                                    <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Выбрать кружок</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
