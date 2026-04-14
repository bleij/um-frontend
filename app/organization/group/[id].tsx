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
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";

interface Student {
  id: string;
  full_name: string;
  age: number;
}

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [group] = useState({
    id: id,
    group_name: "Группа К-1",
    course_title: "Робототехника",
    teacher_name: "Игорь Соколов",
    schedule: "Пн, Ср, Пт 15:00-16:30",
    max_students: 15,
    current_students: 12,
  });

  const [students] = useState<Student[]>([
    { id: "1", full_name: "Алихан Сериков", age: 8 },
    { id: "2", full_name: "Мария Иванова", age: 9 },
    { id: "3", full_name: "Тимур Ахметов", age: 8 },
    { id: "4", full_name: "Елена Петрова", age: 9 },
    { id: "5", full_name: "Санжар Болатов", age: 8 },
  ]);

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
                Детали группы
              </Text>
              <Pressable
                onPress={() => router.push(`/organization/group/${id}/edit` as any)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="settings" size={18} color="white" />
              </Pressable>
            </View>

            <View>
              <Text style={{ fontSize: 24, fontWeight: "800", color: "white", marginBottom: 4 }}>
                {group.group_name}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "600" }}>
                {group.course_title}
              </Text>
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
        {/* Info Cards Row */}
        <View className="flex-row gap-3 mb-6">
           <View style={SHADOWS.sm} className="flex-1 bg-white rounded-3xl p-4 border border-gray-100">
              <View className="flex-row items-center gap-2 mb-1">
                 <Feather name="users" size={14} color={COLORS.primary} />
                 <Text className="text-xs text-gray-500 font-bold uppercase tracking-wider">Учеников</Text>
              </View>
              <Text className="text-xl font-black text-gray-900">{group.current_students} / {group.max_students}</Text>
           </View>
           <View style={SHADOWS.sm} className="flex-1 bg-white rounded-3xl p-4 border border-gray-100">
              <View className="flex-row items-center gap-2 mb-1">
                 <Feather name="calendar" size={14} color={COLORS.primary} />
                 <Text className="text-xs text-gray-500 font-bold uppercase tracking-wider">Занятий</Text>
              </View>
              <Text className="text-xl font-black text-gray-900">3 / нед</Text>
           </View>
        </View>

        {/* Details List */}
        <View style={SHADOWS.sm} className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
           <View className="gap-5">
              <View className="flex-row items-start gap-4">
                 <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center">
                    <Feather name="award" size={20} color={COLORS.primary} />
                 </View>
                 <View>
                    <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Преподаватель</Text>
                    <Text className="text-base font-bold text-gray-900">{group.teacher_name}</Text>
                 </View>
              </View>

              <View className="flex-row items-start gap-4">
                 <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center">
                    <Feather name="clock" size={20} color={COLORS.primary} />
                 </View>
                 <View>
                    <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Расписание</Text>
                    <Text className="text-base font-bold text-gray-900">{group.schedule}</Text>
                 </View>
              </View>
           </View>
        </View>

        {/* Student List */}
        <View className="mb-4 flex-row justify-between items-center">
           <Text className="text-lg font-bold text-gray-900">Список учеников</Text>
           <Pressable onPress={() => router.push("/organization/students" as any)}>
              <Text className="text-primary font-bold">+ Добавить</Text>
           </Pressable>
        </View>

        <View className="gap-3">
           {students.map((student) => (
             <Pressable
                key={student.id}
                onPress={() => router.push(`/organization/student/${student.id}` as any)}
                style={SHADOWS.sm}
                className="bg-white rounded-3xl p-4 border border-gray-100 flex-row items-center justify-between"
             >
                <View className="flex-row items-center gap-4">
                   <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100">
                      <Feather name="user" size={24} color={COLORS.mutedForeground} />
                   </View>
                   <View>
                      <Text className="font-bold text-gray-900">{student.full_name}</Text>
                      <Text className="text-xs text-gray-500">{student.age} лет</Text>
                   </View>
                </View>
                <Feather name="chevron-right" size={20} color={COLORS.mutedForeground} />
             </Pressable>
           ))}
        </View>
      </ScrollView>
    </View>
  );
}
