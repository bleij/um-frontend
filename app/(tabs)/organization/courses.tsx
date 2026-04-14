import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS } from "../../../constants/theme";

const COURSES = [
  { id: "1", name: "Робототехника", students: 18, age: "6-11", price: 25000, status: "active", icon: "cpu" },
  { id: "2", name: "Программирование", students: 15, age: "12-17", price: 30000, status: "active", icon: "code" },
  { id: "3", name: "Шахматы", students: 20, age: "6-14", price: 15000, status: "active", icon: "target" },
  { id: "4", name: "Арт-студия", students: 12, age: "9-16", price: 20000, status: "paused", icon: "edit-3" },
];

export default function OrgCourses() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;
  
  const [search, setSearch] = useState("");
  const filtered = COURSES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white", flex: 1 }}>Курсы</Text>
              <Pressable
                onPress={() => router.push("/organization/course/create" as any)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingHorizontal: 16,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>+ Добавить</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 16, paddingHorizontal: 16, height: 48 }}>
               <Feather name="search" size={18} color="rgba(255,255,255,0.6)" style={{ marginRight: 10 }} />
               <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Поиск курса..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={{ color: "white", flex: 1, fontSize: 15, fontWeight: "500" }}
               />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
         {/* Summary Row */}
         <View className="flex-row gap-3 mb-8">
            <View style={SHADOWS.sm} className="flex-1 bg-white p-5 rounded-3xl border border-gray-100">
               <Text className="text-2xl font-black text-primary">{COURSES.length}</Text>
               <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Курсов</Text>
            </View>
            <View style={SHADOWS.sm} className="flex-1 bg-white p-5 rounded-3xl border border-gray-100">
               <Text className="text-2xl font-black text-gray-900">{COURSES.reduce((s,c)=>s+c.students, 0)}</Text>
               <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Учеников</Text>
            </View>
         </View>

         {/* Courses List */}
         <View className="gap-6">
            {filtered.map((course) => (
               <Pressable
                  key={course.id}
                  onPress={() => router.push(`/organization/course/${course.id}` as any)}
                  style={SHADOWS.md}
                  className="bg-white rounded-[40px] p-6 border border-gray-50 overflow-hidden"
               >
                  <View className="flex-row items-center justify-between mb-6">
                     <View className="flex-row items-center gap-4">
                        <View className="w-14 h-14 rounded-[20px] bg-purple-50 items-center justify-center">
                           <Feather name={course.icon as any} size={28} color={COLORS.primary} />
                        </View>
                        <View>
                           <Text className="text-xl font-bold text-gray-900">{course.name}</Text>
                           <Text className="text-sm text-gray-400 font-medium">{course.age} лет</Text>
                        </View>
                     </View>
                     <View className={`px-3 py-1.5 rounded-xl ${course.status === 'active' ? 'bg-green-50' : 'bg-gray-100'}`}>
                        <Text className={`text-[10px] font-black uppercase tracking-wider ${course.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                           {course.status === 'active' ? 'Активен' : 'Пауза'}
                        </Text>
                     </View>
                  </View>

                  <View className="flex-row justify-between items-end">
                     <View>
                        <View className="flex-row items-center gap-2 mb-1">
                           <Feather name="users" size={14} color="#9CA3AF" />
                           <Text className="text-xs font-bold text-gray-700">{course.students} учеников</Text>
                        </View>
                        <Text className="text-lg font-black text-primary">{course.price.toLocaleString()} ₸/мес</Text>
                     </View>
                     
                     <View className="flex-row gap-2">
                        <Pressable className="w-10 h-10 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100">
                           <Feather name="edit-2" size={16} color={COLORS.mutedForeground} />
                        </Pressable>
                        <View className="w-10 h-10 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/20">
                           <Feather name="chevron-right" size={20} color="white" />
                        </View>
                     </View>
                  </View>
               </Pressable>
            ))}
         </View>
      </ScrollView>
    </View>
  );
}
