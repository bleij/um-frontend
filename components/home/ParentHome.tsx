import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useParentData } from "../../contexts/ParentDataContext";

export default function ParentHome() {
    const router = useRouter();
    const { parentProfile, childrenProfile: children, activeChildId, setActiveChildId } = useParentData();
    const [showNotifications, setShowNotifications] = useState(false);

    const getRecommendations = () => {
        if (children.length === 0) return [];
        // Временные моки для UI из Vite
        return [
            { id: "1", title: "Лего-конструирование", age: "6-11", for: children[0]?.name || "Ваш ребенок", rating: "4.8" },
            { id: "2", title: "Программирование Python", age: "12-17", for: children[0]?.name || "Ваш ребенок", rating: "4.9" }
        ];
    };

    const recommendations = getRecommendations();
    const upcomingClasses: any[] = [];

    return (
        <View className="flex-1 bg-white">
            <LinearGradient 
                colors={["#6C5CE7", "#8B7FE8"]} 
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }} 
            />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100, paddingTop: Platform.OS === 'ios' ? 60 : 40 }}>
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center">
                        <Pressable onPress={() => router.push("/profile")}>
                            <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                                <Image 
                                    source={{ uri: "https://images.unsplash.com/photo-1758687126864-96b61e1b3af0?w=100&h=100&fit=crop" }} 
                                    style={{ width: "100%", height: "100%" }} 
                                />
                            </View>
                        </Pressable>
                        <View className="ml-3">
                            <Text className="text-white/80 font-semibold text-sm">Добро пожаловать</Text>
                            <Text className="text-white font-bold text-xl">{parentProfile?.firstName || "Родитель"}</Text>
                        </View>
                    </View>
                    <Pressable 
                        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center relative"
                        onPress={() => setShowNotifications(true)}
                    >
                        <Feather name="bell" size={20} color="#FFFFFF" />
                        <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#6C5CE7]" />
                    </Pressable>
                </View>

                {/* Children Cards */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-bold text-xl text-white">Мои дети</Text>
                        <Pressable onPress={() => router.push("/parent/children" as any)}>
                            <Text className="text-white/90 text-sm font-medium">Все</Text>
                        </Pressable>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible pb-2">
                        {children.map((child) => (
                            <Pressable
                                key={child.id}
                                onPress={() => router.push(`/parent/child/${child.id}` as any)}
                                className="mr-4 w-32 p-4 bg-white/95 rounded-3xl items-center shadow-md border-2"
                                style={{ borderColor: activeChildId === child.id ? "#6C5CE7" : "transparent" }}
                            >
                                <View className="w-16 h-16 rounded-full bg-indigo-100 items-center justify-center mb-3">
                                    <Text className="text-indigo-600 font-bold text-xl">{child.name.charAt(0).toUpperCase()}</Text>
                                </View>
                                <Text className="font-bold text-gray-800 text-center">{child.name}</Text>
                                <Text className="text-xs text-gray-500 text-center mb-2">{child.age} лет</Text>
                                <View className={`px-2 py-1 rounded-full ${child.talentProfile ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <Text className={`text-[10px] font-bold ${child.talentProfile ? 'text-green-700' : 'text-red-600'}`}>
                                        {child.talentProfile ? "Тест пройден" : "Нужен тест"}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* AI Recommendations */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="font-bold text-xl text-white">Рекомендации AI</Text>
                            <Text className="text-sm text-white/70 mt-1">Основаны на диагностике</Text>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible pb-2">
                        {recommendations.map((rec) => (
                            <Pressable
                                key={rec.id}
                                onPress={() => router.push(`/(tabs)/parent/club/${rec.id}` as any)}
                                className="mr-4 w-60 bg-white rounded-2xl overflow-hidden shadow-sm"
                            >
                                <View className="h-32 bg-gray-200">
                                    <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex-row items-center">
                                        <Feather name="star" size={12} color="#EAB308" />
                                        <Text className="text-xs font-bold ml-1">{rec.rating}</Text>
                                    </View>
                                </View>
                                <View className="p-3">
                                    <Text className="font-bold text-gray-800 mb-1 leading-tight">{rec.title}</Text>
                                    <Text className="text-xs text-gray-500 mb-2">{rec.age}</Text>
                                    <View className="bg-purple-50 self-start px-2 py-1 rounded-full">
                                        <Text className="text-[10px] text-purple-700 font-semibold">Для: {rec.for}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Upcoming Classes */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-bold text-xl text-white">Ближайшие занятия</Text>
                        <Pressable onPress={() => router.push("/(tabs)/parent/calendar" as any)}>
                            <Text className="text-white/90 text-sm font-medium">Календарь</Text>
                        </Pressable>
                    </View>
                    {upcomingClasses.length > 0 ? (
                        <View className="space-y-3">
                            {/* TODO Classes UI */}
                        </View>
                    ) : (
                        <View className="bg-white/95 p-8 rounded-2xl items-center">
                            <Feather name="calendar" size={32} color="#9CA3AF" className="mb-3" />
                            <Text className="text-gray-500 text-center font-medium">Нет запланированных занятий</Text>
                            <Pressable className="mt-4" onPress={() => router.push("/catalog")}>
                                <Text className="text-indigo-600 font-bold">Выбрать кружок</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
