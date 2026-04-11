import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Platform, Pressable, Image, Modal, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useParentData } from "../../../contexts/ParentDataContext";
import { Header } from "../../../components/ui/Header";

export default function ParentProfile() {
    const router = useRouter();
    const { parentProfile, childrenProfile: children } = useParentData();
    
    const [showEditModal, setShowEditModal] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [enrollmentsCount, setEnrollmentsCount] = useState(0);

    const [editForm, setEditForm] = useState({
        full_name: "",
        phone: "",
        age: "",
    });

    useEffect(() => {
        if (parentProfile && showEditModal) {
            setEditForm({
                full_name: parentProfile.firstName || "",
                phone: "",
                age: "",
            });
        }
    }, [parentProfile, showEditModal]);

    const handleSaveProfile = async () => {
        // Заглушка: Здесь должно быть обновление в стейте
        Alert.alert("Успешно", "Профиль обновлен");
        setShowEditModal(false);
    };

    const handleLogout = () => {
        Alert.alert("Выход", "Вы действительно хотите выйти?", [
            { text: "Отмена", style: "cancel" },
            { text: "Выйти", style: "destructive", onPress: () => router.replace("/(auth)") }
        ]);
    };

    const menuItems = [
        { icon: "user", label: "Редактировать профиль", action: () => setShowEditModal(true) },
        { icon: "bell", label: "Уведомления", action: () => setShowNotificationsModal(true) },
        { icon: "credit-card", label: "Способы оплаты", action: () => setShowPaymentModal(true) },
        { icon: "settings", label: "Настройки", action: () => setShowSettingsModal(true) },
    ];

    return (
        <View className="flex-1 bg-white">
            <LinearGradient 
                colors={["#6C5CE7", "#8B7FE8"]} 
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }} 
            />

            <Header title="Профиль" showBack={true} />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {/* Profile Info */}
                <View className="bg-white/95 p-8 rounded-3xl shadow-lg items-center mb-6">
                    <View className="w-28 h-28 rounded-full overflow-hidden mb-4 bg-gray-200 border-4 border-white/50 shadow-lg">
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1758687126864-96b61e1b3af0?w=200&h=200&fit=crop" }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 mb-1">
                        {parentProfile?.firstName || "Родитель"}
                    </Text>
                    <Text className="text-gray-500 mb-6">parent@example.com</Text>
                    
                    <View className="flex-row justify-center space-x-6">
                        <View className="items-center mr-6">
                            <LinearGradient 
                                colors={["#6C5CE7", "#8B7FE8"]} 
                                className="w-16 h-16 rounded-2xl items-center justify-center mb-2 shadow-md"
                            >
                                <Text className="text-2xl font-black text-white">{children.length}</Text>
                            </LinearGradient>
                            <Text className="text-xs text-gray-600 font-medium">Детей</Text>
                        </View>
                        <View className="items-center">
                            <LinearGradient 
                                colors={["#6C5CE7", "#8B7FE8"]} 
                                className="w-16 h-16 rounded-2xl items-center justify-center mb-2 shadow-md"
                            >
                                <Text className="text-2xl font-black text-white">{enrollmentsCount}</Text>
                            </LinearGradient>
                            <Text className="text-xs text-gray-600 font-medium">Записей</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="mb-6 space-y-3">
                    {menuItems.map((item, index) => (
                        <Pressable
                            key={index}
                            onPress={item.action}
                            className="w-full flex-row items-center p-5 bg-white/95 rounded-2xl shadow-lg mb-3"
                        >
                            <LinearGradient
                                colors={["#6C5CE7", "#8B7FE8"]}
                                className="w-14 h-14 rounded-2xl items-center justify-center shadow-md mr-4"
                            >
                                <Feather name={item.icon as any} size={24} color="#FFFFFF" />
                            </LinearGradient>
                            <Text className="flex-1 font-semibold text-gray-800 text-lg">{item.label}</Text>
                            <Feather name="chevron-right" size={24} color="#6C5CE7" />
                        </Pressable>
                    ))}
                </View>

                {/* Logout */}
                <Pressable
                    onPress={handleLogout}
                    className="w-full flex-row items-center justify-center space-x-3 p-5 bg-white/95 rounded-2xl shadow-lg mt-2"
                >
                    <Feather name="log-out" size={20} color="#DC2626" />
                    <Text className="text-red-600 font-semibold text-lg ml-2">Выйти</Text>
                </Pressable>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal visible={showEditModal} transparent animationType="slide">
                <View className="flex-1 bg-black/50 justify-end sm:justify-center p-4">
                    <View className="bg-white rounded-3xl w-full p-6 max-h-[80%]">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-2xl font-bold">Редактировать профиль</Text>
                            <Pressable onPress={() => setShowEditModal(false)}>
                                <Feather name="x" size={24} color="#6B7280" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="space-y-4 mb-6">
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Полное имя</Text>
                                    <TextInput
                                        value={editForm.full_name}
                                        onChangeText={(text) => setEditForm(prev => ({ ...prev, full_name: text }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        placeholder="Введите полное имя"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Возраст</Text>
                                    <TextInput
                                        value={editForm.age}
                                        onChangeText={(text) => setEditForm(prev => ({ ...prev, age: text }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        placeholder="Введите возраст"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Телефон</Text>
                                    <TextInput
                                        value={editForm.phone}
                                        onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        placeholder="+7 (999) 123-45-67"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>
                        </ScrollView>

                        <View className="flex-row space-x-3 pt-4">
                            <Pressable
                                onPress={() => setShowEditModal(false)}
                                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl items-center mr-2"
                            >
                                <Text className="font-semibold text-gray-700">Отмена</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleSaveProfile}
                                className="flex-1 px-6 py-4 rounded-xl items-center ml-2"
                            >
                                <LinearGradient
                                    colors={["#6C5CE7", "#8B7FE8"]}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 12 }}
                                />
                                <Text className="font-semibold text-white">Сохранить</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Placeholder Modals for Settings/Notifications */}
            <Modal visible={showNotificationsModal || showPaymentModal || showSettingsModal} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center p-4">
                    <View className="bg-white rounded-3xl w-full p-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-2xl font-bold">Уведомление</Text>
                            <Pressable onPress={() => { setShowNotificationsModal(false); setShowPaymentModal(false); setShowSettingsModal(false); }}>
                                <Feather name="x" size={24} color="#6B7280" />
                            </Pressable>
                        </View>
                        <Text className="text-gray-600">Этот раздел находится в разработке.</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
