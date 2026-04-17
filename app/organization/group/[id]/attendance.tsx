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
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS, RADIUS, SPACING, TYPOGRAPHY } from "../../../../constants/theme";

interface Student {
  id: string;
  full_name: string;
  status: 'present' | 'absent' | 'sick' | null;
}

export default function AttendanceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [date] = useState(new Date().toLocaleDateString("ru-RU", { day: 'numeric', month: 'long' }));
  
  const [students, setStudents] = useState<Student[]>([
    { id: "1", full_name: "Алихан Сериков", status: null },
    { id: "2", full_name: "Мария Иванова", status: null },
    { id: "3", full_name: "Тимур Ахметов", status: null },
    { id: "4", full_name: "Елена Петрова", status: null },
    { id: "5", full_name: "Санжар Болатов", status: null },
  ]);

  const toggleStatus = (studentId: string, status: Student['status']) => {
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleSave = () => {
      // API call to save attendance
      alert("Посещаемость успешно сохранена!");
      router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header - Unified Brand Style */}
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: SPACING.xl }}
        >
          <SafeAreaView edges={["top"]}>
            <View style={{ paddingHorizontal: horizontalPadding, paddingTop: SPACING.md }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.xl }}>
                 <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                       width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: "rgba(255,255,255,0.2)",
                       alignItems: "center", justifyContent: "center"
                    }}
                 >
                    <Feather name="arrow-left" size={20} color="white" />
                 </TouchableOpacity>
                 <Text style={{ flex: 1, marginLeft: SPACING.md, fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white" }}>
                    Отметка посещаемости
                 </Text>
              </View>

              <View>
                <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: "white", marginBottom: 4 }}>
                  Группа К-1
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium }}>
                  Сегодня, {date}
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
         <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-2">Список учеников</Text>
            <Text className="text-xs text-gray-500">Отметьте тех, кто пришел или по какой причине отсутствует.</Text>
         </View>

         <View className="gap-3">
            {students.map((student) => (
               <View key={student.id} style={SHADOWS.sm} className="bg-white rounded-3xl p-5 border border-gray-100">
                  <Text className="font-bold text-gray-900 text-lg mb-4">{student.full_name}</Text>
                  
                  <View className="flex-row gap-2">
                     <Pressable 
                        onPress={() => toggleStatus(student.id, 'present')}
                        className={`flex-1 py-3 items-center justify-center rounded-2xl border-2 ${student.status === 'present' ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-100'}`}
                     >
                        <Text className={`font-bold ${student.status === 'present' ? 'text-white' : 'text-gray-400'}`}>Был</Text>
                     </Pressable>
                     
                     <Pressable 
                        onPress={() => toggleStatus(student.id, 'absent')}
                        className={`flex-1 py-3 items-center justify-center rounded-2xl border-2 ${student.status === 'absent' ? 'bg-red-500 border-red-500' : 'bg-transparent border-gray-100'}`}
                     >
                        <Text className={`font-bold ${student.status === 'absent' ? 'text-white' : 'text-gray-400'}`}>Не был</Text>
                     </Pressable>

                     <Pressable 
                        onPress={() => toggleStatus(student.id, 'sick')}
                        className={`flex-1 py-3 items-center justify-center rounded-2xl border-2 ${student.status === 'sick' ? 'bg-yellow-500 border-yellow-500' : 'bg-transparent border-gray-100'}`}
                     >
                        <Text className={`font-bold ${student.status === 'sick' ? 'text-white' : 'text-gray-400'}`}>Болел</Text>
                     </Pressable>
                  </View>
               </View>
            ))}
         </View>
      </ScrollView>

      {/* Footer Fixed Save Button */}
       <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 shadow-xl" style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32 }}>
          <TouchableOpacity 
              onPress={handleSave}
              className="bg-primary rounded-2xl py-4 items-center justify-center"
          >
             <Text className="text-white font-black text-lg">Сохранить</Text>
          </TouchableOpacity>
       </View>
    </View>
  );
}
