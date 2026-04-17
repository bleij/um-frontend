import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS, SHADOWS, TYPOGRAPHY } from "../../constants/theme";

export default function TeacherHome() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
    >
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>
          Моё расписание
        </Text>
        <Text style={{ fontSize: TYPOGRAPHY.size.md, color: COLORS.mutedForeground, marginTop: 4 }}>
          {new Date().toLocaleDateString("ru-RU", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        {/* Next Lesson Alert */}
        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: RADIUS.lg,
            padding: 20,
            ...SHADOWS.md,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Feather name="alert-circle" size={20} color="white" />
              <Text style={{ fontWeight: "600", color: "white" }}>Следующий урок</Text>
            </View>
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full }}>
              <Text style={{ fontSize: 12, color: "white", fontWeight: "600" }}>Через 45 мин</Text>
            </View>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "white", marginBottom: 8 }}>
            Основы программирования
          </Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Feather name="clock" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>14:00 - 15:30</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Feather name="map-pin" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Аудитория 12</Text>
            </View>
          </View>
        </View>

        {/* QR Scanner Button Placeholder */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: COLORS.card,
            borderRadius: RADIUS.lg,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: RADIUS.md,
                backgroundColor: `${COLORS.primary}15`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="maximize" size={28} color={COLORS.primary} />
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.foreground }}>Сканер QR</Text>
              <Text style={{ fontSize: 14, color: COLORS.mutedForeground, marginTop: 4 }}>Активация новых учеников</Text>
            </View>
          </View>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: COLORS.muted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="arrow-right" size={16} color={COLORS.mutedForeground} />
          </View>
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.foreground, marginTop: 8 }}>
          Уроки на сегодня
        </Text>

        {/* Mock lessons */}
        {[
          { id: 1, title: 'Основы программирования', group: 'Группа Python-1', time: '14:00', loc: 'Ауд. 12' },
          { id: 2, title: 'Web-разработка', group: 'Группа Frontend-2', time: '16:00', loc: 'Ауд. 14' }
        ].map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            activeOpacity={0.8}
            style={{
              backgroundColor: COLORS.card,
              borderRadius: RADIUS.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.foreground, marginBottom: 4 }}>
                  {lesson.title}
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.mutedForeground }}>{lesson.group}</Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: "700", color: COLORS.primary, marginLeft: 16 }}>
                {lesson.time}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Feather name="map-pin" size={14} color={COLORS.mutedForeground} />
              <Text style={{ fontSize: 14, color: COLORS.mutedForeground }}>{lesson.loc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
