import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS, SHADOWS, TYPOGRAPHY } from "../../../constants/theme";
import { useMentorGroups } from "../../../hooks/useMentorData";

export default function TeacherGroups() {
  const router = useRouter();
  const { groups, loading } = useMentorGroups();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
    >
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>
          Мои группы
        </Text>
        <Text style={{ fontSize: TYPOGRAPHY.size.md, color: COLORS.mutedForeground, marginTop: 4 }}>
          {loading ? "Загрузка..." : `${groups.length} ${groups.length === 1 ? "группа" : "групп"}`}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/teacher/group/${group.id}` as any)}
            style={{
              backgroundColor: COLORS.card,
              borderRadius: RADIUS.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.foreground, marginBottom: 4 }}>
                  {group.name}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "500", color: COLORS.primary }}>
                  {group.course}
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color={COLORS.mutedForeground} />
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Feather name="users" size={14} color={COLORS.mutedForeground} />
                <Text style={{ fontSize: 14, color: COLORS.mutedForeground }}>
                  {group.student_count} / {group.max_students} учеников
                </Text>
              </View>
              {group.schedule && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Feather name="clock" size={14} color={COLORS.mutedForeground} />
                  <Text style={{ fontSize: 14, color: COLORS.mutedForeground }}>{group.schedule}</Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{
                backgroundColor: group.active ? "#DCFCE7" : COLORS.muted,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: RADIUS.full,
              }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: group.active ? "#166534" : COLORS.mutedForeground }}>
                  {group.active ? "Активна" : "Неактивна"}
                </Text>
              </View>

              {group.student_count >= group.max_students && (
                <View style={{ backgroundColor: "#FEF9C3", paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#854D0E" }}>Группа заполнена</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
