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
import { COLORS, LAYOUT, SHADOWS, SPACING, RADIUS, TYPOGRAPHY } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { useParentData } from "../../contexts/ParentDataContext";
import { courses } from "../../data/courses";

export default function ParentHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const {
    parentProfile,
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
      {/* Header */}
      <View style={{ backgroundColor: COLORS.primary, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: 24 }}
        >
          <SafeAreaView edges={["top"]}>
            <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.light, color: "white", opacity: 0.85 }}>
                    Привет,
                  </Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: "white", letterSpacing: -0.5, marginTop: -4 }}>
                    {user?.firstName || parentProfile?.name || 'Родитель'}!
                  </Text>
                </View>
                <Pressable
                  onPress={() => setNotificationsVisible(true)}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: RADIUS.lg,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.3)",
                    ...(Platform.OS === 'web' && { cursor: 'pointer' } as any),
                  }}
                >
                  <Feather name="bell" size={20} color="white" />
                  <View
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      width: 10,
                      height: 10,
                      backgroundColor: COLORS.destructive,
                      borderRadius: 5,
                      borderWidth: 1.5,
                      borderColor: 'rgba(255,255,255,0.4)'
                    }}
                  />
                </Pressable>
              </View>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "500", marginTop: 4 }}>
                Узнайте, как развиваются ваши дети сегодня.
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

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
               onPress={() => router.push('/profile/youth/create-profile-child' as any)}
               className="w-36 p-5 bg-gray-50 rounded-[32px] items-center justify-center border-2 border-dashed border-gray-100"
            >
               <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-2">
                  <Feather name="plus" size={20} color="#9CA3AF" />
               </View>
               <Text className="text-xs font-bold text-gray-400 text-center">Добавить</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Dashboard Insight Widget (Tariff Based) */}
        <View style={{ paddingHorizontal: horizontalPadding, marginTop: 32 }}>
           {parentProfile?.tariff === 'pro' ? (
              <View style={SHADOWS.md} className="bg-purple-50 rounded-[32px] p-6 border border-purple-100 flex-row items-center">
                 <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4 border-2 border-purple-200">
                    <Feather name="message-circle" size={20} color="#6C5CE7" />
                 </View>
                 <View className="flex-1 pr-2">
                    <Text className="text-purple-900 font-bold text-sm mb-1">Сообщение от Ментора</Text>
                    <Text className="text-purple-700 text-xs leading-4">«{activeChild?.name} показывает отличные результаты в логике. Я подобрал новые секции!»</Text>
                    <View className="flex-row gap-2 mt-3">
                       <Pressable onPress={() => router.push('/chats' as any)} className="bg-purple-600 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                          <Text className="text-white font-black text-[10px] uppercase tracking-widest">Чат 🔥</Text>
                       </Pressable>
                       <Pressable onPress={() => router.push('/parent/mentors' as any)} className="bg-white px-3 py-1.5 rounded-full border border-purple-200 flex-row items-center gap-1">
                          <Feather name="users" size={10} color="#6C5CE7" />
                          <Text className="text-purple-600 font-black text-[10px] uppercase tracking-widest">Менторы</Text>
                       </Pressable>
                    </View>
                 </View>
              </View>
           ) : (
              <View style={SHADOWS.sm} className="bg-blue-50 rounded-[32px] p-6 border border-blue-100 flex-row items-center">
                 <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4 shadow-sm border border-blue-50">
                    <Feather name="cpu" size={20} color="#3B82F6" />
                 </View>
                 <View className="flex-1 pr-2">
                    <Text className="text-blue-900 font-bold text-sm mb-1">AI Ассистент</Text>
                    <Text className="text-blue-700 text-xs leading-4">Я проанализировал первичный тест. У {activeChild?.name} склонность к творчеству!</Text>
                    <Pressable onPress={() => router.push('/parent/subscription' as any)} className="mt-3 bg-white self-start px-3 py-1.5 rounded-full border border-blue-200">
                       <Text className="text-blue-600 font-black text-[10px] uppercase tracking-widest">PRO Подробности</Text>
                    </Pressable>
                 </View>
              </View>
           )}
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
