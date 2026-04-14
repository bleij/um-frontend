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

interface Teacher {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  specialization: string;
  rating: number;
  status: "active" | "invited" | "inactive";
  photo_url?: string;
}

const MOCK_TEACHERS: Teacher[] = [
  {
    id: "1",
    full_name: "Анна Петрова",
    phone: "+7 701 123 45 67",
    email: "anna@example.com",
    specialization: "Рисование и живопись",
    rating: 4.9,
    status: "active",
  },
  {
    id: "2",
    full_name: "Игорь Соколов",
    phone: "+7 707 987 65 43",
    email: "igor@example.com",
    specialization: "Робототехника",
    rating: 4.7,
    status: "invited",
  },
  {
    id: "3",
    full_name: "Марина Иванова",
    phone: "+7 702 555 11 22",
    email: "marina@example.com",
    specialization: "Английский язык",
    rating: 4.8,
    status: "active",
  },
];

export default function OrgStaffScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : 20;

  const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [loading] = useState(false);

  const getStatusBadge = (status: Teacher["status"]) => {
    switch (status) {
      case "active":
        return (
          <View className="px-3 py-1 bg-green-100 rounded-full">
            <Text className="text-green-700 text-xs font-semibold">Активен</Text>
          </View>
        );
      case "invited":
        return (
          <View className="px-3 py-1 bg-yellow-100 rounded-full">
            <Text className="text-yellow-700 text-xs font-semibold">
              Приглашен
            </Text>
          </View>
        );
      case "inactive":
        return (
          <View className="px-3 py-1 bg-gray-100 rounded-full">
            <Text className="text-gray-700 text-xs font-semibold">
              Неактивен
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

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
                Учителя
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
                Преподавательский состав
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/organization/staff/add" as any)}
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
        {/* Stats */}
        <View className="flex-row justify-between mb-8 gap-3">
          <View
            className="flex-1 bg-white p-4 rounded-3xl items-center border border-gray-100"
            style={SHADOWS.sm}
          >
            <Text className="text-xl font-bold text-primary">
              {teachers.length}
            </Text>
            <Text className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
              Всего
            </Text>
          </View>
          <View
            className="flex-1 bg-white p-4 rounded-3xl items-center border border-gray-100"
            style={SHADOWS.sm}
          >
            <Text className="text-xl font-bold text-green-600">
              {teachers.filter((t) => t.status === "active").length}
            </Text>
            <Text className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
              Активных
            </Text>
          </View>
          <View
            className="flex-1 bg-white p-4 rounded-3xl items-center border border-gray-100"
            style={SHADOWS.sm}
          >
            <Text className="text-xl font-bold text-yellow-600">
              {teachers.filter((t) => t.status === "invited").length}
            </Text>
            <Text className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
              Новых
            </Text>
          </View>
        </View>

        {/* Teachers List */}
        {loading ? (
          <View className="items-center py-10">
            <Text className="text-gray-400">Загрузка...</Text>
          </View>
        ) : teachers.length === 0 ? (
          <View className="bg-white rounded-3xl p-10 items-center justify-center border border-gray-100">
            <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
              <Feather name="users" size={32} color={COLORS.mutedForeground} />
            </View>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Нет учителей
            </Text>
            <Text className="text-gray-500 text-center mb-6 leading-5">
              Добавьте первого преподавателя для вашей организации
            </Text>
            <Pressable
              onPress={() => router.push("/organization/staff/add" as any)}
              className="bg-primary px-8 py-4 rounded-2xl"
            >
              <Text className="text-white font-bold">Добавить учителя</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-4">
            {teachers.map((teacher) => (
              <View
                key={teacher.id}
                className="bg-white rounded-3xl p-5 border border-gray-100"
                style={SHADOWS.md}
              >
                <View className="flex-row items-center gap-4 mb-4">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${COLORS.primary}15` }}
                  >
                    <Text className="text-primary text-xl font-bold">
                      {teacher.full_name.charAt(0)}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-lg font-bold text-gray-900">
                        {teacher.full_name}
                      </Text>
                      {getStatusBadge(teacher.status)}
                    </View>
                    <Text className="text-sm text-gray-500">
                      {teacher.specialization}
                    </Text>
                  </View>
                </View>

                {/* Info Rows */}
                <View className="gap-2 mb-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                      <Feather name="phone" size={14} color={COLORS.mutedForeground} />
                    </View>
                    <Text className="text-sm text-gray-700">{teacher.phone}</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                      <Feather name="mail" size={14} color={COLORS.mutedForeground} />
                    </View>
                    <Text className="text-sm text-gray-700">{teacher.email}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() =>
                      router.push(`/organization/staff/${teacher.id}` as any)
                    }
                    className="flex-1 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-200"
                  >
                    <Text className="text-gray-700 font-bold text-sm">Подробнее</Text>
                  </Pressable>
                  {teacher.status === "invited" && (
                     <Pressable
                     className="px-6 h-12 bg-primary rounded-2xl items-center justify-center"
                   >
                     <Text className="text-white font-bold text-sm">Напомнить</Text>
                   </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
