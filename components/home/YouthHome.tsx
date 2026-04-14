import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../constants/theme";

const NAV_ITEMS = [
  { label: "Мои цели", icon: "target" as const, route: "/(tabs)/youth/goals" },
  {
    label: "Календарь",
    icon: "calendar" as const,
    route: "/(tabs)/parent/calendar",
  },
  { label: "Ментор", icon: "message-circle" as const, route: "/(tabs)/chats" },
  {
    label: "Прогресс",
    icon: "trending-up" as const,
    route: "/(tabs)/analytics",
  },
];

const ACHIEVEMENTS = [
  { label: "Художник", icon: "edit-3" as const },
  { label: "Спортсмен", icon: "activity" as const },
  { label: "Программист", icon: "code" as const },
  { label: "Секрет", icon: "lock" as const, locked: true },
];

export default function YouthHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;
  const firstName = "Ученик";

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 20,
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
            {/* Profile Card */}
            <View
              style={{
                backgroundColor: COLORS.card,
                padding: 20,
                borderRadius: RADIUS.lg,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginBottom: 20,
                ...SHADOWS.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: `${COLORS.primary}10`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Feather name="user" size={24} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: COLORS.foreground,
                    }}
                  >
                    Привет, {firstName}!
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    Level 5
                  </Text>
                </View>
              </View>

              {/* XP Bar */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    color: COLORS.primary,
                    fontSize: 13,
                  }}
                >
                  1250 XP
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.mutedForeground }}>
                  до Level 6: 250 XP
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor: COLORS.muted,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: "83%", height: "100%", borderRadius: 3 }}
                />
              </View>
            </View>

            {/* Navigation Buttons */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => router.push(item.route as any)}
                  style={{
                    width: "48%",
                    marginBottom: 12,
                    backgroundColor: COLORS.card,
                    borderRadius: RADIUS.lg,
                    padding: 20,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    ...SHADOWS.sm,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      backgroundColor: `${COLORS.primary}10`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Feather
                      name={item.icon}
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: COLORS.foreground,
                      textAlign: "center",
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Achievements */}
            <View
              style={{
                backgroundColor: COLORS.card,
                padding: 20,
                borderRadius: RADIUS.lg,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginBottom: 20,
                ...SHADOWS.sm,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Feather name="award" size={18} color={COLORS.accent} />
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 16,
                    color: COLORS.foreground,
                    marginLeft: 8,
                  }}
                >
                  Последние достижения
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                {ACHIEVEMENTS.map((ach) => (
                  <View
                    key={ach.label}
                    style={{
                      alignItems: "center",
                      opacity: ach.locked ? 0.35 : 1,
                    }}
                  >
                    <LinearGradient
                      colors={
                        ach.locked
                          ? [COLORS.muted, COLORS.muted]
                          : [COLORS.primary, COLORS.secondary]
                      }
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Feather
                        name={ach.icon}
                        size={22}
                        color={ach.locked ? COLORS.mutedForeground : "white"}
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "500",
                        color: COLORS.foreground,
                      }}
                    >
                      {ach.label}
                    </Text>
                  </View>
                ))}
              </View>
              <Pressable
                onPress={() => router.push("/(tabs)/youth/achievements" as any)}
                style={{
                  width: "100%",
                  paddingVertical: 12,
                  backgroundColor: `${COLORS.primary}10`,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                  Смотреть все
                </Text>
              </Pressable>
            </View>

            {/* Today's Tasks */}
            <View
              style={{
                backgroundColor: COLORS.card,
                padding: 20,
                borderRadius: RADIUS.lg,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginBottom: 20,
                ...SHADOWS.sm,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Feather name="check-square" size={18} color={COLORS.primary} />
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 16,
                    color: COLORS.foreground,
                    marginLeft: 8,
                  }}
                >
                  Задания на сегодня
                </Text>
              </View>

              {/* Completed task */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  backgroundColor: `${COLORS.primary}08`,
                  borderRadius: 14,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: COLORS.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="check" size={14} color="white" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 14,
                    textDecorationLine: "line-through",
                    color: COLORS.mutedForeground,
                  }}
                >
                  Нарисовать пейзаж
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: COLORS.primary,
                  }}
                >
                  +50 XP
                </Text>
              </View>

              {/* Pending task */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  backgroundColor: COLORS.card,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: `${COLORS.primary}15`,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: COLORS.card,
                    borderWidth: 2,
                    borderColor: COLORS.border,
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 14,
                    fontWeight: "500",
                    color: COLORS.foreground,
                  }}
                >
                  Сделать домашнее задание
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: COLORS.mutedForeground,
                  }}
                >
                  +40 XP
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/(tabs)/youth/tasks" as any)}
                style={{
                  width: "100%",
                  paddingVertical: 12,
                  backgroundColor: `${COLORS.primary}10`,
                  borderRadius: 14,
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                  Все задания
                </Text>
              </Pressable>
            </View>

            {/* Motivational Card */}
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={{ padding: 20, borderRadius: RADIUS.lg, ...SHADOWS.lg }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Feather name="star" size={28} color={COLORS.accent} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      fontWeight: "700",
                      color: "white",
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  >
                    Отличная работа!
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 18,
                    }}
                  >
                    Ты выполнил уже 15 заданий на этой неделе! Продолжай в том
                    же духе!
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
