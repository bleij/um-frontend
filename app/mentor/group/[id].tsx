import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const MOCK_STUDENTS = [
  { id: "1", name: "Алихан Сериков", attendance: true, xpAdded: 50 },
  { id: "2", name: "Мария Иванова", attendance: true, xpAdded: 50 },
  { id: "3", name: "Тимур Ахметов", attendance: false, xpAdded: 0 },
  { id: "4", name: "Елена Петрова", attendance: true, xpAdded: 50 },
  { id: "5", name: "Санжар Болатов", attendance: true, xpAdded: 50 },
];

export default function MentorGroupDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [students, setStudents] = useState(MOCK_STUDENTS);

  const toggleAttendance = (id: string) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, attendance: !s.attendance } : s
    ));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={[COLORS.gradientFrom, COLORS.gradientTo]}
        style={{ paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
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
              <View>
                <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Старшая группа A</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Сегодня, 15:00-16:30</Text>
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
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Attendance Marking Section */}
        <View style={SHADOWS.sm} className="bg-white rounded-[32px] p-6 mb-8 border border-gray-100">
           <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-bold text-gray-900">Посещаемость</Text>
              <View className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                 <Text className="text-[10px] font-black text-gray-500 uppercase">ФЕВРАЛЬ 24, 2026</Text>
              </View>
           </View>

           <View className="gap-3">
              {students.map(s => (
                <Pressable
                  key={s.id}
                  onPress={() => toggleAttendance(s.id)}
                  className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"
                >
                  <View className="flex-row items-center gap-4">
                     <View className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200">
                        <Text className="font-bold text-primary">{s.name.charAt(0)}</Text>
                     </View>
                     <Text className="font-bold text-gray-800">{s.name}</Text>
                  </View>
                  <View className={`w-10 h-10 rounded-xl items-center justify-center ${s.attendance ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-white border-2 border-gray-200'}`}>
                     {s.attendance && <Feather name="check" size={20} color="white" />}
                  </View>
                </Pressable>
              ))}
           </View>
        </View>

        {/* Lesson Summary / XP */}
        <View style={SHADOWS.sm} className="bg-white rounded-[32px] p-6 mb-8 border border-gray-100">
           <Text className="text-lg font-bold text-gray-900 mb-4">Награды за занятие</Text>
           <View className="flex-row items-center gap-4 mb-6">
              <View className="w-12 h-12 bg-yellow-50 rounded-2xl items-center justify-center">
                 <Feather name="award" size={24} color="#F59E0B" />
              </View>
              <View className="flex-1">
                 <Text className="text-sm font-bold text-gray-900">Активность +50 XP</Text>
                 <Text className="text-[10px] text-gray-400 font-bold uppercase">Будет начислено всем присутствующим</Text>
              </View>
           </View>
           
           <Pressable 
              className="h-14 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/20"
              onPress={() => router.back()}
           >
              <Text className="text-white font-bold">Завершить и начислить XP</Text>
           </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
