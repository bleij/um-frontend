import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    ScrollView,
    Text,
    Pressable,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../constants/theme";

const MOCK_LESSONS = [
  { id: "1", time: "15:00", title: "Робототехника", group: "Старшая группа A", location: "Каб. 204" },
  { id: "2", time: "16:45", title: "Программирование", group: "Middle Python", location: "Каб. 105" },
];

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
    age: 14,
    level: 8,
    xp: 2450,
    progress: 78,
    skills: { com: 78, lead: 65, cre: 85, log: 80, dis: 72 },
  },
];

const SKILL_LABELS = ["Ком.", "Лид.", "Кре.", "Лог.", "Дис."];

export default function MentorHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={[COLORS.gradientFrom, COLORS.gradientTo]}
        style={{ paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View className="flex-row items-center justify-between mb-6">
               <View>
                  <Text style={{ fontSize: 24, fontWeight: "800", color: "white" }}>Кабинет ментора</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600" }}>Анна Сергеевна</Text>
               </View>
               <Pressable className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                  <View className="w-full h-full bg-white/20 items-center justify-center">
                     <Feather name="user" size={20} color="white" />
                  </View>
               </Pressable>
            </View>

            <View className="flex-row gap-3">
               <View className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 items-center">
                  <Text className="text-xl font-black text-white">12</Text>
                  <Text className="text-[10px] text-white/70 font-bold uppercase">Учеников</Text>
               </View>
               <View className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 items-center">
                  <Text className="text-xl font-black text-white">4</Text>
                  <Text className="text-[10px] text-white/70 font-bold uppercase">Занятий сегодня</Text>
               </View>
               <View className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 items-center">
                  <Text className="text-xl font-black text-white">92%</Text>
                  <Text className="text-[10px] text-white/70 font-bold uppercase">Успеваемость</Text>
               </View>
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
        {/* Next Lesson Card */}
        <View className="mb-8">
           <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Ближайшее занятие</Text>
              <Pressable onPress={() => router.push("/(tabs)/mentor/schedule" as any)}>
                 <Text className="text-primary font-bold text-sm">Всё расписание</Text>
              </Pressable>
           </View>
           
           <View style={SHADOWS.md} className="bg-white rounded-[32px] overflow-hidden border border-gray-100">
              <LinearGradient colors={['#6C5CE7', '#A78BFA']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} className="p-6">
                 <View className="flex-row justify-between items-start mb-4">
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                       <Text className="text-white text-[10px] font-bold">ЧЕРЕЗ 15 МИН</Text>
                    </View>
                    <Feather name="clock" size={20} color="white" />
                 </View>
                 <Text className="text-2xl font-black text-white mb-1">Робототехника</Text>
                 <Text className="text-white/80 font-bold mb-4">Старшая группа A • Каб. 204</Text>
                 <Pressable 
                    onPress={() => router.push("/mentor/group/1" as any)}
                    className="bg-white h-12 rounded-xl items-center justify-center"
                 >
                    <Text className="text-primary font-bold">Начать занятие</Text>
                 </Pressable>
              </LinearGradient>
           </View>
        </View>

        {/* My Students List */}
        <View className="mb-4 flex-row justify-between items-center">
           <Text className="text-lg font-bold text-gray-900">Мои подопечные</Text>
           <Pressable onPress={() => router.push("/(tabs)/mentor/students" as any)}>
              <Feather name="filter" size={18} color={COLORS.mutedForeground} />
           </Pressable>
        </View>

        <View className="gap-4">
           {MOCK_STUDENTS.map(student => (
              <Pressable 
                 key={student.id}
                 onPress={() => router.push(`/(tabs)/mentor/student/${student.id}` as any)}
                 style={SHADOWS.sm}
                 className="bg-white rounded-[32px] p-5 border border-gray-100"
              >
                 <View className="flex-row items-center gap-4 mb-4">
                    <View className="w-14 h-14 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100">
                       <Text className="text-xl font-bold text-primary">{student.name.charAt(0)}</Text>
                    </View>
                    <View className="flex-1">
                       <Text className="text-lg font-bold text-gray-900">{student.name}</Text>
                       <Text className="text-sm text-gray-500">{student.age} лет • Lvl {student.level}</Text>
                    </View>
                    <View className="items-end">
                       <Text className="text-xl font-black text-primary">{student.progress}%</Text>
                       <Text className="text-[10px] text-gray-400 font-bold uppercase">Прогресс</Text>
                    </View>
                 </View>

                 {/* Skill Bars */}
                 <View className="flex-row gap-2 mb-4">
                    {Object.values(student.skills).map((val, i) => (
                       <View key={i} className="flex-1">
                          <View className="h-12 bg-gray-50 rounded-lg justify-end overflow-hidden">
                             <View 
                                style={{ height: `${val}%` }} 
                                className="bg-primary/60 rounded-t-lg" 
                             />
                          </View>
                          <Text className="text-[8px] text-gray-400 font-bold text-center mt-1 uppercase">{SKILL_LABELS[i]}</Text>
                       </View>
                    ))}
                 </View>

                 <View className="flex-row gap-2 mt-2">
                    <Pressable 
                       onPress={() => router.push("/(tabs)/mentor/learning-path" as any)}
                       className="flex-1 h-12 bg-primary rounded-xl flex-row items-center justify-center gap-2"
                    >
                       <Feather name="target" size={16} color="white" />
                       <Text className="text-white font-bold text-sm">План развития</Text>
                    </Pressable>
                    <Pressable 
                       onPress={() => router.push("/(tabs)/chats" as any)}
                       className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                    >
                       <Feather name="message-circle" size={18} color={COLORS.mutedForeground} />
                    </Pressable>
                 </View>
              </Pressable>
           ))}
        </View>

        {/* Quick Actions */}
        <View className="mt-8">
           <Text className="text-lg font-bold text-gray-900 mb-4">Инструменты</Text>
           <View className="flex-row flex-wrap gap-3">
              {[
                 { icon: 'users', label: 'Мои группы', color: '#6C5CE7', route: '/(tabs)/mentor/groups' },
                 { icon: 'check-square', label: 'Посещаемость', color: '#10B981', route: '/(tabs)/mentor/attendance' },
                 { icon: 'award', label: 'Достижения', color: '#F59E0B', route: '/(tabs)/mentor/awards' },
                 { icon: 'book', label: 'Библиотека', color: '#3B82F6', route: '/(tabs)/mentor/library' },
              ].map((action, idx) => (
                 <Pressable 
                    key={idx}
                    onPress={() => router.push(action.route as any)}
                    style={{ width: (width - horizontalPadding*2 - 12) / 2 }}
                    className="bg-white p-4 rounded-2xl border border-gray-100 flex-row items-center gap-3"
                 >
                    <View style={{ backgroundColor: action.color + '15' }} className="w-10 h-10 rounded-xl items-center justify-center">
                       <Feather name={action.icon as any} size={20} color={action.color} />
                    </View>
                    <Text className="font-bold text-gray-800 text-sm">{action.label}</Text>
                 </Pressable>
              ))}
           </View>
        </View>
      </ScrollView>
    </View>
  );
}
