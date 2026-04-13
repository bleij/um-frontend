import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";

const PATH_STEPS = [
    {
        id: 1, phase: "Текущие навыки", status: "completed",
        items: [
            { text: "Креативность: высокий уровень", done: true },
            { text: "Коммуникация: средний уровень", done: true },
            { text: "Лидерство: требует развития", done: true },
        ],
    },
    {
        id: 2, phase: "Цели развития", status: "active",
        items: [
            { text: "Развить навыки публичных выступлений", done: true },
            { text: "Улучшить командную работу", done: false },
            { text: "Повысить уверенность в себе", done: false },
        ],
    },
    {
        id: 3, phase: "Рекомендованные кружки", status: "active",
        items: [
            { text: "Театральная студия", done: false },
            { text: "Ораторское искусство", done: false },
            { text: "Командные виды спорта", done: false },
        ],
    },
    {
        id: 4, phase: "Задания и активности", status: "pending",
        items: [
            { text: "Участие в школьном спектакле", done: false },
            { text: "Выступление перед классом", done: false },
            { text: "Организация группового проекта", done: false },
        ],
    },
    {
        id: 5, phase: "Контрольные точки", status: "pending",
        items: [
            { text: "Оценка прогресса через 1 месяц", done: false, date: "28 мар" },
            { text: "Промежуточная оценка через 3 месяца", done: false, date: "28 май" },
            { text: "Финальная оценка через 6 месяцев", done: false, date: "28 авг" },
        ],
    },
];

const STATUS_COLOR: Record<string, string> = {
    completed: "#22C55E",
    active: "#6C5CE7",
    pending: "#D1D5DB",
};

const STATUS_LABEL: Record<string, string> = {
    completed: "Завершено",
    active: "В процессе",
    pending: "Ожидает",
};

const STATUS_TEXT_COLOR: Record<string, string> = {
    completed: "#15803D",
    active: "#6C5CE7",
    pending: "#6B7280",
};

export default function MentorLearningPath() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, marginBottom: 4 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Feather name="book-open" size={20} color="white" style={{ marginRight: 8 }} />
                        <View>
                            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>План развития</Text>
                            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Анна Петрова</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Overview */}
                <View style={{ backgroundColor: "white", borderRadius: 18, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 }}>
                    <Text style={{ fontWeight: "700", fontSize: 15, color: "#1F1F2E", marginBottom: 10 }}>Общий прогресс</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <View style={{ flex: 1, height: 10, backgroundColor: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                            <View style={{ height: 10, width: "40%", backgroundColor: "#6C5CE7", borderRadius: 999 }} />
                        </View>
                        <Text style={{ fontWeight: "800", fontSize: 20, color: "#6C5CE7" }}>40%</Text>
                    </View>
                    <Text style={{ color: "#9CA3AF", fontSize: 13, marginTop: 6 }}>2 из 5 этапов завершено</Text>
                </View>

                {/* Steps Timeline */}
                <View style={{ position: "relative" }}>
                    {/* Vertical line */}
                    <View style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, backgroundColor: "#E5E7EB" }} />

                    {PATH_STEPS.map((step, index) => {
                        const doneCount = step.items.filter(i => i.done).length;
                        const progress = Math.round((doneCount / step.items.length) * 100);
                        return (
                            <View key={step.id} style={{ flexDirection: "row", marginBottom: 20 }}>
                                {/* Dot */}
                                <View style={{ width: 40, alignItems: "center", zIndex: 1 }}>
                                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: STATUS_COLOR[step.status], alignItems: "center", justifyContent: "center", shadowColor: STATUS_COLOR[step.status], shadowOpacity: 0.3, shadowRadius: 4 }}>
                                        {step.status === "completed" && <Feather name="check" size={14} color="white" />}
                                        {step.status === "active" && <Feather name="target" size={14} color="white" />}
                                        {step.status === "pending" && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "white" }} />}
                                    </View>
                                </View>

                                {/* Card */}
                                <View style={{ flex: 1, backgroundColor: "white", borderRadius: 18, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                        <Text style={{ fontWeight: "700", fontSize: 15, color: "#1F1F2E" }}>{step.phase}</Text>
                                        <View style={{ backgroundColor: STATUS_COLOR[step.status] + "20", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 }}>
                                            <Text style={{ fontSize: 11, fontWeight: "600", color: STATUS_TEXT_COLOR[step.status] }}>{STATUS_LABEL[step.status]}</Text>
                                        </View>
                                    </View>

                                    {step.status !== "pending" && (
                                        <View style={{ marginBottom: 10 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                                                <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Прогресс</Text>
                                                <Text style={{ fontSize: 12, fontWeight: "600", color: "#6C5CE7" }}>{progress}%</Text>
                                            </View>
                                            <View style={{ height: 5, backgroundColor: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                                                <View style={{ height: 5, width: `${progress}%`, backgroundColor: step.status === "completed" ? "#22C55E" : "#6C5CE7", borderRadius: 999 }} />
                                            </View>
                                        </View>
                                    )}

                                    {step.items.map((item, i) => (
                                        <View key={i} style={{ flexDirection: "row", alignItems: "center", padding: 9, borderRadius: 10, backgroundColor: item.done ? "#F0FDF4" : "#F9FAFB", marginBottom: 5 }}>
                                            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: item.done ? "#22C55E" : "transparent", borderWidth: item.done ? 0 : 1.5, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                                                {item.done && <Feather name="check" size={10} color="white" />}
                                            </View>
                                            <Text style={{ fontSize: 13, flex: 1, color: item.done ? "#9CA3AF" : "#374151", textDecorationLine: item.done ? "line-through" : "none" }}>{item.text}</Text>
                                            {"date" in item && <Text style={{ fontSize: 11, color: "#9CA3AF" }}>{(item as any).date}</Text>}
                                        </View>
                                    ))}

                                    {step.status === "active" && (
                                        <TouchableOpacity style={{ backgroundColor: "#EDE9FE", borderRadius: 10, padding: 9, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                                            <Feather name="plus" size={14} color="#6C5CE7" />
                                            <Text style={{ color: "#6C5CE7", fontWeight: "600", fontSize: 12, marginLeft: 4 }}>Добавить элемент</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={{ flex: 1, borderRadius: 16 }}>
                        <TouchableOpacity style={{ padding: 14, alignItems: "center" }}>
                            <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>Сохранить изменения</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <TouchableOpacity style={{ paddingHorizontal: 20, borderRadius: 16, backgroundColor: "white", borderWidth: 2, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontWeight: "600", fontSize: 15, color: "#6B7280" }}>Отмена</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
