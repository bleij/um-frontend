import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS } from "../../../constants/theme";

const MOCK_APPLICATIONS = [
  {
    id: "1",
    childName: "Мария Иванова",
    age: 7,
    parent: "Екатерина Иванова",
    club: "Художественная студия",
    date: "25 фев 2026",
    status: "new",
    avatar: "https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    childName: "Дмитрий Петров",
    age: 14,
    parent: "Андрей Петров",
    club: "Футбольная школа",
    date: "26 фев 2026",
    status: "new",
    avatar: "https://images.unsplash.com/photo-1510340842445-b6b8a6c0762e?w=100&h=100&fit=crop",
  },
];

export default function OrgApplications() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [apps, setApps] = useState(MOCK_APPLICATIONS);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setApps(prev => prev.filter(a => a.id !== id));
    Alert.alert(
      action === 'approve' ? "Одобрено" : "Отклонено",
      `Заявка ${action === 'approve' ? 'принята' : 'отклонена'}.`
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
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
                <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Заявки на запись</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{apps.length} новых заявок</Text>
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
        {apps.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
              <Feather name="check" size={32} color="#D1D5DB" />
            </View>
            <Text style={{ color: "#9CA3AF", fontSize: 16, fontWeight: "700" }}>Новых заявок пока нет</Text>
          </View>
        ) : (
          apps.map(app => (
            <View 
              key={app.id} 
              style={SHADOWS.md} 
              className="bg-white rounded-[40px] p-6 mb-6 border border-gray-50"
            >
              <View className="flex-row items-center gap-4 mb-6">
                <Image source={{ uri: app.avatar }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                <View className="flex-1">
                   <Text className="text-xl font-black text-gray-900">{app.childName}</Text>
                   <Text className="text-xs text-gray-400 font-bold uppercase mt-1">{app.age} ЛЕТ · {app.parent}</Text>
                </View>
              </View>

              <View className="bg-blue-50 p-5 rounded-3xl mb-8 flex-row items-center gap-4">
                 <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
                    <Feather name="book-open" size={18} color="#3B82F6" />
                 </View>
                 <View>
                    <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">ВЫБРАННЫЙ КУРС</Text>
                    <Text className="text-base font-bold text-gray-900">{app.club}</Text>
                 </View>
              </View>

              <View className="flex-row gap-4">
                 <Pressable 
                    onPress={() => handleAction(app.id, 'reject')}
                    className="flex-1 h-14 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100"
                 >
                    <Text className="text-gray-400 font-black text-sm uppercase">Отклонить</Text>
                 </Pressable>
                 <Pressable 
                    onPress={() => handleAction(app.id, 'approve')}
                    className="flex-[1.5] h-14 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-200"
                 >
                    <Text className="text-white font-black text-sm uppercase">Одобрить</Text>
                 </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
