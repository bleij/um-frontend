import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import ScreenHeader from "../../../components/ui/ScreenHeader";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const days: (number | null)[] = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export default function ParentCalendar() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;
  const now = new Date();
  const [currentDate, setCurrentDate] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const days = getCalendarDays(currentDate.year, currentDate.month);

  const prevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev.year, prev.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const nextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev.year, prev.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const selectedDateLabel = `${selectedDay} ${MONTHS[currentDate.month].toLowerCase()}`;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {!isDesktop && (
        <ScreenHeader
          title="Календарь"
          onBack={() => router.back()}
          horizontalPadding={horizontalPadding}
          variant="surface"
        />
      )}

      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 40,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: isDesktop ? 1120 : undefined,
            paddingHorizontal: horizontalPadding,
          }}
        >
          <View
            style={{
              flexDirection: isDesktop ? "row" : "column",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <View
              style={{
                width: "100%",
                flex: isDesktop ? 1 : undefined,
                maxWidth: isDesktop ? 760 : undefined,
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.lg,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
                ...SHADOWS.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <TouchableOpacity
                  onPress={prevMonth}
                  style={{
                    padding: 8,
                    backgroundColor: `${COLORS.primary}10`,
                    borderRadius: 10,
                  }}
                >
                  <Feather
                    name="chevron-left"
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: isDesktop ? 18 : 17,
                    fontWeight: "700",
                    color: COLORS.foreground,
                  }}
                >
                  {MONTHS[currentDate.month]} {currentDate.year}
                </Text>
                <TouchableOpacity
                  onPress={nextMonth}
                  style={{
                    padding: 8,
                    backgroundColor: `${COLORS.primary}10`,
                    borderRadius: 10,
                  }}
                >
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                {WEEKDAYS.map((d) => (
                  <View key={d} style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: isDesktop ? 13 : 12,
                        fontWeight: "600",
                        color: COLORS.mutedForeground,
                      }}
                    >
                      {d}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {days.map((day, index) => (
                  <View
                    key={index}
                    style={{
                      width: "14.28%",
                      aspectRatio: isDesktop ? 1.08 : 1,
                      padding: isDesktop ? 4 : 2,
                    }}
                  >
                    {day ? (
                      <TouchableOpacity
                        onPress={() => setSelectedDay(day)}
                        style={{
                          flex: 1,
                          borderRadius: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            day === selectedDay
                              ? COLORS.primary
                              : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: isDesktop ? 18 : 14,
                            fontWeight: day === selectedDay ? "700" : "400",
                            color:
                              day === selectedDay ? "white" : COLORS.foreground,
                          }}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ flex: 1 }} />
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View
              style={{
                width: "100%",
                maxWidth: isDesktop ? 340 : undefined,
                minHeight: isDesktop ? 320 : undefined,
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.lg,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
                ...SHADOWS.sm,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: COLORS.foreground,
                  marginBottom: 12,
                }}
              >
                Занятия на {selectedDateLabel}
              </Text>
              <View style={{ alignItems: "center", paddingVertical: 32 }}>
                <Feather
                  name="calendar"
                  size={40}
                  color={COLORS.mutedForeground}
                />
                <Text
                  style={{
                    color: COLORS.mutedForeground,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  На этот день нет запланированных занятий
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
