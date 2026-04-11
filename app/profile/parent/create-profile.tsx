import React, { useState, useMemo } from "react";
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
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type AgeGroup = "6-11" | "12-17" | "18-20";

type Child = {
    id: string;
    name: string;
    ageGroup: AgeGroup | null;
};

const AGE_OPTIONS: { label: string; value: AgeGroup }[] = [
    { label: "Ребенок (6-11)", value: "6-11" },
    { label: "Подросток (12-17)", value: "12-17" },
    { label: "Студент (18-20)", value: "18-20" },
];

function makeId() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function CreateProfileParent() {
    const router = useRouter();

    const [parentData, setParentData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
    });

    const [children, setChildren] = useState<Child[]>([
        { id: makeId(), name: "", ageGroup: null },
    ]);

    const canContinue = useMemo(() => {
        const hasParent = parentData.firstName.trim().length > 0;
        const hasValidChild = children.some(
            (c) => c.name.trim().length > 0 && !!c.ageGroup
        );
        return hasParent && hasValidChild;
    }, [parentData, children]);

    function addChild() {
        setChildren((prev) => [...prev, { id: makeId(), name: "", ageGroup: null }]);
    }

    function removeChild(id: string) {
        setChildren((prev) => {
            const next = prev.filter((c) => c.id !== id);
            return next.length === 0 ? [{ id: makeId(), name: "", ageGroup: null }] : next;
        });
    }

    function updateChild(id: string, patch: Partial<Child>) {
        setChildren((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    }

    const handleMockSubmit = () => {
        router.push("/profile/parent/create-child-profile");
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <LinearGradient colors={["#EDE9FE", "#F5F3FF"]} style={{ flex: 1 }}>
                
                {/* Header */}
                <LinearGradient colors={["#8B5CF6", "#7C3AED"]} className="pt-12 pb-4 px-4 shadow-sm z-10 rounded-b-3xl">
                    <SafeAreaView edges={["top"]} style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-white">Создать профиль родителя</Text>
                    </SafeAreaView>
                </LinearGradient>

                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                    
                    {/* Personal Info */}
                    <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                        <View className="flex-row items-center mb-4">
                            <Feather name="user" size={20} color="#7C3AED" />
                            <Text className="text-lg font-semibold text-gray-900 ml-2">Ваши данные</Text>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="flex-1 mr-2">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Имя</Text>
                                <TextInput
                                    value={parentData.firstName}
                                    onChangeText={(text) => setParentData({ ...parentData, firstName: text })}
                                    placeholder="Имя"
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                                />
                            </View>
                            <View className="flex-1 ml-2">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Фамилия</Text>
                                <TextInput
                                    value={parentData.lastName}
                                    onChangeText={(text) => setParentData({ ...parentData, lastName: text })}
                                    placeholder="Фамилия"
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                                />
                            </View>
                        </View>
                        
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-1">Телефон</Text>
                            <TextInput
                                value={parentData.phone}
                                onChangeText={(text) => setParentData({ ...parentData, phone: text })}
                                placeholder="+7 (___) ___-__-__"
                                keyboardType="phone-pad"
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                            />
                        </View>
                    </View>

                    {/* Children Section */}
                    <View className="flex-row justify-between items-center mb-4 px-2">
                        <Text className="text-xl font-bold text-gray-900">Дети</Text>
                        <TouchableOpacity
                            onPress={addChild}
                            className="bg-[#EDE9FE] px-4 py-2 rounded-xl flex-row items-center"
                        >
                            <Feather name="plus" size={16} color="#7C3AED" />
                            <Text className="text-[#7C3AED] font-semibold ml-1">Добавить</Text>
                        </TouchableOpacity>
                    </View>

                    {children.map((child, index) => (
                        <View key={child.id} className="bg-white rounded-2xl p-6 shadow-sm mb-4 border border-gray-100">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-[#7C3AED] font-bold text-base">Ребенок {index + 1}</Text>
                                {children.length > 1 && (
                                    <TouchableOpacity onPress={() => removeChild(child.id)}>
                                        <Feather name="trash-2" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Имя ребенка</Text>
                                <TextInput
                                    value={child.name}
                                    onChangeText={(text) => updateChild(child.id, { name: text })}
                                    placeholder="Например, Анна"
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                                />
                            </View>

                            <Text className="text-sm font-medium text-gray-700 mb-2">Возрастная категория</Text>
                            <View className="space-y-2">
                                {AGE_OPTIONS.map((opt) => {
                                    const active = child.ageGroup === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => updateChild(child.id, { ageGroup: opt.value })}
                                            className={`p-3 rounded-xl border-2 flex-row items-center justify-between mb-2 ${
                                                active ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50"
                                            }`}
                                        >
                                            <Text className={`font-semibold ${active ? "text-purple-700" : "text-gray-600"}`}>
                                                {opt.label}
                                            </Text>
                                            {active && <Feather name="check-circle" size={20} color="#9333EA" />}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity
                        onPress={handleMockSubmit}
                        disabled={!canContinue}
                        className="w-full rounded-xl overflow-hidden shadow-md mt-4"
                    >
                        <LinearGradient 
                            colors={canContinue ? ["#8B5CF6", "#7C3AED"] : ["#D1D5DB", "#9CA3AF"]} 
                            className="w-full py-4 items-center justify-center"
                        >
                            <Text className="text-white font-bold text-lg">Продолжить</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}