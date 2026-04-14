import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../constants/theme";

export default function RoleSelect() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.authHorizontalPaddingDesktop
    : LAYOUT.authHorizontalPaddingMobile;

  const handleSelect = async (role: string, route: string) => {
    await AsyncStorage.setItem("user_role", role);
    router.push(route as any);
  };

  const roles = [
    {
      title: "Родитель",
      description: "Управление профилями детей, бронирование занятий",
      icon: "users" as const,
      IconComponent: Feather,
      role: "parent",
      route: "/profile/parent/create-profile",
      features: [
        "Отслеживание прогресса",
        "Связь с менторами",
        "Персональные рекомендации",
      ],
    },
    {
      title: "Ребенок (6-11 лет)",
      description: "Рисование, первые навыки и игры",
      icon: "smile" as const,
      IconComponent: Feather,
      role: "child",
      route: "/profile/youth/create-profile-child",
      features: ["Игровое обучение", "Первые достижения"],
    },
    {
      title: "Подросток (12-17 лет)",
      description: "Цели, навыки и общение с ментором",
      icon: "zap" as const,
      IconComponent: Feather,
      role: "youth",
      route: "/profile/youth/create-profile",
      features: ["Карта талантов", "Достижения и бейджи"],
    },
    {
      title: "Студент (18-20 лет)",
      description: "Профориентация и серьезный рост",
      icon: "book-open" as const,
      IconComponent: Feather,
      role: "young-adult",
      route: "/profile/youth/create-profile-young-adult",
      features: ["Профориентация", "Карьерные пути"],
    },
    {
      title: "Организация",
      description: "Управление клубами и учениками",
      icon: "briefcase" as const,
      IconComponent: Feather,
      role: "org",
      route: "/profile/organization/create-profile",
      features: ["Панель управления", "Аналитика"],
    },
    {
      title: "Ментор",
      description: "Создание планов развития и поддержка",
      icon: "user-check" as const,
      IconComponent: Feather,
      role: "mentor",
      route: "/profile/mentor/create-profile",
      features: ["Планы развития", "Трекинг прогресса"],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: isDesktop ? 24 : 0,
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: isDesktop ? 620 : undefined,
            }}
          >
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: horizontalPadding,
                paddingVertical: 8,
              }}
            >
              <Feather
                name="arrow-left"
                size={18}
                color={COLORS.mutedForeground}
              />
              <Text
                style={{
                  color: COLORS.mutedForeground,
                  marginLeft: 8,
                  fontSize: 14,
                }}
              >
                Назад
              </Text>
            </TouchableOpacity>

            {/* Header */}
            <MotiView
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 400 }}
              style={{ alignItems: "center", paddingVertical: 24 }}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                  ...SHADOWS.lg,
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "800", color: "white" }}
                >
                  UM
                </Text>
              </LinearGradient>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: COLORS.foreground,
                  marginBottom: 4,
                }}
              >
                Выберите роль
              </Text>
              <Text style={{ color: COLORS.mutedForeground, fontSize: 14 }}>
                Чтобы продолжить, укажите вашу роль
              </Text>
            </MotiView>

            {/* Roles List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: horizontalPadding,
                paddingBottom: 40,
                alignItems: "center",
              }}
            >
              <View style={{ width: isDesktop ? 520 : "100%" }}>
                {roles.map((item, index) => {
                  const IconComp = item.IconComponent as any;
                  return (
                    <MotiView
                      key={index}
                      from={{ opacity: 0, translateY: 20 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{ duration: 350, delay: index * 60 }}
                      style={{ marginBottom: 12 }}
                    >
                      <TouchableOpacity
                        onPress={() => handleSelect(item.role, item.route)}
                        activeOpacity={0.7}
                        style={{
                          padding: 20,
                          borderRadius: RADIUS.lg,
                          backgroundColor: COLORS.card,
                          borderWidth: 2,
                          borderColor: COLORS.border,
                          flexDirection: "row",
                          alignItems: "flex-start",
                          ...SHADOWS.md,
                        }}
                      >
                        {/* Icon */}
                        <LinearGradient
                          colors={[COLORS.primary, COLORS.secondary]}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 16,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 16,
                          }}
                        >
                          <IconComp name={item.icon} size={24} color="white" />
                        </LinearGradient>

                        {/* Content */}
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 16,
                              color: COLORS.foreground,
                              marginBottom: 4,
                            }}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              color: COLORS.mutedForeground,
                              lineHeight: 18,
                              marginBottom: 8,
                            }}
                          >
                            {item.description}
                          </Text>

                          {/* Feature dots */}
                          {item.features.map((feature, fi) => (
                            <View
                              key={fi}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 3,
                              }}
                            >
                              <View
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: 3,
                                  backgroundColor: COLORS.primary,
                                  marginRight: 8,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: COLORS.mutedForeground,
                                }}
                              >
                                {feature}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </TouchableOpacity>
                    </MotiView>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
