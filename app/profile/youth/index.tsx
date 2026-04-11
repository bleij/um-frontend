import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Header } from "../../../components/ui/Header";

export default function YouthProfile() {
    const router = useRouter();
    
    const handleLogout = () => {
        Alert.alert("Выход", "Вы действительно хотите выйти?", [
            { text: "Отмена", style: "cancel" },
            { text: "Выйти", style: "destructive", onPress: () => router.replace("/(auth)") }
        ]);
    };

    const menuItems = [
        { icon: "award", label: "Мои достижения", action: () => Alert.alert("В разработке") },
        { icon: "heart", label: "Интересы", action: () => Alert.alert("В разработке") },
        { icon: "settings", label: "Настройки", action: () => Alert.alert("В разработке") },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#FDF2F8" }}>
            <LinearGradient 
                colors={["#FCE7F3", "#F3E8FF"]} 
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }} 
            />

            <Header title="Мой Профиль" showBack={false} />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {/* Profile Info */}
                <View style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: 32, borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, alignItems: "center", marginBottom: 24 }}>
                    <View style={{ width: 112, height: 112, borderRadius: 56, overflow: "hidden", marginBottom: 16, backgroundColor: "#E5E7EB", borderWidth: 4, borderColor: "white" }}>
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1758687126864-96b61e1b3af0?w=200&h=200&fit=crop" }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937", marginBottom: 4 }}>Максим</Text>
                    <Text style={{ color: "#6B7280", marginBottom: 24 }}>Sudent • Level 8</Text>
                    
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <View style={{ alignItems: "center", marginRight: 24 }}>
                            <LinearGradient 
                                colors={["#EC4899", "#D946EF"]} 
                                style={{ width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 8 }}
                            >
                                <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>24</Text>
                            </LinearGradient>
                            <Text style={{ fontSize: 12, color: "#4B5563", fontWeight: "500" }}>Достижений</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <LinearGradient 
                                colors={["#6C5CE7", "#A855F7"]} 
                                style={{ width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 8 }}
                            >
                                <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>8</Text>
                            </LinearGradient>
                            <Text style={{ fontSize: 12, color: "#4B5563", fontWeight: "500" }}>Курсов</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={{ marginBottom: 24 }}>
                    {menuItems.map((item, index) => (
                        <Pressable
                            key={index}
                            onPress={item.action}
                            style={{ width: "100%", flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, marginBottom: 12 }}
                        >
                            <LinearGradient
                                colors={["#EC4899", "#D946EF"]}
                                style={{ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 }}
                            >
                                <Feather name={item.icon as any} size={20} color="#FFFFFF" />
                            </LinearGradient>
                            <Text style={{ flex: 1, fontWeight: "600", color: "#374151", fontSize: 16 }}>{item.label}</Text>
                            <Feather name="chevron-right" size={20} color="#EC4899" />
                        </Pressable>
                    ))}
                </View>

                {/* Logout */}
                <Pressable
                    onPress={handleLogout}
                    style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 }}
                >
                    <Feather name="log-out" size={20} color="#DC2626" />
                    <Text style={{ color: "#DC2626", fontWeight: "bold", fontSize: 16, marginLeft: 8 }}>Выйти из аккаунта</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}
