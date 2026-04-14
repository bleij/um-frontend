import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";
import { useIsDesktop } from "../../../lib/useIsDesktop";

const MOCK_APPLICATIONS = [
    {
        id: "1",
        childName: "Мария Иванова",
        age: 7,
        parent: "Екатерина Иванова",
        club: "Художественная студия",
        date: "25 фев 2026",
        status: "new",
        avatar: "https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop",
    },
    {
        id: "2",
        childName: "Дмитрий Петров",
        age: 14,
        parent: "Андрей Петров",
        club: "Футбольная школа",
        date: "26 фев 2026",
        status: "new",
        avatar: "https://images.unsplash.com/photo-1510340842445-b6b8a6c0762e?w=100&h=100&fit=crop",
    },
    {
        id: "3",
        childName: "София Смирнова",
        age: 10,
        parent: "Ольга Смирнова",
        club: "Программирование",
        date: "27 фев 2026",
        status: "new",
        avatar: "https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop",
    },
];

export default function OrgApplications() {
    const router = useRouter();
    const isDesktop = useIsDesktop();
    const [apps, setApps] = useState(MOCK_APPLICATIONS);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        setApps(prev => prev.filter(a => a.id !== id));
        Alert.alert(
            action === 'approve' ? "Одобрено" : "Отклонено",
            `Заявка ${action === 'approve' ? 'принята' : 'отклонена'}.`
        );
    };

    const newApps = apps.filter(a => a.status === 'new');

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Заявки на запись</Text>
                            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{newApps.length} новых заявок</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: isDesktop ? 32 : 100 }}>
                {newApps.length === 0 ? (
                    <View style={{ alignItems: "center", marginTop: 40 }}>
                        <Feather name="check-circle" size={48} color="#D1D5DB" />
                        <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 16 }}>Новых заявок пока нет</Text>
                    </View>
                ) : (
                    newApps.map(app => (
                        <View key={app.id} style={{ backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.md }}>
                            <View style={{ flexDirection: "row", marginBottom: 16 }}>
                                <Image source={{ uri: app.avatar }} style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "#F3F4F6" }} />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontWeight: "700", fontSize: 16, color: "#1F1F2E" }}>{app.childName}</Text>
                                        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>{app.date}</Text>
                                    </View>
                                    <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{app.age} лет · Родитель: {app.parent}</Text>
                                </View>
                            </View>

                            <View style={{ backgroundColor: `${COLORS.primary}08`, padding: 12, borderRadius: 14, marginBottom: 16 }}>
                                <Text style={{ fontSize: 13, color: COLORS.foreground }}>
                                    <Text style={{ fontWeight: "700" }}>Кружок: </Text>
                                    {app.club}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <TouchableOpacity 
                                    onPress={() => handleAction(app.id, 'reject')}
                                    style={{ flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#EF4444", alignItems: "center", justifyContent: "center" }}
                                >
                                    <Text style={{ color: "#EF4444", fontWeight: "700" }}>Отклонить</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => handleAction(app.id, 'approve')}
                                    style={{ flex: 2, height: 48, borderRadius: 12, backgroundColor: "#22C55E", alignItems: "center", justifyContent: "center" }}
                                >
                                    <Text style={{ color: "white", fontWeight: "700" }}>Одобрить</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
