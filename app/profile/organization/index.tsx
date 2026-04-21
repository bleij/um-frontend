import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
   Alert,
   Platform,
   Pressable,
   ScrollView,
   Text,
   useWindowDimensions,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";

export default function OrgProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : 20;

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      await logout();
      router.replace("/intro" as any);
    } else {
      Alert.alert("Выход", "Вы действительно хотите выйти?", [
        { text: "Отмена", style: "cancel" },
        {
          text: "Выйти",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/intro" as any);
          },
        },
      ]);
    }
  };

  const orgName = "Центр развития «Звёздочка»";
  const orgType = "Частная школа развития";

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={["#F89B29", "#FF0F7B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingBottom: 40,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <SafeAreaView edges={["top"]}>
          <View
            style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <View>
                <Text className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
                  Профиль организации
                </Text>
                <Text className="text-white text-2xl font-black">
                  {orgName}
                </Text>
              </View>
              <Pressable
                className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center border border-white/20"
                onPress={() =>
                  Alert.alert("Уведомления", "Нет новых уведомлений")
                }
              >
                <Feather name="bell" size={22} color="white" />
              </Pressable>
            </View>

            <View className="flex-row items-center gap-5">
              <View className="w-20 h-20 bg-white/30 rounded-[28px] items-center justify-center border border-white/30">
                <Text className="text-white text-3xl font-black">
                  {orgName.charAt(0)}
                </Text>
              </View>
              <View>
                <Text className="text-white font-bold text-lg mb-1">
                  {orgType}
                </Text>
                <View className="flex-row items-center gap-1.5 bg-white/20 self-start px-3 py-1 rounded-full border border-white/20">
                  <View className="w-2 h-2 rounded-full bg-green-400" />
                  <Text className="text-white text-[10px] font-black uppercase tracking-wider">
                    Верифицирован
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 24,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View className="flex-row gap-3 mb-8">
          <View
            style={SHADOWS.md}
            className="flex-1 bg-white p-5 rounded-[32px] border border-gray-100 items-center"
          >
            <View className="w-12 h-12 bg-orange-50 rounded-2xl items-center justify-center mb-2">
              <Feather name="book-open" size={20} color="#F59E0B" />
            </View>
            <Text className="text-xl font-black text-gray-900">12</Text>
            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Курсов
            </Text>
          </View>
          <View
            style={SHADOWS.md}
            className="flex-1 bg-white p-5 rounded-[32px] border border-gray-100 items-center"
          >
            <View className="w-12 h-12 bg-purple-50 rounded-2xl items-center justify-center mb-2">
              <Feather name="users" size={20} color="#8B5CF6" />
            </View>
            <Text className="text-xl font-black text-gray-900">124</Text>
            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Учеников
            </Text>
          </View>
          <View
            style={SHADOWS.md}
            className="flex-1 bg-white p-5 rounded-[32px] border border-gray-100 items-center"
          >
            <View className="w-12 h-12 bg-green-50 rounded-2xl items-center justify-center mb-2">
              <Feather name="star" size={20} color="#10B981" />
            </View>
            <Text className="text-xl font-black text-gray-900">4.9</Text>
            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Рейтинг
            </Text>
          </View>
        </View>

        {/* General Info Section */}
        <View className="mb-6">
          <Text className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">
            Настройки
          </Text>
          <View className="gap-3">
            {[
              {
                label: "Редактировать профиль",
                icon: "edit-3",
                color: "#6C5CE7",
                route: "/organization/profile/edit",
              },
              {
                label: "Платежные реквизиты",
                icon: "credit-card",
                color: "#F59E0B",
                route: "/organization/finance",
              },
              {
                label: "Документы и лицензии",
                icon: "file-text",
                color: "#10B981",
                route: "/organization/documents",
              },
              {
                label: "Настройки уведомлений",
                icon: "sliders",
                color: "#3B82F6",
                route: "/organization/settings/notifications",
              },
            ].map((item, idx) => (
              <Pressable
                key={idx}
                onPress={() =>
                  Alert.alert("В разработке", "Этот раздел скоро появится.")
                }
                style={SHADOWS.sm}
                className="bg-white p-5 rounded-[24px] flex-row items-center border border-gray-50"
              >
                <View
                  style={{ backgroundColor: `${item.color}15` }}
                  className="w-11 h-11 rounded-2xl items-center justify-center mr-4"
                >
                  <Feather
                    name={item.icon as any}
                    size={20}
                    color={item.color}
                  />
                </View>
                <Text className="flex-1 font-bold text-gray-700">
                  {item.label}
                </Text>
                <Feather name="chevron-right" size={20} color="#D1D5DB" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View className="mb-8">
          <Text className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">
            Поддержка
          </Text>
          <View className="gap-3">
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Поддержка",
                  "Свяжитесь с нами в Телеграм: @um_support",
                )
              }
              style={SHADOWS.sm}
              className="bg-white p-5 rounded-[24px] flex-row items-center border border-gray-50"
            >
              <View className="w-11 h-11 bg-blue-50 rounded-2xl items-center justify-center mr-4">
                <Feather name="help-circle" size={20} color="#3B82F6" />
              </View>
              <Text className="flex-1 font-bold text-gray-700">
                Помощь и база знаний
              </Text>
              <Feather name="external-link" size={16} color="#D1D5DB" />
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          className="bg-red-50 p-6 rounded-[32px] flex-row items-center justify-center gap-3 border border-red-100"
        >
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text className="text-[#EF4444] font-black text-lg">
            Выйти из аккаунта
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
