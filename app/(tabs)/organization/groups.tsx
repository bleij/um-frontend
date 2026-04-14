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
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";

interface Group {
  id: string;
  group_name: string;
  course_title: string;
  status: "active" | "inactive";
  current_students: number;
  max_students: number;
  teacher_name?: string;
  schedule?: string;
}

const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    group_name: "Группа К-1",
    course_title: "Робототехника",
    status: "active",
    current_students: 12,
    max_students: 15,
    teacher_name: "Игорь Соколов",
    schedule: "Пн, Ср, Пт 15:00",
  },
  {
    id: "2",
    group_name: "Группа А-3",
    course_title: "Английский язык",
    status: "active",
    current_students: 8,
    max_students: 12,
    teacher_name: "Марина Иванова",
    schedule: "Вт, Чт 16:30",
  },
  {
    id: "3",
    group_name: "Группа Х-10",
    course_title: "Рисование",
    status: "inactive",
    current_students: 0,
    max_students: 20,
    teacher_name: "Анна Петрова",
    schedule: "Сб 11:00",
  },
];

export default function OrgGroupsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : 20;

  const [groups] = useState<Group[]>(MOCK_GROUPS);
  const [loading] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={[COLORS.gradientFrom, COLORS.gradientTo]}
        style={{ paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: horizontalPadding,
              paddingTop: 12,
            }}
          >
            <View>
              <Text style={{ fontSize: 24, fontWeight: "800", color: "white" }}>
                Группы
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
                Всего групп: {groups.length}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/organization/group/create" as any)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="plus" size={24} color="white" />
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="items-center py-10">
            <Text className="text-gray-400">Загрузка...</Text>
          </View>
        ) : groups.length === 0 ? (
          <View className="bg-white rounded-3xl p-10 items-center justify-center border border-gray-100 shadow-sm">
            <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
              <Feather name="users" size={32} color={COLORS.mutedForeground} />
            </View>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Нет групп
            </Text>
            <Text className="text-gray-500 text-center mb-6 leading-5">
              Создайте первую группу для начала работы
            </Text>
            <Pressable
              onPress={() => router.push("/organization/group/create" as any)}
              className="bg-primary px-8 py-4 rounded-2xl"
            >
              <Text className="text-white font-bold">Создать группу</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-4">
            {groups.map((group) => (
              <View
                key={group.id}
                className="bg-white rounded-3xl p-5 border border-gray-100"
                style={SHADOWS.md}
              >
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 mb-1">
                      {group.group_name}
                    </Text>
                    <Text className="text-sm text-primary font-semibold">
                      {group.course_title}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      group.status === "active" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${
                        group.status === "active" ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {group.status === "active" ? "АКТИВНА" : "НЕАКТИВНА"}
                    </Text>
                  </View>
                </View>

                {/* Grid Info */}
                <View className="flex-row flex-wrap gap-y-3 mb-5">
                  <View style={{ width: "50%" }} className="flex-row items-center gap-2">
                    <Feather name="users" size={14} color={COLORS.mutedForeground} />
                    <Text className="text-sm text-gray-700">
                      {group.current_students}/{group.max_students} учеников
                    </Text>
                  </View>
                  <View style={{ width: "50%" }} className="flex-row items-center gap-2">
                    <Feather name="award" size={14} color={COLORS.mutedForeground} />
                    <Text className="text-sm text-gray-700 truncate">
                      {group.teacher_name || "Не назначен"}
                    </Text>
                  </View>
                  {group.schedule && (
                    <View style={{ width: "100%" }} className="flex-row items-center gap-2">
                      <Feather name="clock" size={14} color={COLORS.mutedForeground} />
                      <Text className="text-sm text-gray-700">{group.schedule}</Text>
                    </View>
                  )}
                </View>

                {/* Action */}
                <Pressable
                  onPress={() =>
                    router.push(`/organization/group/${group.id}` as any)
                  }
                  className="h-12 bg-primary rounded-2xl items-center justify-center"
                >
                  <Text className="text-white font-bold text-sm">Подробнее</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
