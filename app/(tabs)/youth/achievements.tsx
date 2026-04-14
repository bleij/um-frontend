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

const ACHIEVEMENTS = [
    { id: 1, name: "Первые шаги", unlocked: true, icon: "log-in" },
    { id: 2, name: "Художник", unlocked: true, icon: "edit-3" },
    { id: 3, name: "Спортсмен", unlocked: true, icon: "activity" },
    { id: 4, name: "Гений", unlocked: false, icon: "cpu" },
    { id: 5, name: "Легенда", unlocked: false, icon: "shield" },
    { id: 6, name: "Мастер", unlocked: false, icon: "award" },
];

export default function YouthAchievements() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const progress = (unlockedCount / ACHIEVEMENTS.length) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#3B82F6', '#6C5CE7']}
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Достижения</Text>
            </View>

            <View className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
               <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white text-[10px] font-black uppercase">ПРОГРЕСС КОЛЛЕКЦИИ</Text>
                  <Text className="text-white text-xs font-black">{unlockedCount} / {ACHIEVEMENTS.length}</Text>
               </View>
               <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <View style={{ width: `${progress}%` }} className="h-full bg-white rounded-full" />
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
        <Text className="text-lg font-black text-gray-900 mb-6 px-1">Твои награды</Text>
        
        <View className="flex-row flex-wrap gap-4">
           {ACHIEVEMENTS.map(item => (
              <View 
                 key={item.id} 
                 style={{ width: (width - horizontalPadding * 2 - 16) / 2 }}
                 className={`p-6 rounded-[32px] items-center border ${item.unlocked ? 'bg-white border-gray-50' : 'bg-gray-50 border-gray-100 opacity-60'}`}
              >
                 <LinearGradient
                    colors={item.unlocked ? ['#EFF6FF', '#F5F3FF'] : ['#F3F4F6', '#E5E7EB']}
                    className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
                 >
                    <Feather 
                       name={item.unlocked ? (item.icon as any) : 'lock'} 
                       size={32} 
                       color={item.unlocked ? '#6C5CE7' : '#9CA3AF'} 
                    />
                 </LinearGradient>
                 
                 <Text className={`font-black text-sm text-center ${item.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                    {item.name}
                 </Text>
                 
                 {item.unlocked && (
                   <View className="mt-2 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                      <Text className="text-[8px] font-black text-green-600 uppercase tracking-widest">ОТКРЫТО</Text>
                   </View>
                 )}
              </View>
           ))}
        </View>

        <View className="mt-10 p-8 rounded-[40px] border-2 border-dashed border-gray-100 items-center">
           <Feather name="plus-circle" size={40} color="#E5E7EB" />
           <Text className="mt-4 text-gray-300 font-black text-center uppercase tracking-widest">БУДУЩИЕ ДОСТИЖЕНИЯ</Text>
        </View>
      </ScrollView>
    </View>
  );
}
