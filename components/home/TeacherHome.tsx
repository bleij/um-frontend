import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function TeacherHome() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? 40 : 24;

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.topHeader}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={["top"]}>
            <View style={[styles.headerContent, { paddingHorizontal: paddingX }]}>
              <View>
                <Text style={styles.greeting}>Добрый день, Учитель!</Text>
                <Text style={styles.dateText}>{today}</Text>
              </View>
              <TouchableOpacity style={styles.notificationBtn}>
                <Feather name="bell" size={20} color="white" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </View>

            {/* Next Lesson High-Fidelity Widget */}
            <MotiView 
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={[styles.nextLessonCard, { marginHorizontal: paddingX }]}
            >
                <TouchableOpacity 
                    activeOpacity={0.9}
                    onPress={() => router.push("/teacher/group/group-001/journal" as any)}
                >
                    <View style={styles.nextLessonHeader}>
                        <View style={styles.nextTag}>
                            <Text style={styles.nextTagText}>СЛЕДУЮЩИЙ УРОК</Text>
                        </View>
                        <Text style={styles.timerText}>через 45 мин</Text>
                    </View>
                    
                    <Text style={styles.lessonTitle}>Основы программирования</Text>
                    <Text style={styles.groupSubtitle}>Группа Python-1 • Ауд. 12</Text>

                    <View style={styles.lessonFooter}>
                        <View style={styles.timeInfo}>
                            <Feather name="clock" size={16} color="white" />
                            <Text style={styles.timeText}>14:00 - 15:30</Text>
                        </View>
                        <View style={styles.startButton}>
                            <Text style={styles.startButtonText}>Начать</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </MotiView>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: paddingX }]}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
            <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push("/teacher/groups" as any)}
            >
                <View style={[styles.actionIcon, { backgroundColor: '#F5F3FF' }]}>
                    <Feather name="users" size={24} color="#6C5CE7" />
                </View>
                <Text style={styles.actionLabel}>Мои группы</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}>
                    <Feather name="maximize" size={24} color="#EA580C" />
                </View>
                <Text style={styles.actionLabel}>Сканер QR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
                    <Feather name="book-open" size={24} color="#059669" />
                </View>
                <Text style={styles.actionLabel}>Материалы</Text>
            </TouchableOpacity>
        </View>

        {/* Schedule List */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Расписание на сегодня</Text>
            <TouchableOpacity>
                <Text style={styles.seeAll}>Весь план</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.lessonList}>
            {[
                { id: 1, groupId: 'group-001', time: '14:00', title: 'Основы программирования', group: 'Группа Python-1', status: 'upcoming' },
                { id: 2, groupId: 'group-002', time: '16:00', title: 'Web-разработка', group: 'Группа Frontend-2', status: 'upcoming' },
                { id: 3, groupId: 'group-003', time: '18:00', title: 'Робототехника', group: 'Младшая группа', status: 'upcoming' },
            ].map((item, idx) => (
                <MotiView
                    key={item.id}
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 300 + idx * 100 }}
                    style={styles.scheduleItem}
                >
                    <View style={styles.timeColumn}>
                        <Text style={styles.scheduleTime}>{item.time}</Text>
                        <View style={styles.timeDot} />
                    </View>
                    <TouchableOpacity 
                        style={styles.scheduleCard}
                        onPress={() => router.push(`/teacher/group/${item.groupId}/journal` as any)}
                    >
                        <View style={styles.scheduleCardContent}>
                            <Text style={styles.scheduleTitle}>{item.title}</Text>
                            <Text style={styles.scheduleGroup}>{item.group}</Text>
                        </View>
                        <Feather name="chevron-right" size={18} color="#C7C7CC" />
                    </TouchableOpacity>
                </MotiView>
            ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
  },
  topHeader: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    elevation: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#6C5CE7",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
    }),
  },
  headerGradient: {
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "900",
    color: "white",
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "#6C5CE7",
  },
  nextLessonCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  nextLessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nextTag: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nextTagText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#6C5CE7",
  },
  timerText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  groupSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 16,
  },
  lessonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  startButtonText: {
    color: "#6C5CE7",
    fontWeight: "800",
    fontSize: 14,
  },
  scrollContent: {
    paddingTop: 32,
    paddingBottom: 100,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionCard: {
    alignItems: 'center',
    gap: 10,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.foreground,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  lessonList: {
    gap: 0,
  },
  scheduleItem: {
    flexDirection: 'row',
    gap: 16,
  },
  timeColumn: {
    alignItems: 'center',
    width: 45,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    borderWidth: 2,
    borderColor: 'white',
    ...SHADOWS.sm,
  },
  scheduleCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  scheduleCardContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  scheduleGroup: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    marginTop: 4,
  }
});
