import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
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

const PATH_STEPS = [
    {
        id: 1, phase: "Текущие навыки", status: "completed",
        items: [
            { text: "Креативность: высокий уровень", done: true },
            { text: "Коммуникация: средний уровень", done: true },
        ],
    },
    {
        id: 2, phase: "Цели развития", status: "active",
        items: [
            { text: "Развить навыки публичных выступлений", done: true },
            { text: "Улучшить командную работу", done: false },
        ],
    },
    {
        id: 3, phase: "Рекомендованные кружки", status: "active",
        items: [
            { text: "Театральная студия", done: false },
            { text: "Ораторское искусство", done: false },
        ],
    },
];

export default function MentorLearningPath() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={[COLORS.gradientFrom, COLORS.gradientTo]}
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
              <View>
                <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>План развития</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Анна Петрова</Text>
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
        {/* Progress Summary Card */}
        <View style={SHADOWS.md} className="bg-white rounded-[32px] p-6 mb-8 border border-gray-100">
           <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Общий прогресс</Text>
           <View className="flex-row items-center gap-4 mb-2">
              <View className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden">
                 <View style={{ width: '40%' }} className="h-full bg-primary rounded-full" />
              </View>
              <Text className="text-2xl font-black text-primary">40%</Text>
           </View>
           <Text className="text-sm text-gray-500">2 из 5 этапов завершено</Text>
        </View>

        {/* Timeline */}
        <View className="relative">
           {/* Vertical Line */}
           <View className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-100" />

           {PATH_STEPS.map((step, index) => (
             <View key={step.id} className="flex-row gap-5 mb-8">
                {/* Dot */}
                <View className="z-10">
                   <View className={`w-10 h-10 rounded-full items-center justify-center ${step.status === 'completed' ? 'bg-green-500' : step.status === 'active' ? 'bg-primary' : 'bg-gray-200'}`}>
                      <Feather name={step.status === 'completed' ? 'check' : 'target'} size={18} color="white" />
                   </View>
                </View>

                {/* Card */}
                <View style={SHADOWS.sm} className="flex-1 bg-white rounded-3xl p-5 border border-gray-50">
                   <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-base font-bold text-gray-900">{step.phase}</Text>
                      <View className={`px-2 py-1 rounded-lg ${step.status === 'completed' ? 'bg-green-50' : 'bg-purple-50'}`}>
                         <Text className={`text-[9px] font-black uppercase ${step.status === 'completed' ? 'text-green-600' : 'text-primary'}`}>
                            {step.status === 'completed' ? 'ГОТОВО' : 'В ПРОЦЕССЕ'}
                         </Text>
                      </View>
                   </View>
                   
                   <View className="gap-2">
                      {step.items.map((item, i) => (
                        <View key={i} className={`flex-row items-center gap-3 p-3 rounded-xl ${item.done ? 'bg-green-50/50' : 'bg-gray-50'}`}>
                           <View className={`w-5 h-5 rounded-md items-center justify-center ${item.done ? 'bg-green-500' : 'border border-gray-300'}`}>
                              {item.done && <Feather name="check" size={12} color="white" />}
                           </View>
                           <Text className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{item.text}</Text>
                        </View>
                      ))}
                   </View>

                   {step.status === 'active' && (
                     <Pressable className="mt-4 h-10 border border-dashed border-gray-200 rounded-xl items-center justify-center flex-row gap-2">
                        <Feather name="plus-circle" size={14} color={COLORS.mutedForeground} />
                        <Text className="text-xs font-bold text-gray-500">Добавить цель</Text>
                     </Pressable>
                   )}
                </View>
             </View>
           ))}
        </View>

        <Pressable className="h-16 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/20 mt-4">
           <Text className="text-white font-bold text-lg">Сохранить изменения</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
