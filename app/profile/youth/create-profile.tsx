import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateProfileTeen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "male",
        otherInterest: "",
        goals: "",
    });
    const [interests, setInterests] = useState<string[]>([]);
    
    const availableInterests = [
        "Рисование", "Музыка", "Спорт", "Программ...",
        "Фото/Видео", "Чтение", "Танцы", "Дизайн"
    ];

    const toggleInterest = (interest: string) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter((i) => i !== interest));
        } else {
            setInterests([...interests, interest]);
        }
    };

    const addOtherInterest = () => {
        if (formData.otherInterest.trim() !== "") {
            setInterests([...interests, formData.otherInterest.trim()]);
            setFormData({ ...formData, otherInterest: "" });
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <LinearGradient colors={["#DBEAFE", "#FAF5FF"]} style={{ flex: 1 }}>
                
                {/* Header */}
                <LinearGradient colors={["#3B82F6", "#2563EB"]} className="pt-12 pb-4 px-4 shadow-sm z-10 rounded-b-3xl">
                    <SafeAreaView edges={["top"]} style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-white">Создать профиль подростка</Text>
                    </SafeAreaView>
                </LinearGradient>

                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                    
                    {/* Personal Info */}
                    <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                        <View className="flex-row items-center mb-4">
                            <Feather name="user" size={20} color="#2563EB" />
                            <Text className="text-lg font-semibold text-gray-900 ml-2">Личная информация</Text>
                        </View>

                        <View className="space-y-4">
                            <View>
                                <Text className="text-sm font-medium text-gray-700 mb-1">Имя</Text>
                                <TextInput
                                    value={formData.firstName}
                                    onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                                    placeholder="Введите имя"
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                                />
                            </View>
                            <View>
                                <Text className="text-sm font-medium text-gray-700 mb-1">Фамилия</Text>
                                <TextInput
                                    value={formData.lastName}
                                    onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                                    placeholder="Введите фамилию"
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                                />
                            </View>

                            <View className="flex-row justify-between">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-medium text-gray-700 mb-1">Возраст</Text>
                                    <TextInput
                                        value={formData.age}
                                        onChangeText={(text) => setFormData({ ...formData, age: text })}
                                        placeholder="14"
                                        keyboardType="numeric"
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-center"
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-sm font-medium text-gray-700 mb-1">Пол</Text>
                                    <View className="flex-row rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-12">
                                        <TouchableOpacity 
                                            onPress={() => setFormData({ ...formData, gender: "male" })}
                                            className={`flex-1 justify-center items-center ${formData.gender === "male" ? "bg-blue-500" : ""}`}
                                        >
                                            <Text className={formData.gender === "male" ? "text-white font-medium" : "text-gray-500"}>М</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => setFormData({ ...formData, gender: "female" })}
                                            className={`flex-1 justify-center items-center ${formData.gender === "female" ? "bg-pink-500" : ""}`}
                                        >
                                            <Text className={formData.gender === "female" ? "text-white font-medium" : "text-gray-500"}>Ж</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Interests */}
                    <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                        <View className="flex-row items-center mb-4">
                            <MaterialCommunityIcons name="star-four-points-outline" size={20} color="#2563EB" />
                            <Text className="text-lg font-semibold text-gray-900 ml-2">Интересы</Text>
                        </View>

                        <Text className="text-sm font-medium text-gray-700 mb-3">Что вам интересно?</Text>
                        
                        <View className="flex-row flex-wrap justify-between">
                            {availableInterests.map((interest) => {
                                const isSelected = interests.includes(interest);
                                return (
                                    <TouchableOpacity
                                        key={interest}
                                        onPress={() => toggleInterest(interest)}
                                        className={`w-[48%] py-3 px-2 rounded-xl border-2 mb-3 items-center ${
                                            isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"
                                        }`}
                                    >
                                        <Text className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-600"}`}>
                                            {interest}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Custom Interest */}
                        <Text className="text-sm font-medium text-gray-700 mb-2 mt-2">Другое:</Text>
                        <View className="flex-row">
                            <TextInput
                                value={formData.otherInterest}
                                onChangeText={(text) => setFormData({ ...formData, otherInterest: text })}
                                placeholder="Введите свой интерес"
                                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                            />
                            <TouchableOpacity 
                                onPress={addOtherInterest}
                                className="ml-3 w-12 h-12 bg-blue-500 rounded-xl items-center justify-center shadow-sm"
                            >
                                <Feather name="plus" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Selected Custom Interests */}
                        <View className="flex-row flex-wrap mt-3 gap-2">
                            {interests.filter(i => !availableInterests.includes(i)).map((interest) => (
                                <View key={interest} className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2">
                                    <Text className="text-blue-800 text-sm mr-2">{interest}</Text>
                                    <TouchableOpacity onPress={() => toggleInterest(interest)}>
                                        <Feather name="x" size={14} color="#1E40AF" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Goals */}
                    <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                        <View className="flex-row items-center mb-4">
                            <Feather name="target" size={20} color="#2563EB" />
                            <Text className="text-lg font-semibold text-gray-900 ml-2">Цели</Text>
                        </View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">Чего вы хотите достичь?</Text>
                        <TextInput
                            value={formData.goals}
                            onChangeText={(text) => setFormData({ ...formData, goals: text })}
                            placeholder="Опишите свои цели и стремления"
                            multiline
                            numberOfLines={4}
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 h-24"
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push("/profile/youth/testing")}
                        className="w-full rounded-xl overflow-hidden shadow-md mt-2"
                    >
                        <LinearGradient colors={["#3B82F6", "#2563EB"]} className="w-full py-4 items-center justify-center">
                            <Text className="text-white font-bold text-lg">Перейти к тестам</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}