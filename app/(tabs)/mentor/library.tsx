import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

const MOCK_MATERIALS = [
  { id: "1", title: "Введение в робототехнику", type: "Презентация", size: "2.4 MB", icon: "file-text" as const, color: COLORS.primary },
  { id: "2", title: "Основы программирования: Урок 1", type: "PDF", size: "1.1 MB", icon: "book" as const, color: COLORS.info },
  { id: "3", title: "Задания по логике (Блок 3)", type: "Документ", size: "0.8 MB", icon: "clipboard" as const, color: COLORS.warning },
  { id: "4", title: "Видео-урок: Сборка модели", type: "Видео", size: "45 MB", icon: "video" as const, color: COLORS.success },
];

export default function MentorLibrary() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: COLORS.primary }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: paddingX, paddingVertical: 16, gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
          >
            <Feather name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: "white" }}>База материалов</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: paddingX, paddingTop: 24, paddingBottom: 110 }}>
        <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: 16 }}>
          Учебные материалы
        </Text>

        <View style={{ gap: 12 }}>
          {MOCK_MATERIALS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={{
                ...SHADOWS.strict,
                backgroundColor: COLORS.surface,
                borderRadius: RADIUS.lg,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: RADIUS.md,
                  backgroundColor: item.color + "15",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Feather name={item.icon} size={22} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginTop: 2 }}>
                  {item.type} · {item.size}
                </Text>
              </View>
              <Feather name="download" size={18} color={COLORS.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
