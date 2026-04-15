import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
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
import { COLORS, LAYOUT, SHADOWS, RADIUS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

const MOCK_STUDENTS = [
  { id: "1", name: "Алихан Сериков", attendance: true, xpAdded: 50 },
  { id: "2", name: "Мария Иванова", attendance: true, xpAdded: 50 },
  { id: "3", name: "Тимур Ахметов", attendance: false, xpAdded: 0 },
  { id: "4", name: "Елена Петрова", attendance: true, xpAdded: 50 },
  { id: "5", name: "Санжар Болатов", attendance: true, xpAdded: 50 },
];

export default function MentorGroupDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const [students, setStudents] = useState(MOCK_STUDENTS);

  const toggleAttendance = (id: string) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, attendance: !s.attendance } : s
    ));
  };

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
                <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white" }}>Старшая группа A</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium }}>Сегодня, 15:00-16:30</Text>
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
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Attendance Marking Section */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
           <View className="flex-row justify-between items-center mb-6">
              <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>Посещаемость</Text>
              <View style={{ backgroundColor: COLORS.muted, px: SPACING.md, py: SPACING.xs, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border }}>
                 <Text style={{ fontSize: 9, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textAlign: 'center' }}>ФЕВРАЛЬ 24, 2026</Text>
              </View>
           </View>

           <View style={{ gap: SPACING.md }}>
              {students.map(s => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => toggleAttendance(s.id)}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: SPACING.lg, 
                    backgroundColor: COLORS.background, 
                    borderRadius: RADIUS.lg, 
                    borderWidth: 1, 
                    borderColor: COLORS.border 
                  }}
                >
                  <View className="flex-row items-center gap-4">
                     <View style={{ 
                       width: 44, 
                       height: 44, 
                       backgroundColor: COLORS.white, 
                       borderRadius: RADIUS.full, 
                       alignItems: 'center', 
                       justifyContent: 'center', 
                       borderWidth: 1, 
                       borderColor: COLORS.border,
                       ...SHADOWS.sm
                     }}>
                        <Text style={{ fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{s.name.charAt(0)}</Text>
                     </View>
                     <Text style={{ fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{s.name}</Text>
                  </View>
                  <View style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: RADIUS.md, 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: s.attendance ? COLORS.success : COLORS.white,
                    borderWidth: s.attendance ? 0 : 2,
                    borderColor: COLORS.muted,
                    ... (s.attendance ? SHADOWS.md : {})
                  }}>
                     {s.attendance && <Feather name="check" size={20} color="white" />}
                  </View>
                </TouchableOpacity>
              ))}
           </View>
        </View>

        {/* Lesson Summary / XP */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
           <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: SPACING.lg }}>Награды за занятие</Text>
           <View className="flex-row items-center gap-4 mb-8">
              <View style={{ width: 56, height: 56, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' }}>
                 <Feather name="award" size={28} color="#F59E0B" />
              </View>
              <View className="flex-1">
                 <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>Активность +50 XP</Text>
                 <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', marginTop: 2 }}>Будет начислено всем присутствующим</Text>
              </View>
           </View>
           
           <TouchableOpacity 
              style={{ ...SHADOWS.md, h: 64, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => router.back()}
           >
              <Text style={{ color: 'white', fontWeight: TYPOGRAPHY.weight.bold, fontSize: TYPOGRAPHY.size.md }}>Завершить и начислить XP</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
