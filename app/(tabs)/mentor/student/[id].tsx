import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../../constants/theme";
import { useMentorStudents } from "../../../../hooks/useMentorData";

export default function MentorStudentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? 40 : 20;

  const { students, loading } = useMentorStudents();
  const student = students.find((s) => s.id === (id as string)) || students[0];

  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ученик не найден</Text>
      </View>
    );
  }

  // Mock data additions for high-fidelity
  const studentDetails = {
    parentName: 'Айгуль Нурмуханбетова',
    parentPhone: '+7 (701) 234-56-78',
    city: 'Алматы',
    school: 'Гимназия №159',
    grade: '7 класс',
    subjects: ['Креативность', 'Коммуникация'],
    goals: 'Развитие творческого мышления и уверенности в публичных выступлениях',
    notes: 'Активный и любознательный ребенок. Хорошо воспринимает информацию через практические задания.',
    skills: [
        { label: 'Креативность', value: 75, color: '#6C5CE7' },
        { label: 'Коммуникация', value: 60, color: '#A78BFA' },
        { label: 'Лидерство', value: 50, color: '#3B82F6' },
        { label: 'Критическое мышление', value: 70, color: '#10B981' },
    ],
    history: [
        { id: 1, date: '12 апр', subject: 'Креативность', duration: '60 мин', rating: 5 },
        { id: 2, date: '10 апр', subject: 'Коммуникация', duration: '60 мин', rating: 5 },
        { id: 3, date: '08 апр', subject: 'Креативность', duration: '60 мин', rating: 4 },
    ]
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={styles.header}>
            <SafeAreaView edges={["top"]}>
                <View style={[styles.headerTop, { paddingHorizontal: paddingX }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Профиль ученика</Text>
                    <TouchableOpacity style={styles.editBtn}>
                        <Feather name="edit-3" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <MotiView 
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={[styles.profileCard, { marginHorizontal: paddingX }]}
                >
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarBox}>
                            <Text style={styles.avatarText}>{student.student_name.charAt(0)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.studentName}>{student.student_name}</Text>
                            <Text style={styles.studentGrade}>{studentDetails.grade} • {studentDetails.school}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>8</Text>
                            <Text style={styles.statLabel}>Сессий</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{student.progress}%</Text>
                            <Text style={styles.statLabel}>Прогресс</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                            <Text style={styles.statLabel}>Отличник</Text>
                        </View>
                    </View>
                </MotiView>
            </SafeAreaView>
        </LinearGradient>

        <View style={[styles.content, { paddingHorizontal: paddingX }]}>
            {/* Contact Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Контакты родителя</Text>
                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <Feather name="user" size={18} color="#6C5CE7" />
                        <Text style={styles.infoText}>{studentDetails.parentName}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Feather name="phone" size={18} color="#6C5CE7" />
                        <Text style={styles.infoText}>{studentDetails.parentPhone}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Feather name="map-pin" size={18} color="#6C5CE7" />
                        <Text style={styles.infoText}>{studentDetails.city}</Text>
                    </View>
                </View>
            </View>

            {/* Subjects & Goals */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Направления и цели</Text>
                <View style={styles.tagsRow}>
                    {studentDetails.subjects.map(sub => (
                        <View key={sub} style={styles.tag}>
                            <Text style={styles.tagText}>{sub}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.goalCard}>
                    <Text style={styles.goalText}>{studentDetails.goals}</Text>
                </View>
            </View>

            {/* Skills */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Развитие навыков</Text>
                <View style={styles.skillsCard}>
                    {studentDetails.skills.map((skill, idx) => (
                        <View key={skill.label} style={{ marginBottom: idx === studentDetails.skills.length - 1 ? 0 : 16 }}>
                            <View style={styles.skillHeader}>
                                <Text style={styles.skillLabel}>{skill.label}</Text>
                                <Text style={styles.skillValue}>{skill.value}%</Text>
                            </View>
                            <View style={styles.skillBarBg}>
                                <MotiView 
                                    from={{ width: 0 }}
                                    animate={{ width: `${skill.value}%` as any }}
                                    transition={{ duration: 1000, type: 'timing' }}
                                    style={[styles.skillBarFill, { backgroundColor: skill.color }]} 
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Session History */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>История сессий</Text>
                <View style={{ gap: 12 }}>
                    {studentDetails.history.map(session => (
                        <View key={session.id} style={styles.historyCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.historySubject}>{session.subject}</Text>
                                <Text style={styles.historyDate}>{session.date} • {session.duration}</Text>
                            </View>
                            <View style={styles.ratingRow}>
                                {[...Array(5)].map((_, i) => (
                                    <MaterialCommunityIcons 
                                        key={i} 
                                        name={i < session.rating ? "star" : "star-outline"} 
                                        size={16} 
                                        color="#FFD700" 
                                    />
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Notes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Заметки ментора</Text>
                <View style={styles.notesCard}>
                    <Text style={styles.notesText}>{studentDetails.notes}</Text>
                </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity style={styles.mainActionBtn}>
                <LinearGradient 
                    colors={["#6C5CE7", "#A78BFA"]} 
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.actionGradient}
                >
                    <Text style={styles.actionBtnText}>Начать сессию</Text>
                </LinearGradient>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 32,
    padding: 24,
    marginTop: 20,
    ...SHADOWS.lg,
  },
  profileHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F3FF",
    borderWidth: 4,
    borderColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#6C5CE7",
  },
  studentName: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.foreground,
  },
  studentGrade: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#F8F7FF",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#6C5CE7",
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    fontWeight: "600",
    marginTop: 2,
  },
  content: {
    paddingTop: 32,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.foreground,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    gap: 16,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.foreground,
    fontWeight: "500",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tagText: {
    color: "#6C5CE7",
    fontWeight: "700",
    fontSize: 13,
  },
  goalCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  goalText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.foreground,
  },
  skillsCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.foreground,
  },
  skillValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6C5CE7",
  },
  skillBarBg: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  historyCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  historySubject: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.foreground,
  },
  historyDate: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 2,
  },
  notesCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  notesText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#92400E",
  },
  mainActionBtn: {
    marginTop: 8,
    borderRadius: 20,
    overflow: "hidden",
    ...SHADOWS.md,
  },
  actionGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});
