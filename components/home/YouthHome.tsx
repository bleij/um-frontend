import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
   Modal,
   Platform,
   Pressable,
   ScrollView,
   Text,
   TouchableOpacity,
   useWindowDimensions,
   View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   COLORS,
   LAYOUT,
   RADIUS,
   SHADOWS,
   TYPOGRAPHY
} from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

const SKILLS = [
  { label: "Коммуникация", value: 78, color: "#6C5CE7" },
  { label: "Креативность", value: 85, color: "#A78BFA" },
  { label: "Логика", value: 80, color: "#3B82F6" },
  { label: "Дисциплина", value: 72, color: "#10B981" },
];


import { useParentData } from "../../contexts/ParentDataContext";
import { courses } from "../../data/courses";
import { useStudentTasks, useYouthAchievements } from "../../hooks/useStudentData";

export default function YouthHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { childrenProfile, activeChildId, parentProfile } = useParentData();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : 20;

  // Find active child data (relevant for all roles: parent, youth, etc.)
  const activeChild =
    childrenProfile.find((c) => c.id === activeChildId) || childrenProfile[0];
  const firstName = activeChild?.name || user?.firstName || "Максим";
  const diagnostic = activeChild?.talentProfile;

  const currentSkills = diagnostic
    ? [
        {
          label: "Коммуникация",
          value: diagnostic.scores.social,
          color: "#6C5CE7",
        },
        {
          label: "Креативность",
          value: diagnostic.scores.creative,
          color: "#A78BFA",
        },
        { label: "Логика", value: diagnostic.scores.logical, color: "#3B82F6" },
        {
          label: "Дисциплина",
          value: diagnostic.scores.physical,
          color: "#10B981",
        },
        {
          label: "Лингвистика",
          value: diagnostic.scores.linguistic,
          color: "#EC4899",
        },
      ]
    : [
        { label: "Коммуникация", value: 78, color: "#6C5CE7" },
        { label: "Креативность", value: 85, color: "#A78BFA" },
        { label: "Логика", value: 80, color: "#3B82F6" },
        { label: "Дисциплина", value: 72, color: "#10B981" },
      ];

  const { tasks, toggleTask } = useStudentTasks();
  const { achievements } = useYouthAchievements();

  // Mock roles and features
  const isIndependent = true; // "Подросток сам принимает решения"
  const isPro = parentProfile?.tariff === "pro"; // PRO тариф
  const [passVisible, setPassVisible] = useState(false);

  // QR payload: stable string per user
  const qrValue = `um:pass:${user?.id ?? "guest"}:${user?.firstName ?? ""}`;

  const quickActions = [
    { label: "Мой пропуск", icon: "maximize", color: "#EC4899", route: "#qr" },
    {
      label: "Календарь",
      icon: "calendar",
      color: "#3B82F6",
      route: "/(tabs)/parent/calendar",
    },
  ];
  if (isIndependent) {
    quickActions.push({
      label: "Ментор",
      icon: "message-circle",
      color: "#10B981",
      route: "/(tabs)/chats",
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header - Restored Violet Aesthetic */}
      <View style={{ backgroundColor: COLORS.primary, overflow: "hidden" }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingTop: Platform.OS === "ios" ? 0 : 20 }}
        >
          <SafeAreaView edges={["top"]}>
            <View
              style={{
                paddingHorizontal: horizontalPadding,
                paddingTop: 12,
                paddingBottom: 32,
              }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.size.xxxl,
                      fontWeight: TYPOGRAPHY.weight.semibold,
                      color: COLORS.white,
                      letterSpacing: TYPOGRAPHY.letterSpacing.tight,
                    }}
                  >
                    Привет, {firstName}!
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 13,
                      fontWeight: "600",
                      marginTop: 2,
                    }}
                  >
                    {diagnostic?.recommendedConstellation || "Level 8"} •{" "}
                    {diagnostic ? "Диагностика пройдена" : "2450 XP"}
                  </Text>
                </View>
                <Pressable className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                  <View className="w-full h-full bg-white/20 items-center justify-center">
                    <Feather name="user" size={20} color="white" />
                  </View>
                </Pressable>
              </View>

              <View className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white text-xs font-bold">
                    Прогресс талантов
                  </Text>
                  <Text className="text-white text-xs font-black">
                    {diagnostic ? "100%" : "45%"}
                  </Text>
                </View>
                <View className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <View
                    style={{ width: diagnostic ? "100%" : "45%" }}
                    className="h-full bg-white rounded-full"
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row gap-3 mb-8">
          {quickActions.map((action, idx) => (
            <Pressable
              key={idx}
              onPress={() =>
                action.route === "#qr"
                  ? setPassVisible(true)
                  : router.push(action.route as any)
              }
              style={SHADOWS.sm}
              className="flex-1 bg-white p-4 rounded-3xl border border-gray-50 items-center transition-all active:scale-95"
            >
              <View
                style={{ backgroundColor: action.color + "15" }}
                className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
              >
                <Feather
                  name={action.icon as any}
                  size={22}
                  color={action.color}
                />
              </View>
              <Text className="text-[10px] font-black text-gray-800 uppercase text-center">
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* AI Assistant Insight (BASIC) or Mentor Insight (PRO) */}
        <View className="mb-8">
          {isPro ? (
            <View
              style={SHADOWS.md}
              className="bg-purple-50 p-6 rounded-[32px] border border-purple-100 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-purple-200 shadow-sm">
                <Feather name="message-square" size={24} color="#6C5CE7" />
              </View>
              <View className="flex-1">
                <Text className="text-purple-900 font-black text-sm mb-1 uppercase tracking-tight">
                  Твой наставник говорит:
                </Text>
                <Text className="text-purple-700 text-xs leading-4">
                  «Привет! Твой прогресс впечатляет. Я добавил пару заданий на
                  развитие лидерства. Посмотрим?»
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={SHADOWS.sm}
              className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-blue-200 shadow-sm">
                <Feather name="cpu" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-blue-900 font-extrabold text-sm mb-1 uppercase">
                  AI Ассистент UM:
                </Text>
                <Text className="text-blue-700 text-xs leading-4">
                  Я проанализировал твой тест. У тебя высокий потенциал в{" "}
                  {currentSkills[1].label}. Хочешь знать больше?
                </Text>
                <Pressable
                  onPress={() => router.push("/parent/subscription" as any)}
                  className="mt-3"
                >
                  <Text className="text-blue-600 font-black text-[10px] uppercase underline">
                    открыть про аналитику
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Upcoming tasks hint */}
        {tasks.length > 0 && (
          <View
            className="mb-8 p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex-row items-center justify-between"
            style={SHADOWS.sm}
          >
            <View className="flex-1 mr-4">
              <Text className="text-xs font-bold text-blue-500 uppercase mb-1">
                Следующее задание
              </Text>
              <Text className="text-lg font-black text-blue-900 mb-1" numberOfLines={1}>
                {tasks.find((t) => !t.done)?.title ?? tasks[0].title}
              </Text>
              <Text className="text-sm font-semibold text-blue-700">
                +{tasks.find((t) => !t.done)?.xp_reward ?? tasks[0].xp_reward} XP
              </Text>
            </View>
            <View className="w-12 h-12 rounded-2xl bg-blue-500 items-center justify-center">
              <Feather name="target" size={24} color="white" />
            </View>
          </View>
        )}

        {/* Skills Section */}
        <View
          style={SHADOWS.sm}
          className="bg-white rounded-[32px] p-6 mb-8 border border-gray-100"
        >
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-2">
              <Feather name="trending-up" size={18} color={COLORS.primary} />
              <Text className="text-lg font-bold text-gray-900">
                Мои результаты
              </Text>
            </View>
            {diagnostic && (
              <Pressable
                onPress={() => router.push("/profile/youth/results" as any)}
              >
                <Text className="text-primary font-bold text-xs">
                  Все детали
                </Text>
              </Pressable>
            )}
          </View>

          <View className="gap-5">
            {currentSkills.map((skill) => (
              <View key={skill.label}>
                <View className="flex-row justify-between mb-1.5">
                  <Text className="text-xs font-bold text-gray-600">
                    {skill.label}
                  </Text>
                  <Text className="text-xs font-black text-primary">
                    {skill.value}%
                  </Text>
                </View>
                <View className="h-2 bg-gray-50 rounded-full overflow-hidden">
                  <View
                    style={{
                      width: `${skill.value}%`,
                      backgroundColor: skill.color,
                    }}
                    className="h-full rounded-full"
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Big Testing Status */}
          <View className="mt-6 pt-6 border-t border-gray-100">
            {isPro ? (
              <Pressable
                onPress={() => router.push("/profile/youth/testing" as any)}
                className="bg-purple-600 p-4 rounded-2xl items-center flex-row justify-center gap-2"
              >
                <Feather name="zap" size={18} color="white" />
                <Text className="text-white font-bold">
                  Пройти Большое Исследование
                </Text>
              </Pressable>
            ) : (
              <View className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <View className="flex-row items-center gap-2 mb-2">
                  <Feather
                    name="lock"
                    size={16}
                    color={COLORS.mutedForeground}
                  />
                  <Text className="font-bold text-gray-600 text-xs uppercase">
                    Только в PRO
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 font-medium mb-3">
                  Хочешь узнать свою суперсилу и скрытые таланты? Попроси
                  родителей активировать PRO-доступ!
                </Text>
                <Pressable className="bg-white py-2 px-4 rounded-xl self-start border border-gray-200">
                  <Text className="text-gray-700 font-bold text-xs">
                    Подробнее о PRO
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* AI Recommendations */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4 px-1">
            Рекомендации от ИИ
          </Text>
          <Text className="text-xs text-gray-400 font-medium mb-4 px-1">
            Тебе может быть интересно
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-1 px-1 overflow-visible"
          >
            {courses.slice(0, 3).map((rec, idx) => (
              <View
                key={rec.id}
                style={SHADOWS.sm}
                className="w-64 bg-white rounded-[32px] overflow-hidden border border-gray-50 mr-4 pb-4"
              >
                <View className="h-32 bg-purple-50 items-center justify-center">
                  <Feather name="cpu" size={32} color="#A78BFA" />
                </View>
                <View className="p-4">
                  <Text className="font-bold text-gray-900 mb-1">
                    {rec.title}
                  </Text>
                  <Text
                    className="text-xs text-gray-400 mb-3"
                    numberOfLines={2}
                  >
                    {rec.description}
                  </Text>
                  <Pressable className="bg-purple-100 py-3 rounded-xl items-center">
                    <Text className="text-purple-600 font-bold text-xs uppercase">
                      {isIndependent ? "Записаться" : "Хочу сюда"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* SESSION REQUEST (System Call Widget) */}
        {isPro && (
          <View className="mb-8">
            <View className="flex-row items-center gap-2 mb-4 px-1">
              <Feather name="video" size={20} color="#F59E0B" />
              <Text className="text-lg font-bold text-gray-900">
                Встреча с ментором
              </Text>
            </View>
            <View
              style={SHADOWS.sm}
              className="bg-white rounded-[24px] p-5 border border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-1 pr-4">
                <Text className="font-bold text-gray-900 mb-1">
                  Раз в месяц
                </Text>
                <Text className="text-xs text-gray-500 mb-3" leading-4>
                  Обсудите результаты тестирования и план развития на звонке.
                </Text>
                <TouchableOpacity className="bg-amber-50 py-2.5 px-4 rounded-xl self-start">
                  <Text className="text-amber-700 font-bold text-xs uppercase">
                    Записаться
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-16 h-16 bg-amber-50 rounded-2xl items-center justify-center border border-amber-100">
                <Feather name="calendar" size={24} color="#D97706" />
              </View>
            </View>
          </View>
        )}

        {/* Mentor Tasks */}
        {isPro && (
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4 px-1">
              Задания от ментора
            </Text>
            <View className="gap-3">
              {tasks.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleTask(item.id)}
                  style={SHADOWS.sm}
                  className={`p-4 rounded-2xl flex-row items-center gap-4 border ${item.done ? "bg-green-50 border-green-100" : "bg-white border-gray-50"}`}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      borderWidth: item.done ? 0 : 2,
                      borderColor: COLORS.mutedForeground,
                      backgroundColor: item.done
                        ? COLORS.success
                        : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.done && (
                      <Feather name="check" size={14} color="white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.md,
                        fontWeight: TYPOGRAPHY.weight.bold,
                        color: item.done ? COLORS.success : COLORS.foreground,
                        textDecorationLine: item.done ? "line-through" : "none",
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <View
                    className={`px-2 py-1 rounded-md ${item.done ? "bg-green-200" : "bg-yellow-100"}`}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: TYPOGRAPHY.weight.bold,
                        color: item.done ? "#166534" : "#854D0E",
                      }}
                    >
                      +{item.xp_reward} XP
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Achievements */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4 px-1">
            Твои ачивки
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-1 px-1 overflow-visible"
          >
            {achievements.map((ach) => (
              <View
                key={ach.id}
                style={{ ...SHADOWS.sm, opacity: ach.unlocked ? 1 : 0.5 }}
                className="w-32 bg-white p-4 rounded-[24px] border border-gray-50 mr-4 items-center"
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: RADIUS.full,
                    backgroundColor: ach.unlocked ? COLORS.primary + "15" : COLORS.muted,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Feather
                    name={ach.unlocked ? (ach.icon_name as any) : "lock"}
                    size={24}
                    color={ach.unlocked ? COLORS.primary : COLORS.mutedForeground}
                  />
                </View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.sm,
                    fontWeight: TYPOGRAPHY.weight.bold,
                    color: COLORS.foreground,
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  {ach.name}
                </Text>
                <Text style={{ fontSize: 10, color: COLORS.mutedForeground, textAlign: "center" }}>
                  {ach.description ?? ""}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* ── Мой пропуск modal ── */}
      <Modal
        visible={passVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPassVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setPassVisible(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: 32,
              padding: 32,
              alignItems: "center",
              width: 300,
              ...SHADOWS.lg,
            }}
          >
            <LinearGradient
              colors={[COLORS.primary, "#A78BFA"]}
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Feather name="maximize" size={30} color="white" />
            </LinearGradient>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: COLORS.foreground,
                marginBottom: 4,
              }}
            >
              Мой пропуск
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.mutedForeground,
                marginBottom: 24,
              }}
            >
              {[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                "Пользователь"}
            </Text>

            <View
              style={{
                padding: 16,
                backgroundColor: "#F9FAFB",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginBottom: 20,
              }}
            >
              <QRCode
                value={qrValue}
                size={180}
                color={COLORS.foreground}
                backgroundColor="#F9FAFB"
              />
            </View>

            <Text
              style={{
                fontSize: 11,
                color: COLORS.mutedForeground,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Покажите QR куратору или на входе в секцию
            </Text>

            <TouchableOpacity
              onPress={() => setPassVisible(false)}
              style={{
                paddingHorizontal: 32,
                paddingVertical: 12,
                borderRadius: RADIUS.full,
                backgroundColor: COLORS.primary,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Закрыть</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
