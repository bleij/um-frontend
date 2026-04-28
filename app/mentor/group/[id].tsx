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
import { useGroupMembers } from "../../../hooks/useMentorData";

export default function MentorGroupDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const { members, loading } = useGroupMembers(id as string);
  
  // Mock attendance data (in real app, fetched from database)
  // Mentors can only VIEW attendance, not mark it
  const attendanceData: Record<string, { present: boolean; missedCount: number }> = {
    // These would come from the database
  };
  
  // Get status indicator color based on attendance/progress
  const getStatusColor = (memberId: string): { color: string; label: string } => {
    const data = attendanceData[memberId];
    // Mock logic - in real app would be based on actual data
    const mockStatuses = ['green', 'green', 'yellow', 'green', 'red'];
    const idx = parseInt(memberId.slice(-1)) % mockStatuses.length;
    const status = mockStatuses[idx];
    
    if (status === 'green') return { color: '#10B981', label: 'Всё ок' };
    if (status === 'yellow') return { color: '#F59E0B', label: '2 пропуска' };
    return { color: '#EF4444', label: 'Требует внимания' };
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
              <View style={{ backgroundColor: COLORS.muted, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border }}>
                 <Text style={{ fontSize: 9, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textAlign: 'center' }}>ФЕВРАЛЬ 24, 2026</Text>
              </View>
           </View>

           {loading && (
             <Text style={{ textAlign: "center", color: COLORS.mutedForeground }}>Загрузка...</Text>
           )}
           <View style={{ gap: SPACING.md }}>
              {members.map(s => {
                const status = getStatusColor(s.id);
                return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => router.push(`/(tabs)/mentor/student/${s.id}` as any)}
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
                       borderWidth: 2,
                       borderColor: status.color,
                       ...SHADOWS.sm
                     }}>
                        <Text style={{ fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{s.student_name.charAt(0)}</Text>
                     </View>
                     <View>
                        <Text style={{ fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{s.student_name}</Text>
                        <Text style={{ fontSize: 11, color: status.color, fontWeight: TYPOGRAPHY.weight.medium, marginTop: 2 }}>{status.label}</Text>
                     </View>
                  </View>
                  {/* Status indicator dot */}
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: status.color,
                    ...SHADOWS.sm
                  }} />
                </TouchableOpacity>
                );
              })}
           </View>
        </View>

        {/* Attendance Summary - View Only */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
           <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: SPACING.lg }}>Сводка по группе</Text>
           
           <View style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl }}>
              <View style={{ flex: 1, backgroundColor: '#F0FDF4', padding: SPACING.lg, borderRadius: RADIUS.lg, alignItems: 'center' }}>
                 <Text style={{ fontSize: 24, fontWeight: TYPOGRAPHY.weight.bold, color: '#10B981' }}>3</Text>
                 <Text style={{ fontSize: 10, color: '#10B981', fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', marginTop: 4 }}>Всё ок</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FEF3C7', padding: SPACING.lg, borderRadius: RADIUS.lg, alignItems: 'center' }}>
                 <Text style={{ fontSize: 24, fontWeight: TYPOGRAPHY.weight.bold, color: '#F59E0B' }}>1</Text>
                 <Text style={{ fontSize: 10, color: '#F59E0B', fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', marginTop: 4 }}>Внимание</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FEF2F2', padding: SPACING.lg, borderRadius: RADIUS.lg, alignItems: 'center' }}>
                 <Text style={{ fontSize: 24, fontWeight: TYPOGRAPHY.weight.bold, color: '#EF4444' }}>1</Text>
                 <Text style={{ fontSize: 10, color: '#EF4444', fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', marginTop: 4 }}>Пропуски</Text>
              </View>
           </View>
           
           <View style={{ backgroundColor: COLORS.muted, padding: SPACING.md, borderRadius: RADIUS.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <Feather name="info" size={16} color={COLORS.mutedForeground} />
              <Text style={{ fontSize: 12, color: COLORS.mutedForeground, flex: 1 }}>
                 Посещаемость отмечается учителем. Вы можете отслеживать статус и получать фидбек.
              </Text>
           </View>
        </View>
      </ScrollView>
    </View>
  );
}
