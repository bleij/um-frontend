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

const MOCK_TASKS = [
  {
    id: "1",
    title: "Нарисовать пейзаж",
    club: "Художественная студия",
    clubId: "art",
    assignedTo: "Все ученики",
    dueDate: "28 фев 2026",
    xp: 50,
    completed: 12,
    total: 18,
  },
  {
    id: "2",
    title: "Техника ведения мяча",
    club: "Футбол",
    clubId: "football",
    assignedTo: "Все ученики",
    dueDate: "1 мар 2026",
    xp: 45,
    completed: 18,
    total: 24,
  },
  {
    id: "3",
    title: "Создать простую программу",
    club: "Программирование",
    clubId: "coding",
    assignedTo: "Все ученики",
    dueDate: "2 мар 2026",
    xp: 60,
    completed: 8,
    total: 15,
  },
];

const CLUBS = [
  { id: "all", name: "Все кружки" },
  { id: "art", name: "Художественная студия" },
  { id: "football", name: "Футбол" },
  { id: "coding", name: "Программирование" },
];

export default function OrgTasks() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;
  const [selectedClub, setSelectedClub] = useState("all");

  const filtered =
    selectedClub === "all"
      ? MOCK_TASKS
      : MOCK_TASKS.filter((t) => t.clubId === selectedClub);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header - Unified Brand Style */}
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: SPACING.xl }}
        >
          <SafeAreaView edges={["top"]}>
            <View style={{ paddingHorizontal: paddingX, paddingTop: SPACING.md }}>
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
                <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white", flex: 1 }}>Задания</Text>
                <TouchableOpacity
                  onPress={() => router.push("/organization/task/create" as any)}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingHorizontal: SPACING.lg,
                    height: 44,
                    borderRadius: RADIUS.md,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 13 }}>+ СОЗДАТЬ</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1">
                {CLUBS.map((club) => (
                  <TouchableOpacity
                    key={club.id}
                    onPress={() => setSelectedClub(club.id)}
                    style={{
                      paddingHorizontal: SPACING.lg,
                      paddingVertical: 10,
                      borderRadius: RADIUS.md,
                      marginRight: SPACING.sm,
                      backgroundColor: selectedClub === club.id ? "white" : "rgba(255,255,255,0.15)",
                      borderWidth: 1,
                      borderColor: selectedClub === club.id ? "white" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    <Text style={{ color: selectedClub === club.id ? COLORS.primary : "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 13 }}>{club.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
        {filtered.map((task, idx) => {
          const percent = Math.round((task.completed / task.total) * 100);
          return (
            <MotiView
               key={task.id}
               from={{ opacity: 0, translateY: 20 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ delay: idx * 100 }}
            >
               <TouchableOpacity
                  style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border }}
               >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg }}>
                     <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: 4 }}>{task.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                           <Feather name="book-open" size={12} color={COLORS.mutedForeground} />
                           <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.medium }}>{task.club}</Text>
                        </View>
                     </View>
                     <View style={{ backgroundColor: 'rgba(108, 92, 231, 0.05)', px: 12, py: 6, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: 'rgba(108, 92, 231, 0.1)' }}>
                        <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.bold, fontSize: 11 }}>+{task.xp} XP</Text>
                     </View>
                  </View>

                  <View style={{ backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl }}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                           <Feather name="users" size={12} color={COLORS.mutedForeground} />
                           <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1 }}>Кому</Text>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{task.assignedTo}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                           <Feather name="clock" size={12} color={COLORS.mutedForeground} />
                           <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1 }}>Срок</Text>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{task.dueDate}</Text>
                     </View>
                  </View>

                  <View style={{ marginBottom: SPACING.xl }}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                        <Text style={{ fontSize: TYPOGRAPHY.size.xs, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>Прогресс выполнения</Text>
                        <Text style={{ fontSize: TYPOGRAPHY.size.xs, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{task.completed}/{task.total}</Text>
                     </View>
                     <View style={{ h: 6, bg: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden' }}>
                        <View style={{ width: `${percent}%`, h: 'full', bg: COLORS.primary }} />
                     </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: SPACING.md }}>
                     <TouchableOpacity style={{ flex: 1, height: 48, backgroundColor: 'rgba(108, 92, 231, 0.1)', borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.bold, fontSize: 14 }}>ПОДРОБНЕЕ</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={{ width: 48, height: 48, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <Feather name="trash-2" size={18} color={COLORS.destructive} />
                     </TouchableOpacity>
                  </View>
               </TouchableOpacity>
            </MotiView>
          );
        })}
      </ScrollView>
    </View>
  );
}

