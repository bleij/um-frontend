import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Dimensions,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export default function RoleSelect() {
    const router = useRouter();

    const handleSelect = async (role: string, route: string) => {
        await AsyncStorage.setItem("user_role", role);
        router.push(route as any);
    };

    const roles = [
        {
            title: "Родитель",
            description: "Управление профилями детей, бронирование занятий",
            icon: "users",
            IconComponent: Feather,
            gradient: ["#6C5CE7", "#8B7FE8"],
            role: "parent",
            route: "/profile/parent/create-profile",
        },
        {
            title: "Ребенок (6-11 лет)",
            description: "Рисование, первые навыки и игры",
            icon: "baby-face-outline",
            IconComponent: MaterialCommunityIcons,
            gradient: ["#EC4899", "#DB2777"],
            role: "child",
            route: "/profile/youth/create-profile-child",
        },
        {
            title: "Подросток (12-17 лет)",
            description: "Цели, навыки и общение с ментором",
            icon: "zap",
            IconComponent: Feather,
            gradient: ["#3B82F6", "#2563EB"],
            role: "youth",
            route: "/profile/youth/create-profile",
        },
        {
            title: "Студент (18-20 лет)",
            description: "Профориентация и серьезный рост",
            icon: "school",
            IconComponent: MaterialCommunityIcons,
            gradient: ["#22C55E", "#16A34A"],
            role: "young-adult",
            route: "/profile/youth/create-profile-young-adult",
        },
        {
            title: "Организация",
            description: "Управление клубами и учениками",
            icon: "office-building-outline",
            IconComponent: MaterialCommunityIcons,
            gradient: ["#F97316", "#EA580C"],
            role: "org",
            route: "/profile/organization/create-profile",
        },
        {
            title: "Ментор",
            description: "Создание планов развития и поддержка",
            icon: "user-check",
            IconComponent: Feather,
            gradient: ["#14B8A6", "#0D9488"],
            role: "mentor",
            route: "/profile/mentor/create-profile",
        },
    ];

    return (
        <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                {/* Back Button */}
                <View className="px-6 py-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-row items-center space-x-2"
                    >
                        <Feather name="arrow-left" size={20} color="white" />
                        <Text className="text-white text-base font-medium ml-2">Назад</Text>
                    </TouchableOpacity>
                </View>

                {/* Header */}
                <MotiView
                    from={{opacity: 0, translateY: -10}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 400}}
                    className="px-6 py-8 items-center"
                >
                    <Text className="text-6xl font-black text-white mb-4">UM</Text>
                    <Text className="text-2xl font-bold text-white mb-2">Выберите роль</Text>
                    <Text className="text-white/80 text-sm">Чтобы продолжить, укажите вашу роль</Text>
                </MotiView>

                {/* Roles Section */}
                <View className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8">
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}>
                        <View style={{ width: IS_DESKTOP ? 400 : "100%" }} className="space-y-4">
                            {roles.map((item, index) => {
                                const IconComp = item.IconComponent as any;
                                return (
                                    <MotiView
                                        key={index}
                                        from={{opacity: 0, translateY: 20}}
                                        animate={{opacity: 1, translateY: 0}}
                                        transition={{duration: 350, delay: index * 80}}
                                        className="w-full mb-4"
                                    >
                                        <TouchableOpacity
                                            onPress={() => handleSelect(item.role, item.route)}
                                            className="w-full p-5 rounded-2xl bg-white shadow-sm flex-row items-center space-x-4 border border-gray-100"
                                        >
                                            <LinearGradient
                                                colors={item.gradient as [string, string]}
                                                className="w-16 h-16 rounded-2xl items-center justify-center shadow-md mr-4"
                                            >
                                                <IconComp name={item.icon} size={28} color="white" />
                                            </LinearGradient>
                                            <View className="flex-1">
                                                <Text className="font-semibold text-lg text-gray-900">{item.title}</Text>
                                                <Text className="text-sm text-gray-600 mt-1 mr-2">{item.description}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </MotiView>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}