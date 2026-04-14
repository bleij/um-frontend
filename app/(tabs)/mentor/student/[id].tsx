import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { COLORS, LAYOUT, SHADOWS } from "../../../../constants/theme";

const MOCK_STUDENTS: Record<string, any> = {
    "1": { name: "Анна Петрова",    age: 8,  level: 5, xp: 1250, progress: 85 },
    "2": { name: "Максим Иванов",   age: 14, level: 8, xp: 2450, progress: 78 },
    "3": { name: "София Смирнова",  age: 10, level: 6, xp: 1680, progress: 92 },
};

const SKILLS = [
    { label: "Коммуникация", value: 85, color: "#6C5CE7" },
    { label: "Креативность", value: 90, color: "#A78BFA" },
    { label: "Логика",       value: 75, color: "#3B82F6" },
];

const TESTS = [
    { name: "Креативность",           score: 92, date: "15 янв" },
    { name: "Эмоциональный интеллект",score: 85, date: "1 фев"  },
];

export default function MentorStudentProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const student = MOCK_STUDENTS[id as string] || MOCK_STUDENTS["1"];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={[COLORS.gradientFrom, COLORS.gradientTo]}
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Профиль ученика</Text>
            </View>

            <View className="flex-row items-center gap-5">
               <View className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border-2 border-white/30">
                  <Text style={{ fontSize: 32, fontWeight: "800", color: "white" }}>{student.name.charAt(0)}</Text>
               </View>
               <View>
                  <Text style={{ fontSize: 24, fontWeight: "800", color: "white", marginBottom: 4 }}>{student.name}</Text>
                  <View className="flex-row items-center gap-2">
                     <View className="bg-white/20 px-2 py-1 rounded-lg">
                        <Text className="text-white text-[10px] font-bold">LVL {student.level}</Text>
                     </View>
                     <Text className="text-white/80 text-sm font-bold">{student.age} лет</Text>
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
        {/* Core Stats Row */}
        <View className="flex-row gap-3 mb-8">
           <View style={SHADOWS.sm} className="flex-1 bg-white rounded-3xl p-5 border border-gray-100">
              <Text className="text-2xl font-black text-primary">{student.xp}</Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Очков XP</Text>
           </View>
           <View style={SHADOWS.sm} className="flex-1 bg-white rounded-3xl p-5 border border-gray-100">
              <Text className="text-2xl font-black text-green-600">{student.progress}%</Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Прогресс</Text>
           </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-8">
           <Pressable 
              onPress={() => router.push("/(tabs)/mentor/learning-path" as any)}
              className="flex-1 h-14 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/20"
           >
              <Text className="text-white font-bold">План развития</Text>
           </Pressable>
           <Pressable 
              onPress={() => router.push("/(tabs)/chats" as any)}
              className="w-14 h-14 bg-gray-100 rounded-2xl items-center justify-center"
           >
              <Feather name="message-circle" size={24} color={COLORS.mutedForeground} />
           </Pressable>
        </View>

        {/* Skills Section */}
        <View style={SHADOWS.sm} className="bg-white rounded-[32px] p-6 mb-8 border border-gray-100">
           <Text className="text-lg font-bold text-gray-900 mb-6">Профиль навыков</Text>
           <View className="gap-6">
              {SKILLS.map(skill => (
                <View key={skill.label}>
                   <View className="flex-row justify-between mb-2">
                      <Text className="text-sm font-bold text-gray-700">{skill.label}</Text>
                      <Text className="text-sm font-black text-primary">{skill.value}%</Text>
                   </View>
                   <View className="h-2.5 bg-gray-50 rounded-full overflow-hidden">
                      <View style={{ width: `${skill.value}%`, backgroundColor: skill.color }} className="h-full rounded-full" />
                   </View>
                </View>
              ))}
           </View>
        </View>

        {/* Results Section */}
        <View style={SHADOWS.sm} className="bg-white rounded-[32px] p-6 mb-8 border border-gray-100">
           <Text className="text-lg font-bold text-gray-900 mb-4">Результаты тестов</Text>
           <View className="gap-4">
              {TESTS.map((test, index) => (
                <View key={index} className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <View>
                      <Text className="font-bold text-gray-900">{test.name}</Text>
                      <Text className="text-[10px] text-gray-400 font-bold uppercase">{test.date}</Text>
                   </View>
                   <View className="w-12 h-12 rounded-xl bg-white items-center justify-center border border-gray-100">
                      <Text className="font-black text-primary text-lg">{test.score}</Text>
                   </View>
                </View>
              ))}
           </View>
        </View>

        {/* Add Recommendation Button */}
        <Pressable className="h-16 rounded-3xl border-2 border-dashed border-gray-200 items-center justify-center flex-row gap-3">
           <Feather name="plus-circle" size={20} color={COLORS.mutedForeground} />
           <Text className="font-bold text-gray-500">Добавить рекомендацию</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
