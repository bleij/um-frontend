import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
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
import {
   COLORS,
   LAYOUT,
   RADIUS,
   SHADOWS,
   SPACING,
   TYPOGRAPHY,
} from "../../constants/theme";
import { useDevSettings } from "../../contexts/DevSettingsContext";

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
    age: 12,
    level: 8,
    xp: 2450,
    progress: 78,
    skills: { com: 78, lead: 65, cre: 85, log: 80, dis: 72 },
  },
];

const RECENT_FEEDBACKS = [
  {
    id: "1",
    date: "Сегодня, 14:30",
    teacher: "Смирнов (Шахматы)",
    student: "Максим Иванов",
    tag: "Быстро усвоил",
    text: "Отлично решил задачу, хотя отвлекался в начале.",
  },
  {
    id: "2",
    date: "Вчера, 18:00",
    teacher: "Соколов (Роботы)",
    student: "Анна Петрова",
    tag: "Проявила лидерство",
    text: "Собрала команду и руководила процессом сборки.",
  },
];

const SKILL_LABELS = ["Ком.", "Лид.", "Кре.", "Лог.", "Дис."];

export default function MentorHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : SPACING.xl;

  const { mentorApproved: isApproved } = useDevSettings();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        {/* Header - Restored Violet Aesthetic */}
        <View style={{ backgroundColor: COLORS.primary, overflow: "hidden" }}>
          <LinearGradient
            colors={COLORS.gradients.header as any}
            style={{ paddingTop: Platform.OS === "ios" ? 0 : 20 }}
          >
            <SafeAreaView edges={["top"]}>
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                style={{
                  paddingHorizontal: paddingX,
                  paddingTop: SPACING.md,
                  paddingBottom: SPACING.xxl,
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.xxxl,
                        fontWeight: TYPOGRAPHY.weight.semibold,
                        color: COLORS.white,
                        letterSpacing: TYPOGRAPHY.letterSpacing.tight,
                      }}
                    >
                      Привет, Анна Сергеевна!
                    </Text>
                    {isApproved && (
                      <View
                        style={{
                          backgroundColor: COLORS.info,
                          borderRadius: 12,
                          padding: 2,
                        }}
                      >
                        <Feather name="check" size={12} color="white" />
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: RADIUS.lg,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    <Feather name="bell" size={22} color={COLORS.white} />
                    <View
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        width: 12,
                        height: 12,
                        backgroundColor: COLORS.destructive,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: COLORS.white,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: TYPOGRAPHY.size.sm,
                      fontWeight: TYPOGRAPHY.weight.medium,
                    }}
                  >
                    Ожидается 4 занятия • Среда, 16 апр
                  </Text>

                  {/* Wallet Block */}
                  <TouchableOpacity className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 flex-row items-center gap-2">
                    <Feather name="credit-card" size={14} color="white" />
                    <Text className="text-white font-bold">45,000 ₸</Text>
                  </TouchableOpacity>
                </View>
              </MotiView>
            </SafeAreaView>
          </LinearGradient>
        </View>

        <View style={{ height: SPACING.xl }} />

        {/* Next Lesson Card - Squircle Aesthetic */}
        {!isApproved && (
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={{ paddingHorizontal: paddingX, marginBottom: 24 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                backgroundColor: COLORS.warning + "15",
                borderRadius: RADIUS.lg,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.warning + "30",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: RADIUS.md,
                  backgroundColor: COLORS.warning + "20",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="clock" size={20} color={COLORS.warning} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-gray-900">
                  Ваша заявка на рассмотрении
                </Text>
                <Text className="text-xs text-gray-500">
                  Дождитесь одобрения администратором для полного доступа ко
                  всем функциям.
                </Text>
              </View>
            </TouchableOpacity>
          </MotiView>
        )}

        <View
          style={{ paddingHorizontal: paddingX, opacity: isApproved ? 1 : 0.6 }}
          className="mb-8"
        >
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.lg,
                fontWeight: TYPOGRAPHY.weight.semibold,
                color: COLORS.foreground,
              }}
            >
              Ближайшее занятие
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/mentor/schedule" as any)}
            >
              <Text
                style={{
                  color: COLORS.info,
                  fontWeight: TYPOGRAPHY.weight.semibold,
                  fontSize: TYPOGRAPHY.size.sm,
                }}
              >
                См. всё
              </Text>
            </TouchableOpacity>
          </View>

          <MotiView
            from={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 500, delay: 100 }}
            style={{
              ...SHADOWS.strict,
              borderRadius: RADIUS.xxl,
              overflow: "hidden",
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.03)",
            }}
          >
            <LinearGradient
              colors={COLORS.gradients.primary as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: SPACING.xl }}
            >
              <View className="flex-row justify-between items-start mb-8">
                <View className="bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-md">
                  <Text className="text-white text-[10px] font-extrabold tracking-widest uppercase">
                    Live • через 15 мин
                  </Text>
                </View>
                <View className="bg-white/20 p-3 rounded-full border border-white/30">
                  <Feather name="zap" size={20} color="white" />
                </View>
              </View>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.size.huge,
                  fontWeight: TYPOGRAPHY.weight.bold,
                  color: COLORS.white,
                  marginBottom: SPACING.xs,
                  letterSpacing: TYPOGRAPHY.letterSpacing.tight,
                }}
              >
                Робототехника
              </Text>
              <View className="flex-row items-center mb-8 opacity-90">
                <Feather name="map-pin" size={14} color="white" />
                <Text className="text-white text-md font-medium ml-2">
                  Старшая группа A • Каб. 204
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  backgroundColor: COLORS.white,
                  height: 60,
                  borderRadius: RADIUS.full,
                  alignItems: "center",
                  justifyContent: "center",
                  ...SHADOWS.md,
                }}
                onPress={() => router.push("/mentor/group/1" as any)}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: TYPOGRAPHY.weight.bold,
                    fontSize: TYPOGRAPHY.size.lg,
                  }}
                >
                  Начать занятие
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </MotiView>
        </View>

        {/* SESSION REQUESTS (System Call Widget) */}
        <View
          style={{
            paddingHorizontal: paddingX,
            opacity: isApproved ? 1 : 0.5,
            pointerEvents: isApproved ? "auto" : "none",
          }}
          className="mb-8"
        >
          <View className="flex-row justify-between items-center mb-4 px-1">
            <View className="flex-row items-center gap-2">
              <Feather name="video" size={20} color={COLORS.primary} />
              <Text
                style={{
                  fontSize: TYPOGRAPHY.size.lg,
                  fontWeight: TYPOGRAPHY.weight.semibold,
                  color: COLORS.foreground,
                }}
              >
                Ежемесячные сессии
              </Text>
            </View>
            <View className="bg-orange-100 px-2 py-0.5 rounded-full">
              <Text className="text-orange-600 text-xs font-bold">1 новое</Text>
            </View>
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={{
              ...SHADOWS.strict,
              backgroundColor: COLORS.surface,
              borderRadius: RADIUS.lg,
              padding: SPACING.xl,
              borderWidth: 1,
              borderColor: COLORS.primary + "30",
              borderLeftWidth: 4,
              borderLeftColor: COLORS.primary,
            }}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.md,
                    fontWeight: TYPOGRAPHY.weight.bold,
                    color: COLORS.foreground,
                  }}
                >
                  Родитель: Елена (Иван)
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.mutedForeground,
                    marginTop: 2,
                  }}
                >
                  Запрос на согласование времени
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.warning + "15",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: RADIUS.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: TYPOGRAPHY.weight.bold,
                    color: COLORS.warning,
                    textTransform: "uppercase",
                  }}
                >
                  Ожидает
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: COLORS.foreground,
                marginBottom: 12,
              }}
            >
              Предложенные слоты:
            </Text>
            <View className="flex-row gap-2 mb-4">
              {["Пн 18:00", "Вт 10:00", "Сб 12:00"].map((slot, i) => (
                <TouchableOpacity
                  key={i}
                  className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg flex-1 items-center"
                >
                  <Text className="text-gray-700 font-semibold text-xs">
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity className="bg-primary py-3 rounded-xl items-center">
              <Text className="text-white font-bold">Выбрать время</Text>
            </TouchableOpacity>
          </MotiView>
        </View>

        {/* MENTORSHIP REQUESTS */}
        <View
          style={{ paddingHorizontal: paddingX, opacity: isApproved ? 1 : 0.6 }}
          className="mb-8"
        >
          <View className="flex-row justify-between items-center mb-4 px-1">
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.lg,
                fontWeight: TYPOGRAPHY.weight.semibold,
                color: COLORS.foreground,
              }}
            >
              Заявки на сопровождение
            </Text>
          </View>

          <View
            style={{
              ...SHADOWS.sm,
              backgroundColor: COLORS.surface,
              borderRadius: RADIUS.lg,
              padding: SPACING.lg,
              borderWidth: 1,
              borderColor: COLORS.border,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                <Feather name="user-plus" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text className="font-bold text-gray-900">Данияр (14 лет)</Text>
                <Text className="text-xs text-gray-500">
                  Хочет развивать логику
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity className="w-8 h-8 rounded-full bg-red-50 items-center justify-center border border-red-100">
                <Feather name="x" size={16} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity className="w-8 h-8 rounded-full bg-green-50 items-center justify-center border border-green-100">
                <Feather name="check" size={16} color="#10B981" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* FEEDBACK FEED (Phase 4.1) */}
        <View
          style={{ paddingHorizontal: paddingX, opacity: isApproved ? 1 : 0.6 }}
          className="mb-8"
        >
          <View className="flex-row justify-between items-center mb-5 px-1">
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.lg,
                fontWeight: TYPOGRAPHY.weight.semibold,
                color: COLORS.foreground,
              }}
            >
              Лента обновлений
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  color: COLORS.info,
                  fontWeight: TYPOGRAPHY.weight.semibold,
                  fontSize: TYPOGRAPHY.size.sm,
                }}
              >
                Все отзывы
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-4">
            {RECENT_FEEDBACKS.map((fb, idx) => (
              <MotiView
                key={fb.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 400, delay: 200 + idx * 100 }}
                style={{
                  ...SHADOWS.strict,
                  backgroundColor: COLORS.surface,
                  borderRadius: RADIUS.lg,
                  padding: SPACING.xl,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-row items-center gap-3">
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: RADIUS.md,
                        backgroundColor: COLORS.primary + "15",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather
                        name="message-circle"
                        size={18}
                        color={COLORS.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: TYPOGRAPHY.size.sm,
                          fontWeight: TYPOGRAPHY.weight.bold,
                          color: COLORS.foreground,
                        }}
                      >
                        {fb.student}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: COLORS.mutedForeground,
                          marginTop: 2,
                        }}
                      >
                        {fb.teacher} • {fb.date}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignSelf: "flex-start",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    backgroundColor: COLORS.success + "15",
                    borderRadius: RADIUS.md,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: TYPOGRAPHY.weight.bold,
                      color: COLORS.success,
                      textTransform: "uppercase",
                    }}
                  >
                    {fb.tag}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.sm,
                    color: COLORS.mutedForeground,
                    lineHeight: 20,
                  }}
                >
                  "{fb.text}"
                </Text>
              </MotiView>
            ))}
          </View>
        </View>

        {/* My Students - High Fidelity Cards */}
        <View
          style={{ paddingHorizontal: paddingX, opacity: isApproved ? 1 : 0.6 }}
          className="mb-8"
        >
          <View className="flex-row justify-between items-center mb-5 px-1">
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.lg,
                fontWeight: TYPOGRAPHY.weight.semibold,
                color: COLORS.foreground,
              }}
            >
              Мои ученики
            </Text>
            <TouchableOpacity className="w-11 h-11 items-center justify-center bg-muted rounded-full">
              <Feather name="filter" size={18} color={COLORS.mutedForeground} />
            </TouchableOpacity>
          </View>

          <View className="gap-5">
            {MOCK_STUDENTS.map((student, idx) => (
              <MotiView
                key={student.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 500, delay: 200 + idx * 100 }}
                style={{
                  ...SHADOWS.strict,
                  borderRadius: RADIUS.xxl,
                  backgroundColor: COLORS.surface,
                  padding: SPACING.xl,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push(`/(tabs)/mentor/student/${student.id}` as any)
                  }
                >
                  <View className="flex-row items-center gap-5 mb-6">
                    <View
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: RADIUS.xl,
                        overflow: "hidden",
                      }}
                    >
                      <LinearGradient
                        colors={COLORS.gradients.surface as any}
                        style={{
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 28,
                            fontWeight: TYPOGRAPHY.weight.bold,
                            color: COLORS.primary,
                          }}
                        >
                          {student.name.charAt(0)}
                        </Text>
                      </LinearGradient>
                    </View>
                    <View className="flex-1">
                      <Text
                        style={{
                          fontSize: TYPOGRAPHY.size.xl,
                          fontWeight: TYPOGRAPHY.weight.semibold,
                          color: COLORS.foreground,
                          letterSpacing: TYPOGRAPHY.letterSpacing.tight,
                        }}
                      >
                        {student.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: TYPOGRAPHY.size.sm,
                          color: COLORS.mutedForeground,
                          marginTop: 4,
                        }}
                      >
                        {student.age} лет • Уровень {student.level}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: COLORS.primary + "10",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: RADIUS.full,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: TYPOGRAPHY.size.md,
                          fontWeight: TYPOGRAPHY.weight.bold,
                          color: COLORS.primary,
                        }}
                      >
                        {student.progress}%
                      </Text>
                    </View>
                  </View>

                  {/* Indicators */}
                  <View className="flex-row gap-3 mb-6">
                    {Object.values(student.skills).map((val, i) => (
                      <View key={i} className="flex-1">
                        <View
                          style={{
                            height: 60,
                            backgroundColor: COLORS.muted,
                            borderRadius: RADIUS.md,
                            justifyContent: "flex-end",
                            overflow: "hidden",
                          }}
                        >
                          <LinearGradient
                            colors={COLORS.gradients.primary as any}
                            style={{ height: `${val}%` }}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 9,
                            color: COLORS.mutedForeground,
                            fontWeight: "700",
                            textAlign: "center",
                            marginTop: 8,
                            textTransform: "uppercase",
                          }}
                        >
                          {SKILL_LABELS[i]}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() =>
                        router.push("/(tabs)/mentor/learning-path" as any)
                      }
                      className="bg-purple-50 flex-row flex-1 py-3 px-2 items-center justify-center rounded-xl"
                    >
                      <Feather
                        name="trending-up"
                        size={14}
                        color={COLORS.primary}
                      />
                      <Text
                        className="text-xs font-bold text-primary ml-1.5"
                        numberOfLines={1}
                      >
                        Анализ
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        router.push("/(tabs)/mentor/attendance" as any)
                      }
                      className="bg-blue-50 flex-row flex-1 py-3 px-2 items-center justify-center rounded-xl"
                    >
                      <Feather name="check-square" size={14} color="#3B82F6" />
                      <Text
                        className="text-xs font-bold text-blue-500 ml-1.5"
                        numberOfLines={1}
                      >
                        Визиты
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/(tabs)/chats" as any)}
                      className="bg-green-50 w-12 items-center justify-center rounded-xl"
                    >
                      <Feather
                        name="message-square"
                        size={16}
                        color="#10B981"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>

        {/* Quick Tools */}
        <View
          style={{ paddingHorizontal: paddingX, opacity: isApproved ? 1 : 0.6 }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.size.lg,
              fontWeight: TYPOGRAPHY.weight.semibold,
              color: COLORS.foreground,
              marginBottom: SPACING.xl,
            }}
          >
            Инструменты
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            {[
              {
                icon: "users",
                label: "Группы",
                color: COLORS.primary,
                route: "/(tabs)/mentor/groups",
              },
              {
                icon: "calendar",
                label: "График",
                color: COLORS.success,
                route: "/(tabs)/mentor/attendance",
              },
              {
                icon: "target",
                label: "Цели",
                color: COLORS.warning,
                route: "/(tabs)/mentor/awards",
              },
              {
                icon: "book",
                label: "База",
                color: COLORS.info,
                route: "/(tabs)/mentor/library",
              },
            ].map((action, idx) => (
              <MotiView
                key={idx}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 400, delay: 400 + idx * 50 }}
                style={{
                  // Desktop: 4 columns; mobile: 2 columns — percentage avoids
                  // the sidebar-width-included-in-`width` miscalculation.
                  flexBasis: isDesktop ? "22%" : "47%",
                  flexGrow: 1,
                  ...SHADOWS.strict,
                  borderRadius: RADIUS.xxl,
                  backgroundColor: COLORS.surface,
                  padding: SPACING.xl,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push(action.route as any)}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <View
                    style={{
                      backgroundColor: action.color + "10",
                      width: 56,
                      height: 56,
                      borderRadius: RADIUS.full,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Feather
                      name={action.icon as any}
                      size={24}
                      color={action.color}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.size.sm,
                      fontWeight: TYPOGRAPHY.weight.semibold,
                      color: COLORS.foreground,
                    }}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
