import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationsModal } from "../../app/(tabs)/layout-container";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../constants/theme";
import { useParentData } from "../../contexts/ParentDataContext";
import { courses } from "../../data/courses";

export default function ParentHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;
  const {
    childrenProfile: children,
    activeChildId,
    setActiveChildId,
  } = useParentData();

  const activeChild =
    children.find((child) => child.id === activeChildId) || children[0] || null;

  const recommendations = useMemo(() => {
    if (!activeChild) return [];

    return courses.slice(0, 3).map((course, index) => ({
      id: String(course.id),
      title: course.title,
      age: course.age,
      for: activeChild.name,
      rating: (4.6 + index * 0.1).toFixed(1),
    }));
  }, [activeChild]);

  const upcomingClasses: any[] = [];
  const headingColor = "rgba(255,255,255,0.96)";
  const subHeadingColor = "rgba(255,255,255,0.72)";
  const cardOnGradient = "rgba(255,255,255,0.94)";
  const borderOnGradient = "rgba(255,255,255,0.22)";

  return (
    <LinearGradient
      colors={[COLORS.gradientFrom, COLORS.gradientTo]}
      style={{ flex: 1 }}
    >
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {!isDesktop && (
          <View
            style={{
              width: "100%",
              paddingHorizontal: horizontalPadding,
              paddingTop: 6,
              paddingBottom: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 48,
                lineHeight: 50,
                fontWeight: "700",
                letterSpacing: -1,
              }}
            >
              UM
            </Text>

            <Pressable
              onPress={() => setNotificationsVisible(true)}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: "rgba(255,255,255,0.17)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="bell" size={22} color="white" />
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "white",
                  opacity: 0.9,
                }}
              />
            </Pressable>
          </View>
        )}

        <ScrollView
          contentContainerStyle={{
            paddingTop: 14,
            paddingBottom: isDesktop ? 32 : 100,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: isDesktop ? LAYOUT.dashboardMaxWidth : undefined,
              paddingHorizontal: horizontalPadding,
            }}
          >
            {/* Children Cards */}
            <View style={{ marginBottom: 28 }}>
              <Pressable
                onPress={() => router.push("/parent/children" as any)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontWeight: "700",
                    fontSize: 18,
                    color: headingColor,
                  }}
                >
                  Мои дети
                </Text>
                <Feather name="chevron-right" size={18} color={headingColor} />
              </Pressable>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {children.map((child) => (
                  <Pressable
                    key={child.id}
                    onPress={() => {
                      setActiveChildId(child.id);
                      router.push(`/parent/child/${child.id}` as any);
                    }}
                    style={{
                      marginRight: 12,
                      width: 130,
                      padding: 16,
                      backgroundColor: cardOnGradient,
                      borderRadius: RADIUS.lg,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor:
                        activeChildId === child.id
                          ? COLORS.primary
                          : borderOnGradient,
                      ...SHADOWS.md,
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
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.primary,
                          fontWeight: "700",
                          fontSize: 20,
                        }}
                      >
                        {child.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: COLORS.foreground,
                        textAlign: "center",
                        marginBottom: 4,
                      }}
                    >
                      {child.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: COLORS.mutedForeground,
                        marginBottom: 8,
                      }}
                    >
                      {child.age} лет
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 12,
                        backgroundColor: child.talentProfile
                          ? `${COLORS.success}15`
                          : `${COLORS.destructive}15`,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "600",
                          color: child.talentProfile
                            ? COLORS.success
                            : COLORS.destructive,
                        }}
                      >
                        {child.talentProfile ? "Тест пройден" : "Нужен тест"}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* AI Recommendations */}
            <View style={{ marginBottom: 28 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 18,
                      color: headingColor,
                    }}
                  >
                    Рекомендации AI
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: subHeadingColor,
                      marginTop: 2,
                    }}
                  >
                    Основаны на диагностике
                  </Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendations.map((rec) => (
                  <Pressable
                    key={rec.id}
                    onPress={() =>
                      router.push(`/(tabs)/parent/club/${rec.id}` as any)
                    }
                    style={{
                      marginRight: 12,
                      width: 240,
                      backgroundColor: cardOnGradient,
                      borderRadius: RADIUS.lg,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: borderOnGradient,
                      ...SHADOWS.md,
                    }}
                  >
                    <View
                      style={{
                        height: 120,
                        backgroundColor: COLORS.muted,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Feather
                        name="book-open"
                        size={32}
                        color={COLORS.mutedForeground}
                      />
                      <View
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255,255,255,0.95)",
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 12,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Feather name="star" size={11} color={COLORS.accent} />
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "600",
                            marginLeft: 3,
                            color: COLORS.foreground,
                          }}
                        >
                          {rec.rating}
                        </Text>
                      </View>
                    </View>
                    <View style={{ padding: 14 }}>
                      <Text
                        style={{
                          fontWeight: "600",
                          color: COLORS.foreground,
                          marginBottom: 4,
                          lineHeight: 20,
                        }}
                      >
                        {rec.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: COLORS.mutedForeground,
                          marginBottom: 8,
                        }}
                      >
                        {rec.age}
                      </Text>
                      <View
                        style={{
                          backgroundColor: `${COLORS.primary}10`,
                          alignSelf: "flex-start",
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: COLORS.primary,
                            fontWeight: "500",
                          }}
                        >
                          Для: {rec.for}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Upcoming Classes */}
            <View style={{ marginBottom: 28 }}>
              <Pressable
                onPress={() => router.push("/(tabs)/parent/calendar" as any)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontWeight: "700",
                    fontSize: 18,
                    color: headingColor,
                  }}
                >
                  Ближайшие занятия
                </Text>
                <Feather name="chevron-right" size={18} color={headingColor} />
              </Pressable>
              {upcomingClasses.length > 0 ? (
                <View />
              ) : (
                <View
                  style={{
                    backgroundColor: cardOnGradient,
                    padding: 32,
                    borderRadius: RADIUS.lg,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: borderOnGradient,
                    ...SHADOWS.sm,
                  }}
                >
                  <Feather
                    name="calendar"
                    size={32}
                    color={COLORS.mutedForeground}
                    style={{ marginBottom: 12 }}
                  />
                  <Text
                    style={{
                      color: COLORS.mutedForeground,
                      textAlign: "center",
                      fontWeight: "500",
                      marginBottom: 12,
                    }}
                  >
                    Нет запланированных занятий
                  </Text>
                  <Pressable onPress={() => router.push("/catalog")}>
                    <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                      Выбрать кружок
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
    </LinearGradient>
  );
}
