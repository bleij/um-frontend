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
import { COLORS, LAYOUT, SHADOWS } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

const SKILLS = [
  { label: "Коммуникация", value: 78, color: "#6C5CE7" },
  { label: "Креативность", value: 85, color: "#A78BFA" },
  { label: "Логика",       value: 80, color: "#3B82F6" },
  { label: "Дисциплина",   value: 72, color: "#10B981" },
];

const UPCOMING = [
  { id: 1, title: "Робототехника", time: "Сегодня, 17:00", color: "#6C5CE7" },
  { id: 2, title: "Английский язык", time: "Завтра, 16:00", color: "#3B82F6" },
];

export default function YouthHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;
  const firstName = user?.firstName || "Максим";

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#3B82F6', '#6C5CE7']}
        style={{ paddingBottom: 48, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View className="flex-row items-center justify-between mb-8">
               <View>
                  <Text style={{ fontSize: 24, fontWeight: "800", color: "white" }}>Привет, {firstName}! 👋</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600" }}>Level 8 • 2450 XP</Text>
               </View>
               <Pressable className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                  <View className="w-full h-full bg-white/20 items-center justify-center">
                     <Feather name="user" size={20} color="white" />
                  </View>
               </Pressable>
            </View>

            <View className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
               <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white text-xs font-bold">До следующего уровня</Text>
                  <Text className="text-white text-xs font-black">550 XP</Text>
               </View>
               <View className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <View style={{ width: '45%' }} className="h-full bg-white rounded-full" />
               </View>
            </View>
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
        {/* Quick Actions Grid */}
        <View className="flex-row gap-3 mb-8">
           {[
              { label: "Цели", icon: "target", color: "#6C5CE7", route: "/(tabs)/youth/goals" },
              { label: "Календарь", icon: "calendar", color: "#3B82F6", route: "/(tabs)/parent/calendar" },
              { label: "Ментор", icon: "message-circle", color: "#10B981", route: "/(tabs)/chats" },
           ].map((action, idx) => (
              <Pressable 
                 key={idx}
                 onPress={() => router.push(action.route as any)}
                 style={SHADOWS.sm}
                 className="flex-1 bg-white p-4 rounded-3xl border border-gray-50 items-center"
              >
                 <View style={{ backgroundColor: action.color + '15' }} className="w-12 h-12 rounded-2xl items-center justify-center mb-2">
                    <Feather name={action.icon as any} size={22} color={action.color} />
                 </View>
                 <Text className="text-[10px] font-black text-gray-800 uppercase">{action.label}</Text>
              </Pressable>
           ))}
        </View>

        {/* Skills Section */}
        <View style={SHADOWS.sm} className="bg-white rounded-[32px] p-6 mb-8 border border-gray-100">
           <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center gap-2">
                 <Feather name="trending-up" size={18} color={COLORS.primary} />
                 <Text className="text-lg font-bold text-gray-900">Мои навыки</Text>
              </View>
              <Pressable onPress={() => router.push("/(tabs)/analytics" as any)}>
                 <Text className="text-primary font-bold text-xs">Подробнее</Text>
              </Pressable>
           </View>

           <View className="gap-5">
              {SKILLS.map(skill => (
                <View key={skill.label}>
                   <View className="flex-row justify-between mb-1.5">
                      <Text className="text-xs font-bold text-gray-600">{skill.label}</Text>
                      <Text className="text-xs font-black text-primary">{skill.value}%</Text>
                   </View>
                   <View className="h-2 bg-gray-50 rounded-full overflow-hidden">
                      <View style={{ width: `${skill.value}%`, backgroundColor: skill.color }} className="h-full rounded-full" />
                   </View>
                </View>
              ))}
           </View>
        </View>

        {/* Upcoming Classes */}
        <View className="mb-8">
           <Text className="text-lg font-bold text-gray-900 mb-4 px-1">Ближайшие занятия</Text>
           <View className="gap-3">
              {UPCOMING.map(item => (
                <Pressable 
                   key={item.id}
                   style={SHADOWS.sm}
                   className="bg-white p-4 rounded-2xl border border-gray-50 flex-row items-center gap-4"
                >
                   <View style={{ backgroundColor: item.color }} className="w-12 h-12 rounded-xl items-center justify-center">
                      <Text className="text-white font-black text-lg">{item.title.charAt(0)}</Text>
                   </View>
                   <View className="flex-1">
                      <Text className="font-bold text-gray-900">{item.title}</Text>
                      <Text className="text-xs text-gray-400 font-medium">{item.time}</Text>
                   </View>
                   <Feather name="chevron-right" size={18} color="#D1D5DB" />
                </Pressable>
              ))}
           </View>
        </View>

        {/* Achievement Card */}
        <LinearGradient
           colors={['#6C5CE7', '#A78BFA']}
           style={SHADOWS.md}
           className="p-6 rounded-[32px]"
        >
           <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
                 <Feather name="award" size={24} color="white" />
              </View>
              <View className="flex-1">
                 <Text className="text-lg font-bold text-white mb-1">Твои успехи</Text>
                 <Text className="text-white/80 text-sm leading-5">Ты выполнил 15 заданий на этой неделе! Продолжай в том же духе!</Text>
              </View>
           </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}
