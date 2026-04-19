import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS, SHADOWS, TYPOGRAPHY } from "../../../../constants/theme";
import { useGroupMembers } from "../../../../hooks/useMentorData";

type AttendanceStatus = "present" | "absent" | "late" | null;

const SKILLS = [
  { value: "leadership", label: "Лидерство", icon: "award" },
  { value: "logic", label: "Логика", icon: "cpu" },
  { value: "creativity", label: "Креативность", icon: "pen-tool" },
  { value: "communication", label: "Коммуникация", icon: "message-circle" },
  { value: "teamwork", label: "Командная работа", icon: "users" },
  { value: "problem_solving", label: "Решение задач", icon: "target" },
];

export default function TeacherGroupDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { members, loading } = useGroupMembers(id ?? null);

  const [activeTab, setActiveTab] = useState<"attendance" | "progress">("attendance");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [selectedSkill, setSelectedSkill] = useState("");
  const [progressNotes, setProgressNotes] = useState("");

  const todayDate = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  const toggleAttendance = (studentId: string) => {
    setAttendanceData((prev) => {
      const current = prev[studentId];
      let next: AttendanceStatus = "present";
      if (current === "present") next = "late";
      else if (current === "late") next = "absent";
      return { ...prev, [studentId]: next };
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <Feather name="arrow-left" size={20} color={COLORS.mutedForeground} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: COLORS.mutedForeground }}>Назад</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}>
            <Feather name="users" size={24} color="white" />
          </View>
          <View>
            <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>Управление группой</Text>
            <Text style={{ color: COLORS.mutedForeground }}>
              {loading ? "Загрузка..." : `${members.length} учеников`}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => setActiveTab("attendance")}
            style={{ flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: RADIUS.md, backgroundColor: activeTab === "attendance" ? COLORS.primary : COLORS.muted }}
          >
            <Text style={{ fontWeight: "600", color: activeTab === "attendance" ? "white" : COLORS.mutedForeground }}>Посещаемость</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("progress")}
            style={{ flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: RADIUS.md, backgroundColor: activeTab === "progress" ? COLORS.primary : COLORS.muted }}
          >
            <Text style={{ fontWeight: "600", color: activeTab === "progress" ? "white" : COLORS.mutedForeground }}>Фидбэк (Прогресс)</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {activeTab === "attendance" && (
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ color: COLORS.mutedForeground, fontSize: 14 }}>Дата</Text>
                <Text style={{ fontWeight: "600", fontSize: 16, color: COLORS.foreground }}>{todayDate}</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: RADIUS.md }}>
                <Text style={{ color: "white", fontWeight: "600" }}>Сохранить</Text>
              </TouchableOpacity>
            </View>

            {members.map((member) => {
              const status = attendanceData[member.id];
              return (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => toggleAttendance(member.id)}
                  activeOpacity={0.8}
                  style={{ backgroundColor: COLORS.card, padding: 16, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>{member.student_name.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={{ fontWeight: "600", fontSize: 16, color: COLORS.foreground }}>{member.student_name}</Text>
                      {member.student_age && (
                        <Text style={{ color: COLORS.mutedForeground, fontSize: 12 }}>{member.student_age} лет</Text>
                      )}
                    </View>
                  </View>
                  <View style={{
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full,
                    backgroundColor: status === "present" ? "#DCFCE7" : status === "late" ? "#FEF9C3" : status === "absent" ? "#FEE2E2" : COLORS.muted
                  }}>
                    <Text style={{
                      fontSize: 12, fontWeight: "600",
                      color: status === "present" ? "#166534" : status === "late" ? "#854D0E" : status === "absent" ? "#991B1B" : COLORS.mutedForeground
                    }}>
                      {status === "present" ? "Присутствует" : status === "late" ? "Опоздал" : status === "absent" ? "Отсутствует" : "Не отмечен"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {activeTab === "progress" && (
          <View style={{ gap: 16 }}>
            {!selectedStudent ? (
              <>
                <Text style={{ color: COLORS.mutedForeground, fontSize: 14 }}>Выберите ученика для фидбэка (оценки прогресса)</Text>
                {members.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => setSelectedStudent(member)}
                    style={{ backgroundColor: COLORS.card, padding: 16, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>{member.student_name.charAt(0)}</Text>
                      </View>
                      <View>
                        <Text style={{ fontWeight: "600", fontSize: 16, color: COLORS.foreground }}>{member.student_name}</Text>
                        {member.student_age && (
                          <Text style={{ color: COLORS.mutedForeground, fontSize: 12 }}>{member.student_age} лет</Text>
                        )}
                      </View>
                    </View>
                    <Feather name="trending-up" size={20} color={COLORS.mutedForeground} />
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={{ gap: 16 }}>
                <View style={{ backgroundColor: COLORS.primary, padding: 16, borderRadius: RADIUS.lg }}>
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>{selectedStudent.student_name}</Text>
                  {selectedStudent.student_age && (
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>{selectedStudent.student_age} лет</Text>
                  )}
                  <TouchableOpacity onPress={() => setSelectedStudent(null)} style={{ marginTop: 8 }}>
                    <Text style={{ color: "white", textDecorationLine: "underline" }}>Выбрать другого ученика</Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ fontWeight: "600", color: COLORS.foreground }}>Выберите навык или достижение:</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {SKILLS.map((skill) => (
                    <TouchableOpacity
                      key={skill.value}
                      onPress={() => setSelectedSkill(skill.value)}
                      style={{
                        width: "48%",
                        backgroundColor: selectedSkill === skill.value ? `${COLORS.primary}15` : COLORS.card,
                        padding: 16,
                        borderRadius: RADIUS.lg,
                        borderWidth: 2,
                        borderColor: selectedSkill === skill.value ? COLORS.primary : COLORS.border,
                        alignItems: "center",
                      }}
                    >
                      <Feather name={skill.icon as any} size={24} color={selectedSkill === skill.value ? COLORS.primary : COLORS.foreground} style={{ marginBottom: 8 }} />
                      <Text style={{ fontWeight: "600", color: selectedSkill === skill.value ? COLORS.primary : COLORS.foreground, textAlign: "center" }}>{skill.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ fontWeight: "600", color: COLORS.foreground, marginTop: 8 }}>Фидбэк (необязательно)</Text>
                <TextInput
                  value={progressNotes}
                  onChangeText={setProgressNotes}
                  placeholder="Например: Отлично справился с логической задачей"
                  placeholderTextColor={COLORS.mutedForeground}
                  style={{ backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 16, color: COLORS.foreground, minHeight: 100 }}
                  multiline
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  disabled={!selectedSkill}
                  style={{ backgroundColor: selectedSkill ? COLORS.primary : COLORS.muted, padding: 16, borderRadius: RADIUS.md, alignItems: "center" }}
                >
                  <Text style={{ color: selectedSkill ? "white" : COLORS.mutedForeground, fontWeight: "600", fontSize: 16 }}>Сохранить фидбэк</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
