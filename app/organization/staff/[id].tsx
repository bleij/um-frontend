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

interface Group {
  id: string;
  group_name: string;
  course_title: string;
  current_students: number;
}

export default function StaffDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [staff] = useState({
    id: id,
    full_name: "Игорь Соколов",
    specialization: "Робототехника, Электроника",
    phone: "+7 777 555 44 33",
    email: "sokolov@um.app",
    status: "active",
    rating: 4.8,
    total_students: 45,
    groups_count: 4,
  });

  const [groups] = useState<Group[]>([
    { id: "1", group_name: "Группа К-1", course_title: "Робототехника", current_students: 12 },
    { id: "2", group_name: "Группа К-2", course_title: "Робототехника", current_students: 10 },
    { id: "3", group_name: "Продвинутый JS", course_title: "Программирование", current_students: 15 },
    { id: "4", group_name: "Arduino Basic", course_title: "Робототехника", current_students: 8 },
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
                Профиль преподавателя
              </Text>
            </View>

            <View className="flex-row items-center gap-5">
              <View className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center border-2 border-white/30">
                 <Text style={{ fontSize: 32, fontWeight: "800", color: "white" }}>{staff.full_name.charAt(0)}</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 22, fontWeight: "800", color: "white", marginBottom: 2 }}>
                  {staff.full_name}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
                  {staff.specialization}
                </Text>
                <View className="flex-row items-center gap-1 bg-white/20 self-start px-2 py-0.5 rounded-lg">
                   <Feather name="star" size={10} color="#FFD700" fill="#FFD700" />
                   <Text style={{ color: "white", fontSize: 11, fontWeight: "800" }}>{staff.rating}</Text>
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
              <View className="w-12 h-12 bg-orange-50 rounded-2xl items-center justify-center mb-2">
                 <Feather name="layers" size={24} color={COLORS.primary} />
              </View>
              <Text className="text-2xl font-black text-gray-900">{staff.groups_count}</Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Групп</Text>
           </View>
           <View style={SHADOWS.sm} className="flex-1 bg-white rounded-3xl p-5 border border-gray-100 items-center">
              <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                 <Feather name="users" size={24} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-black text-gray-900">{staff.total_students}</Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Учеников</Text>
           </View>
        </View>

        {/* Contact Info */}
        <View style={SHADOWS.sm} className="bg-white rounded-3xl p-6 mb-6 border border-gray-100">
           <Text className="text-lg font-bold text-gray-900 mb-4">Контактная информация</Text>
           <View className="gap-4">
              <View className="flex-row items-center gap-4">
                 <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center">
                    <Feather name="phone" size={18} color={COLORS.mutedForeground} />
                 </View>
                 <Text className="text-base font-medium text-gray-700">{staff.phone}</Text>
              </View>
              <View className="flex-row items-center gap-4">
                 <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center">
                    <Feather name="mail" size={18} color={COLORS.mutedForeground} />
                 </View>
                 <Text className="text-base font-medium text-gray-700">{staff.email}</Text>
              </View>
           </View>
        </View>

        {/* Groups List */}
        <View className="mb-4">
           <Text className="text-lg font-bold text-gray-900">Группы преподавателя</Text>
        </View>

        <View className="gap-3">
           {groups.map((group) => (
             <Pressable
                key={group.id}
                onPress={() => router.push(`/organization/group/${group.id}` as any)}
                style={SHADOWS.sm}
                className="bg-white rounded-3xl p-5 border border-gray-100"
             >
                <View className="flex-row justify-between items-center">
                   <View>
                      <Text className="font-bold text-gray-900 mb-1">{group.group_name}</Text>
                      <Text className="text-xs text-gray-500">{group.course_title}</Text>
                   </View>
                   <View className="bg-gray-50 px-3 py-2 rounded-2xl flex-row items-center gap-1">
                      <Feather name="users" size={12} color={COLORS.mutedForeground} />
                      <Text className="text-xs font-bold text-gray-600">{group.current_students}</Text>
                   </View>
                </View>
             </Pressable>
           ))}
        </View>
      </ScrollView>
    </View>
  );
}
