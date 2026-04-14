import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../constants/theme";

const MOCK_STUDENTS = [
  {
    id: "1",
    name: "Анна Петрова",
    age: 8,
    level: 5,
    xp: 1250,
    progress: 85,
    skills: { com: 85, lead: 65, cre: 90, log: 75, dis: 70 },
  },
  {
    id: "2",
    name: "Максим Иванов",
    age: 14,
    level: 8,
    xp: 2450,
    progress: 78,
    skills: { com: 78, lead: 65, cre: 85, log: 80, dis: 72 },
  },
  {
    id: "3",
    name: "София Смирнова",
    age: 10,
    level: 6,
    xp: 1680,
    progress: 92,
    skills: { com: 90, lead: 75, cre: 88, log: 85, dis: 80 },
  },
];

const SKILL_LABELS = ["Ком.", "Лид.", "Кре.", "Лог.", "Дис."];

export default function MentorHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;
  const avgProgress = Math.round(
    MOCK_STUDENTS.reduce((s, st) => s + st.progress, 0) / MOCK_STUDENTS.length,
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={{
          paddingBottom: 28,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <SafeAreaView edges={["top"]}>
          <View
            style={{
              width: "100%",
              maxWidth: isDesktop ? LAYOUT.dashboardMaxWidth : undefined,
              alignSelf: "center",
              paddingHorizontal: horizontalPadding,
            }}
          >
            <View style={{ paddingTop: 12 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "white" }}>
                Мои подопечные
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                Ментор • Анна Сергеевна
              </Text>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: "row", marginTop: 16, gap: 10 }}>
              {[
                { label: "Учеников", value: `${MOCK_STUDENTS.length}` },
                { label: "Планов", value: "15" },
                { label: "Ср. прогресс", value: `${avgProgress}%` },
              ].map((stat) => (
                <View
                  key={stat.label}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 16,
                    padding: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  <Text
                    style={{ fontSize: 22, fontWeight: "800", color: "white" }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.8)",
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: 100,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: isDesktop ? LAYOUT.dashboardMaxWidth : undefined,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: COLORS.foreground,
              marginBottom: 12,
            }}
          >
            Список учеников
          </Text>

          {MOCK_STUDENTS.map((student) => {
            const skillVals = Object.values(student.skills);
            const maxSkill = Math.max(...skillVals);
            return (
              <TouchableOpacity
                key={student.id}
                onPress={() =>
                  router.push(`/(tabs)/mentor/student/${student.id}` as any)
                }
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: RADIUS.lg,
                  padding: 18,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  ...SHADOWS.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: `${COLORS.primary}10`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: COLORS.primary,
                      }}
                    >
                      {student.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 16,
                        color: COLORS.foreground,
                      }}
                    >
                      {student.name}
                    </Text>
                    <Text
                      style={{ color: COLORS.mutedForeground, fontSize: 13 }}
                    >
                      {student.age} лет
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 4,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: `${COLORS.primary}10`,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 20,
                          marginRight: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.primary,
                            fontSize: 11,
                            fontWeight: "600",
                          }}
                        >
                          Level {student.level}
                        </Text>
                      </View>
                      <Text
                        style={{ color: COLORS.mutedForeground, fontSize: 12 }}
                      >
                        {student.xp} XP
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: "800",
                        color: COLORS.primary,
                      }}
                    >
                      {student.progress}%
                    </Text>
                    <Text
                      style={{ fontSize: 11, color: COLORS.mutedForeground }}
                    >
                      Прогресс
                    </Text>
                  </View>
                </View>

                {/* Mini skill bars */}
                <View
                  style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}
                >
                  {skillVals.map((val, i) => (
                    <View key={i} style={{ flex: 1, alignItems: "center" }}>
                      <View
                        style={{
                          width: "100%",
                          height: 50,
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            height: (val / maxSkill) * 44,
                            backgroundColor: COLORS.primary,
                            borderRadius: 4,
                            opacity: 0.7 + (val / maxSkill) * 0.3,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 9,
                          color: COLORS.mutedForeground,
                          marginTop: 3,
                        }}
                      >
                        {SKILL_LABELS[i]}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push("/(tabs)/mentor/learning-path" as any)
                    }
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.primary,
                      borderRadius: 14,
                      paddingVertical: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather name="map" size={14} color="white" />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: 13,
                        marginLeft: 6,
                      }}
                    >
                      План развития
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/chats" as any)}
                    style={{
                      backgroundColor: `${COLORS.primary}10`,
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather
                      name="message-circle"
                      size={18}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Quick Stats */}
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: RADIUS.lg,
              padding: 18,
              borderWidth: 1,
              borderColor: COLORS.border,
              ...SHADOWS.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <Feather name="trending-up" size={18} color={COLORS.primary} />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: COLORS.foreground,
                  marginLeft: 8,
                }}
              >
                Общая статистика
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: `${COLORS.primary}10`,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: COLORS.primary,
                  }}
                >
                  42
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.mutedForeground,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  Рекомендаций
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: `${COLORS.success}10`,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: COLORS.success,
                  }}
                >
                  28
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.mutedForeground,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  Целей достигнуто
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
