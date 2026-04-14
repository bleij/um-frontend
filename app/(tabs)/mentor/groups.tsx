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

const MOCK_GROUPS = [
  { id: "1", name: "Старшая группа A", course: "Робототехника", students: 12, time: "Пн, Ср 15:00", nextLesson: "Сегодня, 15:00", active: true },
  { id: "2", name: "Middle Python", course: "Программирование", students: 8, time: "Вт, Чт 16:45", nextLesson: "Завтра, 16:45", active: true },
  { id: "3", name: "Младшая группа B", course: "Робототехника", students: 10, time: "Сб 10:00", nextLesson: "Суббота, 10:00", active: false },
];

export default function MentorGroups() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [search, setSearch] = useState("");

  const filtered = MOCK_GROUPS.filter(g => 
     g.name.toLowerCase().includes(search.toLowerCase()) || 
     g.course.toLowerCase().includes(search.toLowerCase())
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white", flex: 1 }}>Мои группы</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 16, paddingHorizontal: 16, height: 48 }}>
               <Feather name="search" size={18} color="rgba(255,255,255,0.6)" style={{ marginRight: 10 }} />
               <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Поиск группы..."
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
        <View className="gap-6">
           {filtered.map((group) => (
              <Pressable
                 key={group.id}
                 onPress={() => router.push(`/mentor/group/${group.id}` as any)}
                 style={SHADOWS.md}
                 className="bg-white rounded-[32px] p-6 border border-gray-50 overflow-hidden"
              >
                 <View className="flex-row items-center justify-between mb-4">
                    <View>
                       <Text className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">{group.course}</Text>
                       <Text className="text-xl font-black text-gray-900">{group.name}</Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${group.active ? 'bg-green-50' : 'bg-gray-100'}`}>
                       <Text className={`text-[10px] font-black uppercase ${group.active ? 'text-green-600' : 'text-gray-400'}`}>
                          {group.active ? 'Активна' : 'Архив'}
                       </Text>
                    </View>
                 </View>

                 <View className="flex-row items-center gap-6 mb-6">
                    <View className="flex-row items-center gap-2">
                       <Feather name="users" size={16} color="#9CA3AF" />
                       <Text className="text-sm text-gray-600 font-bold">{group.students} уч.</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                       <Feather name="calendar" size={16} color="#9CA3AF" />
                       <Text className="text-sm text-gray-600 font-bold">{group.time}</Text>
                    </View>
                 </View>

                 <View className="pt-4 border-t border-gray-50 flex-row items-center justify-between">
                    <View>
                       <Text className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">След. занятие</Text>
                       <Text className="text-sm font-bold text-gray-900">{group.nextLesson}</Text>
                    </View>
                    <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center">
                       <Feather name="chevron-right" size={20} color={COLORS.primary} />
                    </View>
                 </View>
              </Pressable>
           ))}
        </View>
      </ScrollView>
    </View>
  );
}
