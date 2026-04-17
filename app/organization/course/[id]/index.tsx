import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../../constants/theme";

interface Skill {
  name: string;
  value: number;
}

interface Group {
  id: string;
  group_name: string;
  teacher_name?: string;
  current_students: number;
  max_students: number;
  schedule: string;
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const [course] = useState({
    id: id,
    title: "Робототехника",
    description: "Наш курс робототехники научит детей основам механики, электроники и программирования. Мы используем наборы LEGO Education и Arduino для создания реальных проектов.",
    level: "beginner",
    price: 25000,
    skills: [
      { name: "Логика", value: 45 },
      { name: "Программирование", value: 30 },
      { name: "Креативность", value: 25 },
    ] as Skill[],
  });

  const [groups] = useState<Group[]>([
    {
      id: "1",
      group_name: "Младшая группа (7-9 лет)",
      teacher_name: "Иван Иванов",
      current_students: 8,
      max_students: 12,
      schedule: "Пн, Ср 15:00-16:30",
    },
    {
      id: "2",
      group_name: "Средняя группа (10-12 лет)",
      teacher_name: "Петр Петров",
      current_students: 10,
      max_students: 10,
      schedule: "Вт, Чт 16:00-17:30",
    },
  ]);

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner": return "Начальный";
      case "intermediate": return "Средний";
      case "advanced": return "Продвинутый";
      default: return level;
    }
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
                <Text style={{ flex: 1, fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white" }}>
                  Детали курса
                </Text>
                <TouchableOpacity
                  onPress={() => router.push(`/organization/course/${id}/edit` as any)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: RADIUS.md,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="edit-2" size={18} color="white" />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: "white", marginBottom: 8 }}>
                  {course.title}
                </Text>
                <View style={{ flexDirection: "row", gap: SPACING.sm }}>
                   <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: SPACING.lg, paddingVertical: 4, borderRadius: RADIUS.md }}>
                      <Text style={{ color: "white", fontSize: 11, fontWeight: TYPOGRAPHY.weight.bold }}>{getLevelLabel(course.level).toUpperCase()}</Text>
                   </View>
                   <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: SPACING.lg, paddingVertical: 4, borderRadius: RADIUS.md }}>
                      <Text style={{ color: "white", fontSize: 11, fontWeight: TYPOGRAPHY.weight.bold }}>{course.price.toLocaleString()} ₸ / МЕС</Text>
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
        {/* Description */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md }}>
              <Feather name="book-open" size={18} color={COLORS.primary} />
              <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>Описание</Text>
           </View>
           <Text style={{ fontSize: TYPOGRAPHY.size.md, color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.medium, lineHeight: 24, opacity: 0.8 }}>{course.description}</Text>
        </View>

        {/* Skills */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
           <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: SPACING.lg }}>Развиваемые навыки</Text>
           <View style={{ gap: SPACING.sm }}>
              {course.skills.map((skill, index) => (
                <View key={index} style={{ backgroundColor: 'rgba(108, 92, 231, 0.05)', padding: SPACING.lg, borderRadius: RADIUS.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(108, 92, 231, 0.1)' }}>
                   <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.bold }}>{skill.name}</Text>
                   <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.bold }}>+{skill.value}%</Text>
                </View>
              ))}
           </View>
        </View>

        {/* Groups */}
        <View style={{ marginBottom: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
           <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>Группы курса</Text>
           <TouchableOpacity onPress={() => router.push(`/organization/group/create?courseId=${id}` as any)}>
              <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.bold }}>+ Добавить</Text>
           </TouchableOpacity>
        </View>

        <View style={{ gap: SPACING.sm }}>
           {groups.map((group) => (
             <TouchableOpacity
                key={group.id}
                onPress={() => router.push(`/organization/group/${group.id}` as any)}
                style={{ ...SHADOWS.sm, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}
             >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md }}>
                   <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: 4 }}>{group.group_name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                         <Feather name="award" size={12} color={COLORS.mutedForeground} />
                         <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.medium }}>{group.teacher_name || "Не назначен"}</Text>
                      </View>
                   </View>
                   <View style={{ backgroundColor: COLORS.background, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: RADIUS.lg, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Feather name="users" size={12} color={COLORS.primary} />
                      <Text style={{ fontSize: 12, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{group.current_students}/{group.max_students}</Text>
                   </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                   <Feather name="clock" size={14} color={COLORS.mutedForeground} />
                   <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.medium }}>{group.schedule}</Text>
                </View>
             </TouchableOpacity>
           ))}
        </View>
      </ScrollView>
    </View>
  );
}
