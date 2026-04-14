import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../../constants/theme";

interface Skill {
  name: string;
  value: number;
}

interface Group {
  id: string;
  group_name: string;
  teacher_name?: string;
  current_students: number;
  max_students: number;
  schedule: string;
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [course] = useState({
    id: id,
    title: "Робототехника",
    description: "Наш курс робототехники научит детей основам механики, электроники и программирования. Мы используем наборы LEGO Education и Arduino для создания реальных проектов.",
    level: "beginner",
    price: 25000,
    skills: [
      { name: "Логика", value: 45 },
      { name: "Программирование", value: 30 },
      { name: "Креативность", value: 25 },
    ] as Skill[],
  });

  const [groups] = useState<Group[]>([
    {
      id: "1",
      group_name: "Младшая группа (7-9 лет)",
      teacher_name: "Иван Иванов",
      current_students: 8,
      max_students: 12,
      schedule: "Пн, Ср 15:00-16:30",
    },
    {
      id: "2",
      group_name: "Средняя группа (10-12 лет)",
      teacher_name: "Петр Петров",
      current_students: 10,
      max_students: 10,
      schedule: "Вт, Чт 16:00-17:30",
    },
  ]);

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner": return "Начальный";
      case "intermediate": return "Средний";
      case "advanced": return "Продвинутый";
      default: return level;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={[COLORS.gradientFrom, COLORS.gradientTo]}
        style={{ paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Pressable
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="arrow-left" size={20} color="white" />
              </Pressable>
              <Text style={{ flex: 1, marginLeft: 16, fontSize: 20, fontWeight: "800", color: "white" }}>
                Детали курса
              </Text>
              <Pressable
                onPress={() => router.push(`/organization/course/${id}/edit` as any)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="edit-2" size={18} color="white" />
              </Pressable>
            </View>

            <View>
              <Text style={{ fontSize: 24, fontWeight: "800", color: "white", marginBottom: 8 }}>
                {course.title}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                 <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>{getLevelLabel(course.level)}</Text>
                 </View>
                 <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>{course.price.toLocaleString()} ₸ / мес</Text>
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
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={SHADOWS.sm} className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
           <View className="flex-row items-center gap-2 mb-3">
              <Feather name="book-open" size={18} color={COLORS.primary} />
              <Text className="text-lg font-bold text-gray-900">Описание</Text>
           </View>
           <Text className="text-gray-600 leading-6">{course.description}</Text>
        </View>

        {/* Skills */}
        <View style={SHADOWS.sm} className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
           <Text className="text-lg font-bold text-gray-900 mb-4">Развиваемые навыки</Text>
           <View className="gap-3">
              {course.skills.map((skill, index) => (
                <View key={index} className="bg-purple-50 p-4 rounded-2xl flex-row justify-between items-center">
                   <Text className="text-primary font-bold">{skill.name}</Text>
                   <Text className="text-primary font-black">+{skill.value}%</Text>
                </View>
              ))}
           </View>
        </View>

        {/* Groups */}
        <View className="mb-4 flex-row justify-between items-center">
           <Text className="text-lg font-bold text-gray-900">Группы курса</Text>
           <Pressable onPress={() => router.push(`/organization/group/create?courseId=${id}` as any)}>
              <Text className="text-primary font-bold">+ Добавить</Text>
           </Pressable>
        </View>

        <View className="gap-4">
           {groups.map((group) => (
             <Pressable
                key={group.id}
                onPress={() => router.push(`/organization/group/${group.id}` as any)}
                style={SHADOWS.sm}
                className="bg-white rounded-3xl p-5 border border-gray-100"
             >
                <View className="flex-row justify-between items-start mb-3">
                   <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900 mb-1">{group.group_name}</Text>
                      <View className="flex-row items-center gap-1">
                         <Feather name="award" size={12} color={COLORS.mutedForeground} />
                         <Text className="text-xs text-gray-500">{group.teacher_name || "Не назначен"}</Text>
                      </View>
                   </View>
                   <View className="bg-gray-50 px-3 py-1 rounded-full flex-row items-center gap-1">
                      <Feather name="users" size={12} color={COLORS.mutedForeground} />
                      <Text className="text-xs font-bold text-gray-600">{group.current_students}/{group.max_students}</Text>
                   </View>
                </View>
                <View className="flex-row items-center gap-2">
                   <Feather name="clock" size={14} color={COLORS.mutedForeground} />
                   <Text className="text-sm text-gray-600">{group.schedule}</Text>
                </View>
             </Pressable>
           ))}
        </View>
      </ScrollView>
    </View>
  );
}
