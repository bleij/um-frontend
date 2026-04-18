import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS } from "../../../constants/theme";

const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
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
  const now = new Date();
  const [currentDate, setCurrentDate] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const days = getCalendarDays(currentDate.year, currentDate.month);

  const shiftMonth = (delta: number) => {
    setCurrentDate(prev => {
      const d = new Date(prev.year, prev.month + delta);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#6C5CE7', '#8B7FE8']}
        style={{ paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
              <Pressable
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Feather name="arrow-left" size={20} color="white" />
              </Pressable>
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Календарь</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
               <Text className="text-white text-2xl font-black">{MONTHS[currentDate.month]} {currentDate.year}</Text>
               <View className="flex-row gap-2">
                  <Pressable onPress={() => shiftMonth(-1)} className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
                     <Feather name="chevron-left" size={20} color="white" />
                  </Pressable>
                  <Pressable onPress={() => shiftMonth(1)} className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
                     <Feather name="chevron-right" size={20} color="white" />
                  </Pressable>
               </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 24,
          paddingBottom: 40,
          // On web, cap content width and center it so the calendar doesn't stretch
          maxWidth: isDesktop ? 600 : undefined,
          alignSelf: isDesktop ? "center" : undefined,
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Grid */}
        <View style={{ ...SHADOWS.md, backgroundColor: "white", borderRadius: 32, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: "#F9FAFB" }}>
           {/* Weekday headers */}
           <View style={{ flexDirection: "row", marginBottom: 8 }}>
              {WEEKDAYS.map(d => (
                 <Text key={d} style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: "900", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 }}>{d}</Text>
              ))}
           </View>
           {/* Day cells — fixed 40px height avoids giant cells on wide web */}
           <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {days.map((day, idx) => (
                 <View key={idx} style={{ width: "14.2857%", height: 44, padding: 2, alignItems: "center", justifyContent: "center" }}>
                    {day && (
                       <Pressable
                          onPress={() => setSelectedDay(day)}
                          style={{
                            width: "100%", height: "100%", borderRadius: 12,
                            backgroundColor: day === selectedDay ? "#7C3AED" : "transparent",
                            alignItems: "center", justifyContent: "center",
                          }}
                       >
                          <Text style={{ fontWeight: "700", fontSize: 14, color: day === selectedDay ? "white" : "#111827" }}>{day}</Text>
                          {day === 15 && day !== selectedDay && (
                             <View style={{ position: "absolute", bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: "#7C3AED" }} />
                          )}
                       </Pressable>
                    )}
                 </View>
              ))}
           </View>
        </View>

        <Text className="text-xl font-black text-gray-900 mb-4 px-1">Занятия на {selectedDay} {MONTHS[currentDate.month].toLowerCase()}</Text>
        
        <View className="bg-gray-50 rounded-[32px] p-10 items-center border border-gray-100">
           <View className="w-16 h-16 bg-white rounded-3xl items-center justify-center mb-4 border border-gray-100">
              <Feather name="coffee" size={28} color="#D1D5DB" />
           </View>
           <Text className="text-gray-400 font-bold text-center">На этот день ничего не запланировано</Text>
        </View>
      </ScrollView>
    </View>
  );
}
