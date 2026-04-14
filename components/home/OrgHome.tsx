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

const STATS = [
  { label: "Кружков", value: "8", icon: "book-open" as const },
  { label: "Учеников", value: "124", icon: "users" as const },
  { label: "Заявок", value: "15", icon: "clipboard" as const },
  { label: "Посещ.", value: "92%", icon: "bar-chart-2" as const },
];

const CLUBS = [
  { id: "1", name: "Художественная студия", students: 18 },
  { id: "2", name: "Футбольная школа", students: 24 },
  { id: "3", name: "Программирование", students: 15 },
  { id: "4", name: "Музыкальная школа", students: 20 },
];

const QUICK_ACTIONS = [
  {
    label: "Заявки",
    icon: "clipboard" as const,
    badge: 15,
    route: "/(tabs)/organization/applications",
  },
  {
    label: "Расписание",
    icon: "calendar" as const,
    badge: 0,
    route: "/(tabs)/organization/schedule",
  },
  {
    label: "Посещаемость",
    icon: "check-square" as const,
    badge: 0,
    route: "/(tabs)/organization/attendance",
  },
  {
    label: "Задания",
    icon: "file-text" as const,
    badge: 0,
    route: "/(tabs)/organization/tasks",
  },
  {
    label: "Отчёты",
    icon: "bar-chart-2" as const,
    badge: 0,
    route: "/(tabs)/analytics",
  },
  {
    label: "Ученики",
    icon: "users" as const,
    badge: 0,
    route: "/(tabs)/organization/students",
  },
];

export default function OrgHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;

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
            <View
              style={{
                paddingTop: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 22, fontWeight: "800", color: "white" }}
                >
                  Панель управления
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  Центр детского развития «Звёздочка»
                </Text>
              </View>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                <Feather name="briefcase" size={22} color="white" />
              </View>
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
          {/* Stats Grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {STATS.map((stat) => (
              <View
                key={stat.label}
                style={{
                  width: "47%",
                  backgroundColor: COLORS.card,
                  borderRadius: RADIUS.lg,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  ...SHADOWS.sm,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: `${COLORS.primary}10`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Feather name={stat.icon} size={20} color={COLORS.primary} />
                </View>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color: COLORS.foreground,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.mutedForeground,
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: COLORS.foreground,
              marginBottom: 12,
            }}
          >
            Быстрые действия
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {QUICK_ACTIONS.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.route as any)}
                style={{
                  width: "47%",
                  backgroundColor: COLORS.card,
                  borderRadius: RADIUS.lg,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  position: "relative",
                  ...SHADOWS.sm,
                }}
              >
                <Feather
                  name={item.icon}
                  size={24}
                  color={COLORS.primary}
                  style={{ marginBottom: 8 }}
                />
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 14,
                    color: COLORS.foreground,
                  }}
                >
                  {item.label}
                </Text>
                {item.badge > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 12,
                      backgroundColor: COLORS.destructive,
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    >
                      {item.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* My Clubs */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: COLORS.foreground,
              }}
            >
              Мои кружки
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/organization/clubs" as any)}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                + Добавить
              </Text>
            </TouchableOpacity>
          </View>
          {CLUBS.map((club) => (
            <View
              key={club.id}
              style={{
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.sm,
                padding: 16,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.border,
                ...SHADOWS.sm,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: `${COLORS.primary}10`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Feather name="book-open" size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 14,
                    color: COLORS.foreground,
                  }}
                >
                  {club.name}
                </Text>
                <Text
                  style={{
                    color: COLORS.mutedForeground,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {club.students} учеников
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: `${COLORS.success}10`,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: COLORS.success,
                    fontWeight: "600",
                    fontSize: 12,
                  }}
                >
                  Активен
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
