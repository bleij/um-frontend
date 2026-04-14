import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationsModal } from "../../app/(tabs)/layout-container";
import { COLORS, LAYOUT, SHADOWS } from "../../constants/theme";
import { useParentData } from "../../contexts/ParentDataContext";
import { courses } from "../../data/courses";

export default function ParentHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const {
    childrenProfile: children,
    activeChildId,
    setActiveChildId,
  } = useParentData();

  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const activeChild =
    children.find((child) => child.id === activeChildId) || children[0] || null;

  const recommendations = useMemo(() => {
    if (!activeChild) return [];

    return courses.slice(0, 3).map((course, index) => ({
      id: String(course.id),
      title: course.title,
      age: course.age,
      for: activeChild.name,
      rating: (4.6 + index * 0.1).toFixed(1),
    }));
  }, [activeChild]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#6C5CE7', '#8B7FE8']}
        style={{ paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <Text style={{ fontSize: 32, fontWeight: "900", color: "white", letterSpacing: -1 }}>UM</Text>
              <Pressable
                onPress={() => setNotificationsVisible(true)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="bell" size={20} color="white" />
                <View className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white" />
              </Pressable>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "500" }}>
              Привет! Узнайте, как развиваются ваши дети сегодня.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: isDesktop ? 32 : 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Children Section */}
        <View style={{ paddingHorizontal: horizontalPadding, marginTop: 24 }}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-black text-gray-900">Мои дети</Text>
            <Pressable onPress={() => router.push('/parent/children' as any)}>
               <Text className="text-purple-600 font-bold text-sm">Все</Text>
            </Pressable>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            {children.map((child) => (
              <Pressable
                key={child.id}
                onPress={() => {
                  setActiveChildId(child.id);
                  router.push(`/parent/child/${child.id}` as any);
                }}
                style={SHADOWS.md}
                className={`mr-4 w-36 p-5 bg-white rounded-[32px] items-center border ${activeChildId === child.id ? 'border-purple-200' : 'border-gray-50'}`}
              >
                <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center mb-3">
                   <Text className="text-purple-600 font-black text-xl">{child.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text className="font-bold text-sm text-gray-800 text-center" numberOfLines={1}>{child.name}</Text>
                <Text className="text-[10px] text-gray-400 font-bold uppercase mt-1">{child.age} ЛЕТ</Text>
              </Pressable>
            ))}
            
            <Pressable
               onPress={() => router.push('/parent/add-child' as any)}
               className="w-36 p-5 bg-gray-50 rounded-[32px] items-center justify-center border-2 border-dashed border-gray-100"
            >
               <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-2">
                  <Feather name="plus" size={20} color="#9CA3AF" />
               </View>
               <Text className="text-xs font-bold text-gray-400 text-center">Добавить</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* AI Recommendations Section */}
        <View style={{ marginTop: 32 }}>
          <View style={{ paddingHorizontal: horizontalPadding }}>
            <Text className="text-xl font-black text-gray-900 mb-1">Рекомендации AI</Text>
            <Text className="text-xs text-gray-400 font-medium mb-4">На основе интересов {activeChild?.name}</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: horizontalPadding }}>
            {recommendations.map((rec) => (
              <Pressable
                key={rec.id}
                onPress={() => router.push(`/parent/club/${rec.id}` as any)}
                style={SHADOWS.sm}
                className="mr-4 w-64 bg-white rounded-[32px] overflow-hidden border border-gray-50"
              >
                <View className="h-32 bg-gray-100">
                   <View className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex-row items-center gap-1">
                      <Feather name="star" size={10} color="#FBBF24" />
                      <Text className="text-[10px] font-black text-gray-700">{rec.rating}</Text>
                   </View>
                   {/* Image placeholder */}
                   <View className="w-full h-full items-center justify-center">
                      <Feather name="image" size={24} color="#D1D5DB" />
                   </View>
                </View>
                <View className="p-4">
                   <Text className="font-bold text-gray-900 mb-1" numberOfLines={1}>{rec.title}</Text>
                   <Text className="text-[10px] text-gray-400 font-bold uppercase mb-3">{rec.age}</Text>
                   <View className="bg-purple-50 self-start px-2 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-purple-600 uppercase">ДЛЯ: {rec.for}</Text>
                   </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Classes Section */}
        <View style={{ paddingHorizontal: horizontalPadding, marginTop: 32 }}>
          <View className="flex-row justify-between items-center mb-4">
             <Text className="text-xl font-black text-gray-900">Ближайшие занятия</Text>
             <Pressable onPress={() => router.push('/parent/calendar' as any)}>
                <Text className="text-purple-600 font-bold text-sm">Календарь</Text>
             </Pressable>
          </View>
          
          <View className="bg-gray-50 rounded-[32px] p-8 items-center border border-gray-100">
             <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center mb-4 border border-gray-100">
                <Feather name="calendar" size={28} color="#D1D5DB" />
             </View>
             <Text className="text-gray-400 font-bold text-sm mb-4 text-center">Пока нет запланированных занятий</Text>
             <Pressable 
                onPress={() => router.push('/parent/clubs' as any)}
                className="bg-purple-600 px-6 py-3 rounded-2xl"
             >
                <Text className="text-white font-black text-sm uppercase">Найти кружок</Text>
             </Pressable>
          </View>
        </View>
      </ScrollView>

      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
    </View>
  );
}
