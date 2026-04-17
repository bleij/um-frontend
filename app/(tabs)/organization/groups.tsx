import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

interface Group {
  id: string;
  group_name: string;
  course_title: string;
  status: "active" | "inactive";
  current_students: number;
  max_students: number;
  teacher_name?: string;
  schedule?: string;
}

const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    group_name: "Группа К-1",
    course_title: "Робототехника",
    status: "active",
    current_students: 12,
    max_students: 15,
    teacher_name: "Игорь Соколов",
    schedule: "Пн, Ср, Пт 15:00",
  },
  {
    id: "2",
    group_name: "Группа А-3",
    course_title: "Английский язык",
    status: "active",
    current_students: 8,
    max_students: 12,
    teacher_name: "Марина Иванова",
    schedule: "Вт, Чт 16:30",
  },
  {
    id: "3",
    group_name: "Группа Х-10",
    course_title: "Рисование",
    status: "inactive",
    current_students: 0,
    max_students: 20,
    teacher_name: "Анна Петрова",
    schedule: "Сб 11:00",
  },
];

export default function OrgGroupsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const [groups] = useState<Group[]>(MOCK_GROUPS);
  const [loading] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header - Unified Brand Style */}
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: SPACING.xl }}
        >
          <SafeAreaView edges={["top"]}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: paddingX, paddingTop: SPACING.md }}>
              <View>
                <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.bold, color: "white" }}>Группы</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium, marginTop: 2 }}>Всего групп: {groups.length}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/organization/group/create" as any)}
                style={{ width: 52, height: 52, borderRadius: RADIUS.md, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
              >
                <Feather name="plus" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingX,
          paddingTop: SPACING.xl,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
          </View>
        ) : groups.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border }}>
            <View style={{ width: 80, height: 80, backgroundColor: COLORS.background, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl }}>
              <Feather name="users" size={32} color={COLORS.mutedForeground} />
            </View>
            <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 8 }}>Нет групп</Text>
            <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 20 }}>Создайте первую группу для начала работы</Text>
            <TouchableOpacity onPress={() => router.push("/organization/group/create" as any)} style={{ backgroundColor: COLORS.primary, paddingHorizontal: 32, height: 56, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', ...SHADOWS.md }}>
               <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 16 }}>Создать группу</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: SPACING.lg }}>
            {groups.map((group, idx) => (
              <MotiView
                key={group.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: idx * 100 }}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/organization/group/${group.id}` as any)}
                  style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: 40, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: SPACING.xl }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: 4 }}>{group.group_name}</Text>
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.bold }}>{group.course_title}</Text>
                    </View>
                    <View style={{ px: 12, py: 6, borderRadius: RADIUS.lg, backgroundColor: group.status === 'active' ? 'rgba(52, 199, 89, 0.1)' : COLORS.background }}>
                      <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: group.status === 'active' ? COLORS.success : COLORS.mutedForeground }}>{group.status === 'active' ? 'АКТИВНА' : 'НЕАКТИВНА'}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: SPACING.sm, marginBottom: SPACING.xl }}>
                    <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Feather name="users" size={14} color={COLORS.mutedForeground} />
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.medium }}>{group.current_students}/{group.max_students}</Text>
                    </View>
                    <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Feather name="award" size={14} color={COLORS.mutedForeground} />
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.medium }}>{group.teacher_name || "Не назначен"}</Text>
                    </View>
                    {group.schedule && (
                      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Feather name="clock" size={14} color={COLORS.mutedForeground} />
                        <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.medium }}>{group.schedule}</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => router.push(`/organization/group/${group.id}` as any)}
                    style={{ height: 48, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.bold, fontSize: 14 }}>ПОДРОБНЕЕ</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
