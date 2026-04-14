import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS } from "../../../constants/theme";

const MOCK_TASKS = [
  {
    id: "1",
    title: "Нарисовать пейзаж",
    club: "Художественная студия",
    clubId: "art",
    assignedTo: "Все ученики",
    dueDate: "28 фев 2026",
    xp: 50,
    completed: 12,
    total: 18,
  },
  {
    id: "2",
    title: "Техника ведения мяча",
    club: "Футбол",
    clubId: "football",
    assignedTo: "Все ученики",
    dueDate: "1 мар 2026",
    xp: 45,
    completed: 18,
    total: 24,
  },
  {
    id: "3",
    title: "Создать простую программу",
    club: "Программирование",
    clubId: "coding",
    assignedTo: "Все ученики",
    dueDate: "2 мар 2026",
    xp: 60,
    completed: 8,
    total: 15,
  },
];

const CLUBS = [
  { id: "all", name: "Все кружки" },
  { id: "art", name: "Художественная студия" },
  { id: "football", name: "Футбол" },
  { id: "coding", name: "Программирование" },
];

export default function OrgTasks() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : 20;
  const [selectedClub, setSelectedClub] = useState("all");

  const filtered =
    selectedClub === "all"
      ? MOCK_TASKS
      : MOCK_TASKS.filter((t) => t.clubId === selectedClub);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={[COLORS.gradientFrom, COLORS.gradientTo]}
        style={{
          paddingBottom: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <SafeAreaView edges={["top"]}>
          <View
            style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Pressable
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Feather name="arrow-left" size={20} color="white" />
              </Pressable>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: "white",
                  flex: 1,
                }}
              >
                Задания
              </Text>
              <Pressable
                onPress={() => router.push("/organization/task/create" as any)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingHorizontal: 16,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "700", fontSize: 13 }}
                >
                  + Создать
                </Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CLUBS.map((club) => (
                <Pressable
                  key={club.id}
                  onPress={() => setSelectedClub(club.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 16,
                    marginRight: 8,
                    backgroundColor:
                      selectedClub === club.id
                        ? "white"
                        : "rgba(255,255,255,0.15)",
                    borderWidth: 1,
                    borderColor:
                      selectedClub === club.id
                        ? "white"
                        : "rgba(255,255,255,0.2)",
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedClub === club.id ? COLORS.primary : "white",
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {club.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((task) => {
          const percent = Math.round((task.completed / task.total) * 100);
          return (
            <Pressable
              key={task.id}
              style={SHADOWS.md}
              className="bg-white rounded-[32px] p-6 mb-6 border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 mb-1">
                    {task.title}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Feather
                      name="book-open"
                      size={12}
                      color={COLORS.mutedForeground}
                    />
                    <Text className="text-xs text-gray-400 font-semibold">
                      {task.club}
                    </Text>
                  </View>
                </View>
                <View className="bg-purple-50 px-3 py-1.5 rounded-xl">
                  <Text className="text-primary font-black text-xs">
                    +{task.xp} XP
                  </Text>
                </View>
              </View>

              <View className="bg-gray-50/50 rounded-2xl p-4 mb-6">
                <View className="flex-row justify-between mb-3">
                  <View className="flex-row items-center gap-2">
                    <Feather name="users" size={12} color="#9CA3AF" />
                    <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Кому
                    </Text>
                  </View>
                  <Text className="text-xs font-bold text-gray-700">
                    {task.assignedTo}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <View className="flex-row items-center gap-2">
                    <Feather name="clock" size={12} color="#9CA3AF" />
                    <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Срок
                    </Text>
                  </View>
                  <Text className="text-xs font-bold text-gray-700">
                    {task.dueDate}
                  </Text>
                </View>
              </View>

              <View className="mb-6">
                <View className="flex-row justify-between items-end mb-2.5">
                  <Text className="text-xs font-bold text-gray-900">
                    Прогресс выполнения
                  </Text>
                  <Text className="text-xs font-black text-primary">
                    {task.completed}/{task.total}
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    style={{ width: `${percent}%` }}
                    className="h-full bg-primary"
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <Pressable className="flex-1 h-12 bg-primary/10 rounded-2xl items-center justify-center">
                  <Text className="text-primary font-bold text-sm">
                    Подробнее
                  </Text>
                </Pressable>
                <Pressable className="w-12 h-12 bg-red-50 rounded-2xl items-center justify-center">
                  <Feather name="trash-2" size={18} color="#EF4444" />
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

