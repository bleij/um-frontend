import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function LoginScreen() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // mock logic: navigate to home
        router.push("/(tabs)/home");
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                    <StatusBar style="light" />
                    <LinearGradient
                        colors={["#6C5CE7", "#8B7FE8"]}
                        style={{ flex: 1 }}
                    >
                        {/* Header Spacer for Status Bar */}
                        <View className="w-full flex-row justify-between items-center px-6 pt-12 pb-4" />

                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="px-6 py-2 flex-row items-center"
                        >
                            <Feather name="arrow-left" size={20} color="white" />
                            <Text className="text-white ml-2 font-medium">Назад</Text>
                        </TouchableOpacity>

                        {/* Title Section */}
                        <View className="px-6 py-8 items-center">
                            <Text className="text-6xl font-black text-white mb-4">UM</Text>
                            <Text className="text-2xl font-bold text-white mb-2">Войти в аккаунт</Text>
                            <Text className="text-white/80 text-sm text-center">
                                Добро пожаловать!{"\n"}Продолжим твой путь к успеху
                            </Text>
                        </View>

                        {/* Form Section */}
                        <View className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8">
                            
                            {/* Email Input */}
                            <View className="relative justify-center mb-4">
                                <View className="absolute left-4 z-10">
                                    <Feather name="mail" size={20} color="#6C5CE7" />
                                </View>
                                <TextInput
                                    placeholder="Введите email"
                                    placeholderTextColor="#A5A5A5"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl text-base"
                                />
                            </View>

                            {/* Password Input */}
                            <View className="relative justify-center mb-4">
                                <View className="absolute left-4 z-10">
                                    <Feather name="lock" size={20} color="#6C5CE7" />
                                </View>
                                <TextInput
                                    placeholder="Введите пароль"
                                    placeholderTextColor="#A5A5A5"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl text-base"
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 z-10"
                                >
                                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6C5CE7" />
                                </TouchableOpacity>
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity className="items-end mb-6">
                                <Text className="text-[#6C5CE7] text-sm font-medium">
                                    Забыли пароль?
                                </Text>
                            </TouchableOpacity>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                className={`w-full py-4 rounded-2xl items-center justify-center shadow-lg mb-6 ${
                                    email && password ? 'bg-[#6C5CE7]' : 'bg-gray-300'
                                }`}
                                disabled={!email || !password}
                            >
                                <Text className={`text-lg font-semibold ${email && password ? 'text-white' : 'text-gray-500'}`}>
                                    Войти
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View className="flex-row items-center justify-center mb-4">
                                <View className="flex-1 h-px bg-gray-300" />
                                <Text className="mx-3 text-gray-400 text-sm">или войти через</Text>
                                <View className="flex-1 h-px bg-gray-300" />
                            </View>

                            {/* Social Icons (mock) */}
                            <View className="flex-row justify-center space-x-6 items-center">
                                <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-md">
                                    <Feather name="github" size={24} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-md ml-4 mr-4">
                                    <Text className="text-2xl font-bold text-[#ea4335]">G</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-md">
                                    <Feather name="twitter" size={24} color="#1DA1F2" />
                                </TouchableOpacity>
                            </View>

                            {/* Go to Register */}
                            <View className="flex-row justify-center mt-6">
                                <Text className="text-gray-600 text-sm">нет аккаунта? </Text>
                                <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                                    <Text className="text-[#6C5CE7] font-semibold text-sm">Зарегистрироваться</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </LinearGradient>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}