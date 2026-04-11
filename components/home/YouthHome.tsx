import React from "react";
import { View, Text, ScrollView, Platform, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function YouthHome() {
    const router = useRouter();
    const firstName = "Ученик";

    return (
        <View className="flex-1 bg-[#FDF2F8]">
            <LinearGradient 
                colors={["#FCE7F3", "#F3E8FF", "#FEF3C7"]} 
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }} 
            />
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 100 }}>
                {/* Header with Avatar and Level */}
                <View className="bg-white p-5 rounded-3xl shadow-lg mb-5">
                    <View className="flex-row items-center mb-4">
                        <Pressable className="p-2" onPress={() => router.canGoBack() ? router.back() : null}>
                            <Feather name="arrow-left" size={24} color="#374151" />
                        </Pressable>
                        <View className="flex-1 items-center">
                            <View className="w-20 h-20 rounded-full overflow-hidden mb-2 border-4 border-[#6C5CE7]">
                                <Image
                                    source={{ uri: "https://images.unsplash.com/photo-1758687126864-96b61e1b3af0?w=200&h=200&fit=crop" }}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">Привет, {firstName}! 👋</Text>
                            <Text className="text-sm text-gray-600 font-medium mt-1">Level 5</Text>
                        </View>
                        <View className="w-10 h-10" />
                    </View>

                    {/* XP Bar */}
                    <View className="space-y-2">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="font-bold text-[#6C5CE7]">1250 XP</Text>
                            <Text className="text-xs text-gray-500 font-medium">до Level 6: 250 XP</Text>
                        </View>
                        <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <LinearGradient 
                                colors={["#6C5CE7", "#EC4899"]} 
                                start={{x:0, y:0}} end={{x:1, y:0}} 
                                style={{ width: '83%', height: '100%', borderRadius: 999 }} 
                            />
                        </View>
                    </View>
                </View>

                {/* Main Buttons */}
                <View className="flex-row flex-wrap justify-between mb-5">
                    <Pressable 
                        className="w-[48%] mb-3 rounded-3xl shadow-md overflow-hidden"
                        onPress={() => router.push("/(tabs)/youth/goals" as any)}
                    >
                        <LinearGradient colors={["#A855F7", "#9333EA"]} className="p-5 items-center">
                            <Text className="text-4xl mb-2">🎯</Text>
                            <Text className="font-bold text-white text-center">Мои цели</Text>
                        </LinearGradient>
                    </Pressable>
                    <Pressable 
                        className="w-[48%] mb-3 rounded-3xl shadow-md overflow-hidden"
                        onPress={() => router.push("/(tabs)/parent/calendar" as any)}
                    >
                        <LinearGradient colors={["#3B82F6", "#2563EB"]} className="p-5 items-center">
                            <Text className="text-4xl mb-2">📅</Text>
                            <Text className="font-bold text-white text-center">Календарь</Text>
                        </LinearGradient>
                    </Pressable>
                    <Pressable 
                        className="w-[48%] mb-3 rounded-3xl shadow-md overflow-hidden"
                        onPress={() => router.push("/(tabs)/chats" as any)}
                    >
                        <LinearGradient colors={["#10B981", "#059669"]} className="p-5 items-center">
                            <Text className="text-4xl mb-2">💬</Text>
                            <Text className="font-bold text-white text-center">Ментор</Text>
                        </LinearGradient>
                    </Pressable>
                    <Pressable 
                        className="w-[48%] mb-3 rounded-3xl shadow-md overflow-hidden"
                        onPress={() => router.push("/(tabs)/analytics" as any)}
                    >
                        <LinearGradient colors={["#EAB308", "#F97316"]} className="p-5 items-center">
                            <Text className="text-4xl mb-2">📈</Text>
                            <Text className="font-bold text-white text-center">Прогресс</Text>
                        </LinearGradient>
                    </Pressable>
                </View>

                {/* Achievements Preview */}
                <View className="bg-white p-5 rounded-3xl shadow-lg mb-5">
                    <View className="flex-row items-center mb-4">
                        <Feather name="award" size={20} color="#EAB308" />
                        <Text className="font-bold text-lg text-gray-800 ml-2">Последние достижения</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <View className="items-center">
                            <LinearGradient colors={["#FBBF24", "#D97706"]} className="w-14 h-14 rounded-2xl items-center justify-center mb-1 shadow-sm">
                                <Text className="text-2xl">🎨</Text>
                            </LinearGradient>
                            <Text className="text-xs font-medium text-gray-700">Художник</Text>
                        </View>
                        <View className="items-center">
                            <LinearGradient colors={["#60A5FA", "#2563EB"]} className="w-14 h-14 rounded-2xl items-center justify-center mb-1 shadow-sm">
                                <Text className="text-2xl">⚽</Text>
                            </LinearGradient>
                            <Text className="text-xs font-medium text-gray-700">Спортсмен</Text>
                        </View>
                        <View className="items-center">
                            <LinearGradient colors={["#C084FC", "#9333EA"]} className="w-14 h-14 rounded-2xl items-center justify-center mb-1 shadow-sm">
                                <Text className="text-2xl">💻</Text>
                            </LinearGradient>
                            <Text className="text-xs font-medium text-gray-700">Прогер</Text>
                        </View>
                        <View className="items-center opacity-40">
                            <View className="w-14 h-14 bg-gray-300 rounded-2xl items-center justify-center mb-1 shadow-sm">
                                <Text className="text-2xl">🔒</Text>
                            </View>
                            <Text className="text-xs font-medium text-gray-700">Секрет</Text>
                        </View>
                    </View>
                    <Pressable 
                        onPress={() => router.push("/(tabs)/youth/achievements" as any)}
                        className="w-full py-3 bg-purple-100 rounded-xl items-center"
                    >
                        <Text className="text-[#6C5CE7] font-bold">Смотреть все</Text>
                    </Pressable>
                </View>

                {/* Today's Tasks */}
                <View className="bg-white p-5 rounded-3xl shadow-lg mb-5">
                    <View className="flex-row items-center mb-4">
                        <Feather name="check-square" size={20} color="#6C5CE7" />
                        <Text className="font-bold text-lg text-gray-800 ml-2">Задания на сегодня</Text>
                    </View>
                    <View className="space-y-3 mb-4">
                        <View className="flex-row items-center p-3 bg-purple-50 rounded-xl mb-2">
                            <View className="w-6 h-6 bg-[#6C5CE7] rounded-full items-center justify-center shadow-sm">
                                <Feather name="check" size={14} color="white" />
                            </View>
                            <Text className="flex-1 ml-3 text-sm line-through text-gray-500">Нарисовать пейзаж</Text>
                            <Text className="text-xs font-bold text-[#6C5CE7]">+50 XP</Text>
                        </View>
                        <View className="flex-row items-center p-3 bg-white border-2 border-purple-100 rounded-xl">
                            <View className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-sm" />
                            <Text className="flex-1 ml-3 text-sm font-medium text-gray-800">Сделать домашнее задание</Text>
                            <Text className="text-xs font-bold text-gray-400">+40 XP</Text>
                        </View>
                    </View>
                    <Pressable 
                        onPress={() => router.push("/(tabs)/youth/tasks" as any)}
                        className="w-full py-3 bg-purple-100 rounded-xl items-center mt-2"
                    >
                        <Text className="text-[#6C5CE7] font-bold">Все задания</Text>
                    </Pressable>
                </View>

                {/* Motivational Card */}
                <LinearGradient colors={["#6C5CE7", "#7E22CE"]} className="p-5 rounded-3xl shadow-lg">
                    <View className="flex-row items-start">
                        <MaterialCommunityIcons name="star-shooting" size={32} color="#FBBF24" />
                        <View className="flex-1 ml-3">
                            <Text className="font-bold text-white text-lg mb-1">Отличная работа! 🌟</Text>
                            <Text className="text-sm text-white/90">
                                Ты выполнил уже 15 заданий на этой неделе! Продолжай в том же духе!
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}
