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

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const SCHEDULE_DATA = [
  { time: "09:00", subject: "Робототехника", group: "Группа A1", teacher: "Иван Иванов", room: "204", color: "#3B82F6" },
  { time: "10:30", subject: "Программирование", group: "Группа B2", teacher: "Анна Петрова", room: "105", color: "#6366F1" },
  { time: "12:00", subject: "Шахматы", group: "Все уровни", teacher: "Сергей Сидоров", room: "301", color: "#A78BFA" },
  { time: "14:00", subject: "Арт-студия", group: "Группа C1", teacher: "Мария Кюри", room: "Art-1", color: "#EC4899" },
];

export default function OrgScheduleScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white", flex: 1 }}>Расписание</Text>
              <Pressable className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Feather name="plus" size={20} color="white" />
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1 overflow-visible">
              {DAYS.map((day, index) => (
                <Pressable
                  key={day}
                  onPress={() => setSelectedDay(index)}
                  className={`mr-3 w-12 h-16 rounded-2xl items-center justify-center border ${selectedDay === index ? 'bg-white border-white' : 'bg-white/10 border-white/20'}`}
                >
                  <Text className={`font-black text-xs ${selectedDay === index ? 'text-blue-600' : 'text-white/60'}`}>{day}</Text>
                  <View className={`mt-1.5 w-1 h-1 rounded-full ${selectedDay === index ? 'bg-blue-600' : 'bg-transparent'}`} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          {SCHEDULE_DATA.map((item, idx) => (
            <View key={idx} style={SHADOWS.sm} className="bg-white rounded-[32px] p-5 flex-row border border-gray-50 items-center">
              <View className="pr-5 border-r border-gray-100 items-center justify-center w-20">
                <Text className="text-gray-900 font-black text-lg">{item.time}</Text>
                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">START</Text>
              </View>
              
              <View className="pl-5 flex-1">
                <Text className="text-base font-black text-gray-900 mb-1">{item.subject}</Text>
                <View className="flex-row items-center gap-2 mb-2">
                   <View style={{ backgroundColor: item.color + '15' }} className="px-2 py-0.5 rounded-lg">
                      <Text style={{ color: item.color }} className="text-[10px] font-black uppercase">{item.group}</Text>
                   </View>
                   <Text className="text-[10px] text-gray-400 font-bold uppercase">• КАБ. {item.room}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                   <Text className="text-xs text-gray-500 font-bold">{item.teacher}</Text>
                </View>
              </View>
              
              <Pressable className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                 <Feather name="more-vertical" size={16} color="#D1D5DB" />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
