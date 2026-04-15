import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const STATS = [
  { label: "Кружков", value: "8", icon: "book-open" as const, color: '#3B82F6' },
  { label: "Учеников", value: "124", icon: "users" as const, color: '#10B981' },
  { label: "Заявок", value: "15", icon: "clipboard" as const, color: '#F59E0B' },
  { label: "Посещ.", value: "92%", icon: "bar-chart-2" as const, color: '#6366F1' },
];

const QUICK_ACTIONS = [
  { label: "Заявки", icon: "clipboard", badge: 15, route: "/organization/applications" },
  { label: "Группы", icon: "layers", badge: 0, route: "/organization/groups" },
  { label: "Учителя", icon: "award", badge: 0, route: "/organization/staff" },
  { label: "Задания", icon: "file-text", badge: 0, route: "/organization/tasks" },
];

export default function OrgHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header - Restored Violet Aesthetic */}
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: 24 }}
        >
          <SafeAreaView edges={["top"]}>
            <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <View>
                  <Text style={{ fontSize: 24, fontWeight: "900", color: "white", letterSpacing: -0.5 }}>Управление</Text>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "500" }}>ДЦ «Звёздочка»</Text>
                </View>
                <Pressable
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Feather name="settings" size={20} color="white" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: isDesktop ? 32 : 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={{ paddingHorizontal: horizontalPadding, marginTop: 24 }}>
          <View className="flex-row flex-wrap justify-between gap-4">
            {STATS.map((stat) => (
              <View 
                 key={stat.label} 
                 style={SHADOWS.sm} 
                 className="w-[47%] bg-white p-5 rounded-[32px] border border-gray-50 overflow-hidden"
              >
                 <View style={{ backgroundColor: stat.color + '10' }} className="w-10 h-10 rounded-xl items-center justify-center mb-3">
                    <Feather name={stat.icon} size={20} color={stat.color} />
                 </View>
                 <Text className="text-2xl font-black text-gray-900">{stat.value}</Text>
                 <Text className="text-[10px] text-gray-400 font-bold uppercase mt-1">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: horizontalPadding, marginTop: 32 }}>
          <Text className="text-xl font-black text-gray-900 mb-4">Быстрые действия</Text>
          <View className="flex-row flex-wrap justify-between gap-4">
            {QUICK_ACTIONS.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.route as any)}
                style={SHADOWS.sm}
                className="w-[47%] bg-white p-5 rounded-[32px] border border-gray-50 relative"
              >
                <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center mb-3">
                   <Feather name={item.icon as any} size={20} color="#6B7280" />
                </View>
                <Text className="font-bold text-sm text-gray-800">{item.label}</Text>
                
                {item.badge > 0 && (
                   <View className="absolute top-5 right-5 bg-red-500 rounded-full px-2 py-0.5">
                      <Text className="text-[10px] font-black text-white">{item.badge}</Text>
                   </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Schedule Preview */}
        <View style={{ paddingHorizontal: horizontalPadding, marginTop: 32 }}>
           <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-black text-gray-900">Ближайшие занятия</Text>
              <Pressable onPress={() => router.push('/organization/schedule')}>
                 <Text className="text-blue-600 font-bold text-sm">Все</Text>
              </Pressable>
           </View>
           
           <View className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 flex-row items-center">
              <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center mr-4 shadow-sm">
                 <Feather name="calendar" size={24} color="#6B7280" />
              </View>
              <View className="flex-1">
                 <Text className="font-bold text-gray-900">Робототехника</Text>
                 <Text className="text-xs text-gray-400 font-medium mt-0.5">Группа A1 · 14:00</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#D1D5DB" />
           </View>
        </View>
      </ScrollView>
    </View>
  );
}
