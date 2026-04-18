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

const SKILLS = [
  { label: "Коммуникация", current: 85, prev: 75, color: '#6C5CE7' },
  { label: "Лидерство", current: 65, prev: 55, color: '#3B82F6' },
  { label: "Креативность", current: 90, prev: 85, color: '#A78BFA' },
  { label: "Логика", current: 75, prev: 70, color: '#10B981' },
];

const ATTENDANCE = [
  { m: "Сен", v: 90 }, { m: "Окт", v: 85 }, { m: "Ноя", v: 95 },
  { m: "Дек", v: 88 }, { m: "Янв", v: 92 }, { m: "Фев", v: 87 },
];

export default function ParentReports() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedChild, setSelectedChild] = useState("Анна");
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;
  
  const children = ["Анна", "Дмитрий"];
  const maxAttendance = Math.max(...ATTENDANCE.map((a) => a.v));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#6C5CE7', '#8B7FE8']}
        style={{ paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Отчеты</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1 overflow-visible">
               {children.map(child => (
                  <Pressable 
                     key={child}
                     onPress={() => setSelectedChild(child)}
                     className={`mr-3 px-6 py-2.5 rounded-full border ${selectedChild === child ? 'bg-white/20 border-white/40' : 'bg-transparent border-white/20'}`}
                  >
                     <Text className="font-bold text-sm text-white">{child}</Text>
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
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View className="flex-row gap-4 mb-8">
           {[
              { label: 'Занятий', value: '24', icon: 'calendar', color: '#6C5CE7' },
              { label: 'Посещаемость', value: '89%', icon: 'check-circle', color: '#10B981' },
           ].map(stat => (
              <View key={stat.label} style={SHADOWS.sm} className="flex-1 bg-white p-5 rounded-[32px] border border-gray-50 items-center">
                 <View style={{ backgroundColor: stat.color + '10' }} className="w-10 h-10 rounded-xl items-center justify-center mb-3">
                    <Feather name={stat.icon as any} size={20} color={stat.color} />
                 </View>
                 <Text className="text-2xl font-black text-gray-900">{stat.value}</Text>
                 <Text className="text-[10px] text-gray-400 font-bold uppercase mt-1 text-center">{stat.label}</Text>
              </View>
           ))}
        </View>

        {/* Dynamic Skills */}
        <View style={SHADOWS.md} className="bg-white rounded-[40px] p-6 mb-8 border border-gray-50">
           <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-black text-gray-900">Навыки</Text>
              <View className="bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex-row items-center gap-1.5">
                 <Feather name="trending-up" size={12} color="#10B981" />
                 <Text className="text-[10px] font-black text-green-600">+12% ЗА МЕСЯЦ</Text>
              </View>
           </View>

           <View className="gap-6">
              {SKILLS.map(skill => (
                 <View key={skill.label}>
                    <View className="flex-row justify-between items-end mb-2">
                       <Text className="text-sm font-bold text-gray-800">{skill.label}</Text>
                       <Text className="text-sm font-black text-gray-900">{skill.current}%</Text>
                    </View>
                    <View className="h-2 bg-gray-50 rounded-full overflow-hidden">
                       <View style={{ width: `${skill.current}%`, backgroundColor: skill.color }} className="h-full rounded-full" />
                    </View>
                 </View>
              ))}
           </View>
        </View>

        {/* AI Insight */}
        <View className="bg-purple-600 rounded-[40px] p-8 overflow-hidden">
           <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
           />
           <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 bg-white/20 rounded-2xl items-center justify-center">
                 <Feather name="cpu" size={20} color="white" />
              </View>
              <Text className="text-white text-lg font-black">AI Аналитика</Text>
           </View>
           <Text className="text-white/80 text-sm leading-6 font-medium">
              {selectedChild} показывает исключительные результаты в креативности. Рекомендуем попробовать театральную студию для развития лидерских качеств и публичных выступлений.
           </Text>
        </View>
      </ScrollView>
    </View>
  );
}
