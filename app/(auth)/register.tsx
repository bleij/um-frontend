import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const router = useRouter();
    
    const [phoneNumber, setPhoneNumber] = useState("");
    const [smsCode, setSmsCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    
    const [firstName, setFirstName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formatPhone = (text: string) => {
        const cleaned = text.replace(/\D/g, "");
        setPhoneNumber(cleaned);
    };

    const handleAction = () => {
        if (!codeSent) {
            setCodeSent(true);
        } else if (!codeVerified) {
            setCodeVerified(true);
        } else {
            // mock logic: navigate to role selection
            router.push("/(auth)/role");
        }
    };

    const isButtonEnabled = () => {
        if (!codeSent) return phoneNumber.length >= 10;
        if (!codeVerified) return smsCode.length >= 4;
        return firstName && password && confirmPassword && (password === confirmPassword);
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
                        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                            {/* Back Button */}
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="px-6 py-2 flex-row items-center"
                            >
                                <Feather name="arrow-left" size={20} color="white" />
                                <Text className="text-white ml-2 font-medium">Назад</Text>
                            </TouchableOpacity>

                            {/* Title Section */}
                            <View className="px-6 py-4 items-center mb-4">
                                <Text className="text-6xl font-black text-white mb-4">UM</Text>
                                <Text className="text-2xl font-bold text-white mb-2">Создайте свой аккаунт</Text>
                                <Text className="text-white/80 text-sm text-center px-4">
                                    {!codeSent 
                                      ? "Введите номер телефона для регистрации" 
                                      : !codeVerified 
                                        ? "Введите код из СМС, отправленный на ваш номер" 
                                        : "Заполните данные для завершения регистрации"}
                                </Text>
                            </View>

                            {/* Form Section */}
                            <View className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8">
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                                    
                                    {/* Phone Number Input */}
                                    <View className="relative justify-center mb-4">
                                        <View className="absolute left-4 z-10">
                                            <Feather name="phone" size={20} color="#6C5CE7" />
                                        </View>
                                        <TextInput
                                            placeholder="+7 (999) 123-45-67"
                                            placeholderTextColor="#A5A5A5"
                                            value={phoneNumber}
                                            onChangeText={formatPhone}
                                            keyboardType="phone-pad"
                                            editable={!codeSent}
                                            className={`w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl text-base ${codeSent ? "opacity-60" : ""}`}
                                        />
                                    </View>

                                    {/* SMS Code (Animated In) */}
                                    {codeSent && !codeVerified && (
                                        <MotiView 
                                            from={{opacity: 0, translateY: 10}}
                                            animate={{opacity: 1, translateY: 0}}
                                            className="relative justify-center mb-4"
                                        >
                                            <TextInput
                                                placeholder="Введите код из СМС"
                                                placeholderTextColor="#A5A5A5"
                                                value={smsCode}
                                                onChangeText={setSmsCode}
                                                keyboardType="numeric"
                                                maxLength={6}
                                                className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl text-base text-center tracking-[10px] font-bold"
                                            />
                                            <TouchableOpacity 
                                                onPress={() => { setCodeSent(false); setSmsCode(""); }}
                                                className="mt-3 items-center"
                                            >
                                                <Text className="text-[#6C5CE7] font-semibold text-sm">Отправить код повторно</Text>
                                            </TouchableOpacity>
                                        </MotiView>
                                    )}

                                    {/* Post Verification Fields */}
                                    {codeVerified && (
                                        <MotiView 
                                            from={{opacity: 0, translateY: 10}}
                                            animate={{opacity: 1, translateY: 0}}
                                            className="space-y-4"
                                        >
                                            <View className="relative justify-center mb-4">
                                                <View className="absolute left-4 z-10">
                                                    <Feather name="user" size={20} color="#6C5CE7" />
                                                </View>
                                                <TextInput
                                                    placeholder="Введите имя"
                                                    placeholderTextColor="#A5A5A5"
                                                    value={firstName}
                                                    onChangeText={setFirstName}
                                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl text-base"
                                                />
                                            </View>

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

                                            <View className="relative justify-center mb-4">
                                                <View className="absolute left-4 z-10">
                                                    <Feather name="lock" size={20} color="#6C5CE7" />
                                                </View>
                                                <TextInput
                                                    placeholder="Подтвердите пароль"
                                                    placeholderTextColor="#A5A5A5"
                                                    value={confirmPassword}
                                                    onChangeText={setConfirmPassword}
                                                    secureTextEntry={!showConfirmPassword}
                                                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl text-base"
                                                />
                                                <TouchableOpacity 
                                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 z-10"
                                                >
                                                    <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6C5CE7" />
                                                </TouchableOpacity>
                                            </View>
                                        </MotiView>
                                    )}

                                    {/* Action Button */}
                                    <TouchableOpacity
                                        onPress={handleAction}
                                        disabled={!isButtonEnabled()}
                                        className={`w-full py-4 rounded-2xl items-center justify-center shadow-lg mt-4 mb-6 ${
                                            isButtonEnabled() ? 'bg-[#6C5CE7]' : 'bg-gray-300'
                                        }`}
                                    >
                                        <Text className={`text-lg font-semibold ${isButtonEnabled() ? 'text-white' : 'text-gray-500'}`}>
                                            {codeSent ? (codeVerified ? "Создать аккаунт" : "Подтвердить код") : "Получить СМС-код"}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Divider */}
                                    <View className="flex-row items-center justify-center mb-4">
                                        <View className="flex-1 h-px bg-gray-300" />
                                        <Text className="mx-3 text-gray-400 text-sm">зарегистрироваться через</Text>
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

                                    {/* Go to Login */}
                                    <View className="flex-row justify-center mt-6">
                                        <Text className="text-gray-600 text-sm">уже есть аккаунт? </Text>
                                        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                                            <Text className="text-[#6C5CE7] font-semibold text-sm">Войти</Text>
                                        </TouchableOpacity>
                                    </View>

                                </ScrollView>
                            </View>
                         </SafeAreaView>
                    </LinearGradient>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}