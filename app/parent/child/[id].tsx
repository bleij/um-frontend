import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS } from "../../../constants/theme";
import { useParentData } from "../../../contexts/ParentDataContext";

export default function ParentChildDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { childrenProfile } = useParentData();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const child = childrenProfile.find((c) => c.id === id) || childrenProfile[0];

  if (!child) return null;

  const SKILLS = [
    { label: "Коммуникация", value: 75, color: "#6C5CE7" },
    { label: "Лидерство", value: 65, color: "#3B82F6" },
    { label: "Креативность", value: 80, color: "#A78BFA" },
    { label: "Логика", value: 70, color: "#10B981" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#6C5CE7', '#8B7FE8']}
        style={{ paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 32 }}>
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Профиль</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <View style={SHADOWS.md} className="w-24 h-24 bg-white rounded-[32px] items-center justify-center mb-5 border-4 border-white/20">
                <Text style={{ color: '#6C5CE7' }} className="text-4xl font-black">{(child.name || "").charAt(0)}</Text>
              </View>
              <Text className="text-2xl font-black text-white">{child.name}</Text>
              <View className="mt-2 bg-white/20 px-4 py-1.5 rounded-full border border-white/30">
                 <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                    {child.ageCategory === "child" ? "МЛАДШАЯ ГРУППА" : "СРЕДНЯЯ ГРУППА"}
                 </Text>
              </View>

              <View className="flex-row gap-10 mt-8">
                 <View className="items-center">
                    <Text className="text-white text-xl font-black">1.2k</Text>
                    <Text className="text-white/60 text-[10px] font-bold uppercase mt-1">XP</Text>
                 </View>
                 <View className="w-px h-8 bg-white/20" />
                 <View className="items-center">
                    <Text className="text-white text-xl font-black">5</Text>
                    <Text className="text-white/60 text-[10px] font-bold uppercase mt-1">LEVEL</Text>
                 </View>
                 <View className="w-px h-8 bg-white/20" />
                 <View className="items-center">
                    <Text className="text-white text-xl font-black">12</Text>
                    <Text className="text-white/60 text-[10px] font-bold uppercase mt-1">BADGES</Text>
                 </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 32,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Insight Box */}
        <View className="bg-blue-50 p-6 rounded-[32px] mb-8 flex-row items-center gap-4 border border-blue-100">
           <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
              <Feather name="info" size={20} color="#3B82F6" />
           </View>
           <Text className="flex-1 text-blue-900 text-xs font-medium leading-5">
              Заполните анкету интересов, чтобы AI подобрал идеальный путь развития для {child.name}.
           </Text>
        </View>

        {/* Skills Section */}
        <View style={SHADOWS.sm} className="bg-white rounded-[40px] p-8 mb-8 border border-gray-50">
           <View className="flex-row items-center gap-3 mb-8">
              <View className="w-10 h-10 bg-purple-50 rounded-2xl items-center justify-center">
                 <Feather name="target" size={20} color="#6C5CE7" />
              </View>
              <Text className="text-xl font-black text-gray-900">Развитие навыков</Text>
           </View>

           <View className="gap-6">
              {SKILLS.map((skill, idx) => (
                 <View key={idx}>
                    <View className="flex-row justify-between mb-2">
                       <Text className="text-sm font-bold text-gray-700">{skill.label}</Text>
                       <Text className="text-sm font-black text-gray-900">{skill.value}%</Text>
                    </View>
                    <View className="h-2 bg-gray-50 rounded-full overflow-hidden">
                       <View style={{ width: `${skill.value}%`, backgroundColor: skill.color }} className="h-full rounded-full" />
                    </View>
                 </View>
              ))}
           </View>
        </View>

        {/* Test CTA */}
        <View style={SHADOWS.md} className="bg-gray-900 rounded-[40px] p-8 overflow-hidden">
           <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
           />
           <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 bg-white/10 rounded-2xl items-center justify-center">
                 <Feather name="award" size={20} color="white" />
              </View>
              <Text className="text-white text-lg font-black">AI Диагностика</Text>
           </View>
           <Text className="text-white/60 text-sm leading-5 mb-6">
              Пройдите глубокий тест способностей ребенка для открытия новых талантов.
           </Text>
           <Pressable 
              onPress={() => router.push("/parent/testing" as any)}
              className="bg-white h-14 rounded-2xl items-center justify-center active:bg-gray-100"
           >
              <Text className="text-gray-900 font-black text-sm uppercase">Начать тест</Text>
           </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
