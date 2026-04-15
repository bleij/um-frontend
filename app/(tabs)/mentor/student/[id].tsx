import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS, RADIUS, SPACING, TYPOGRAPHY } from "../../../../constants/theme";

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
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const student = MOCK_STUDENTS[id as string] || MOCK_STUDENTS["1"];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header - Unified Brand Style */}
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: SPACING.xl }}
        >
          <SafeAreaView edges={["top"]}>
            <MotiView 
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={{ paddingHorizontal: paddingX, paddingTop: SPACING.md }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.xl }}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: RADIUS.md,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: SPACING.md,
                  }}
                >
                  <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white" }}>Профиль ученика</Text>
              </View>

              <View className="flex-row items-center gap-5">
                 <View style={{ 
                    width: 72, 
                    height: 72, 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderRadius: RADIUS.lg, 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    borderWidth: 2, 
                    borderColor: 'rgba(255,255,255,0.3)' 
                 }}>
                    <Text style={{ fontSize: 32, fontWeight: "700", color: "white" }}>{student.name.charAt(0)}</Text>
                 </View>
                 <View>
                    <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white", marginBottom: 2 }}>{student.name}</Text>
                    <View className="flex-row items-center gap-2">
                       <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', px: SPACING.sm, py: SPACING.xs/2, borderRadius: RADIUS.sm }}>
                          <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>LVL {student.level}</Text>
                       </View>
                       <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium }}>{student.age} лет</Text>
                    </View>
                 </View>
              </View>
            </MotiView>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingX,
          paddingTop: SPACING.xl,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Core Stats Row */}
        <View className="flex-row gap-3 mb-8">
           <View style={{ ...SHADOWS.strict, flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{student.xp}</Text>
              <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', marginTop: 2 }}>Очков XP</Text>
           </View>
           <View style={{ ...SHADOWS.strict, flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.success }}>{student.progress}%</Text>
              <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', marginTop: 2 }}>Прогресс</Text>
           </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-8">
           <TouchableOpacity 
              onPress={() => router.push("/(tabs)/mentor/learning-path" as any)}
              style={{ ...SHADOWS.md, flex: 1, height: 56, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' }}
           >
              <Text style={{ color: 'white', fontWeight: TYPOGRAPHY.weight.bold }}>План развития</Text>
           </TouchableOpacity>
           <TouchableOpacity 
              onPress={() => router.push("/(tabs)/chats" as any)}
              style={{ width: 56, height: 56, backgroundColor: COLORS.muted, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' }}
           >
              <Feather name="message-circle" size={24} color={COLORS.primary} />
           </TouchableOpacity>
        </View>

        {/* Skills Section */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
           <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: SPACING.lg }}>Профиль навыков</Text>
           <View style={{ gap: SPACING.lg }}>
              {SKILLS.map(skill => (
                <View key={skill.label}>
                   <View className="flex-row justify-between mb-2">
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground }}>{skill.label}</Text>
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{skill.value}%</Text>
                   </View>
                   <View style={{ height: 8, backgroundColor: COLORS.muted, borderRadius: RADIUS.full, overflow: 'hidden' }}>
                      <View style={{ width: `${skill.value}%`, backgroundColor: skill.color }} className="h-full rounded-full" />
                   </View>
                </View>
              ))}
           </View>
        </View>

        {/* Results Section */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
           <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: SPACING.lg }}>Результаты тестов</Text>
           <View style={{ gap: SPACING.md }}>
              {TESTS.map((test, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.lg, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border }}>
                   <View>
                      <Text style={{ fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{test.name}</Text>
                      <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', marginTop: 2 }}>{test.date}</Text>
                   </View>
                   <View style={{ width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.sm }}>
                      <Text style={{ fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary, fontSize: TYPOGRAPHY.size.lg }}>{test.score}</Text>
                   </View>
                </View>
              ))}
           </View>
        </View>

        {/* Add Recommendation Button */}
        <TouchableOpacity style={{ height: 64, borderRadius: RADIUS.lg, borderWeight: 2, borderStyle: 'dashed', borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: SPACING.sm }}>
           <Feather name="plus-circle" size={20} color={COLORS.mutedForeground} />
           <Text style={{ fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.mutedForeground }}>Добавить рекомендацию</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
