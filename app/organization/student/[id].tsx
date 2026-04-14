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

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [student] = useState({
    id: id,
    full_name: "Алихан Сериков",
    age: 8,
    course_title: "Робототехника",
    group_name: "Группа К-1",
    teacher_name: "Игорь Соколов",
    level: "beginner",
    stats: {
      totalClasses: 24,
      attendanceRate: 92,
      presentCount: 22,
      absentCount: 1,
      lateCount: 1,
    },
    parent: {
      full_name: "Серик Ахметов",
      phone: "+7 777 123 45 67",
    },
  });

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
                Профиль ученика
              </Text>
            </View>

            <View className="flex-row items-center gap-5">
              <View className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center border-2 border-white/30">
                 <Text style={{ fontSize: 32, fontWeight: "800", color: "white" }}>{student.full_name.charAt(0)}</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 22, fontWeight: "800", color: "white", marginBottom: 2 }}>
                  {student.full_name}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                  {student.age} лет • {getLevelLabel(student.level)}
                </Text>
                <View className="flex-row items-center gap-1 bg-white/20 self-start px-3 py-1 rounded-full">
                   <Feather name="book-open" size={12} color="white" />
                   <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>{student.course_title}</Text>
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
        {/* Stats Grid */}
        <View className="flex-row gap-3 mb-6">
           <View style={SHADOWS.sm} className="flex-1 bg-white rounded-3xl p-5 border border-gray-100 items-center">
              <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                 <Feather name="calendar" size={24} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-black text-gray-900">{student.stats.totalClasses}</Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Занятий</Text>
           </View>
           <View style={SHADOWS.sm} className="flex-1 bg-white rounded-3xl p-5 border border-gray-100 items-center">
              <View className="w-12 h-12 bg-green-50 rounded-2xl items-center justify-center mb-2">
                 <Feather name="trending-up" size={24} color="#10B981" />
              </View>
              <Text className="text-2xl font-black text-gray-900">{student.stats.attendanceRate}%</Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Посещаемость</Text>
           </View>
        </View>

        {/* Attendance Breakdown */}
        <View style={SHADOWS.sm} className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
           <Text className="text-lg font-bold text-gray-900 mb-4">Статистика посещений</Text>
           <View className="flex-row gap-2">
              <View className="flex-1 bg-green-50 p-4 rounded-2xl items-center">
                 <Text className="text-xl font-black text-green-600">{student.stats.presentCount}</Text>
                 <Text className="text-[10px] text-green-700 font-bold uppercase mt-1">Был</Text>
              </View>
              <View className="flex-1 bg-red-50 p-4 rounded-2xl items-center">
                 <Text className="text-xl font-black text-red-600">{student.stats.absentCount}</Text>
                 <Text className="text-[10px] text-red-700 font-bold uppercase mt-1">Пропуск</Text>
              </View>
              <View className="flex-1 bg-yellow-50 p-4 rounded-2xl items-center">
                 <Text className="text-xl font-black text-yellow-600">{student.stats.lateCount}</Text>
                 <Text className="text-[10px] text-yellow-700 font-bold uppercase mt-1">Опоздал</Text>
              </View>
           </View>
        </View>

        {/* Course Info Details */}
        <View style={SHADOWS.sm} className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
           <View className="gap-5">
              <View className="flex-row items-start gap-4">
                 <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center">
                    <Feather name="layers" size={20} color={COLORS.primary} />
                 </View>
                 <View>
                    <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Группа</Text>
                    <Text className="text-base font-bold text-gray-900">{student.group_name}</Text>
                 </View>
              </View>
              <View className="flex-row items-start gap-4">
                 <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center">
                    <Feather name="award" size={20} color={COLORS.primary} />
                 </View>
                 <View>
                    <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Преподаватель</Text>
                    <Text className="text-base font-bold text-gray-900">{student.teacher_name}</Text>
                 </View>
              </View>
           </View>
        </View>

        {/* Parent / Contact Info */}
        <View style={SHADOWS.sm} className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
           <Text className="text-lg font-bold text-gray-900 mb-4">Контакт родителя</Text>
           <View className="flex-row items-center justify-between">
              <View>
                 <Text className="text-base font-bold text-gray-900">{student.parent.full_name}</Text>
                 <Text className="text-sm text-gray-500">{student.parent.phone}</Text>
              </View>
              <Pressable
                className="w-12 h-12 bg-primary rounded-2xl items-center justify-center"
                onPress={() => {}}
              >
                 <Feather name="phone" size={20} color="white" />
              </Pressable>
           </View>
        </View>

        {/* Actions */}
        <Pressable
          className="h-14 bg-gray-100 rounded-2xl items-center justify-center"
          onPress={() => {}}
        >
           <Text className="text-gray-600 font-bold">Редактировать профиль</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
