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

export default function StaffAddScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [formData, setFormData] = useState({ fullName: "", phone: "", email: "", specialization: "" });
  const [loading, setLoading] = useState(false);
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Добавить учителя</Text>
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View className="bg-blue-50 p-6 rounded-[32px] mb-8 flex-row items-center gap-4 border border-blue-100">
           <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
              <Feather name="send" size={20} color="#3B82F6" />
           </View>
           <View className="flex-1">
              <Text className="text-blue-900 font-bold mb-1">Приглашение</Text>
              <Text className="text-blue-700 text-xs leading-4 font-medium">После добавления учитель получит СМС-приглашение в личный кабинет.</Text>
           </View>
        </View>

        <View style={SHADOWS.md} className="bg-white rounded-[40px] p-8 gap-8 border border-gray-50">
           <View>
              <Text className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">ФИО УЧИТЕЛЯ</Text>
              <TextInput 
                 className="h-14 bg-gray-50 rounded-2xl px-5 font-bold text-gray-900 border border-gray-100"
                 placeholder="Имя Фамилия"
                 value={formData.fullName}
                 onChangeText={v => setFormData({...formData, fullName: v})}
              />
           </View>

           <View>
              <Text className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">НОМЕР ТЕЛЕФОНА</Text>
              <TextInput 
                 className="h-14 bg-gray-50 rounded-2xl px-5 font-bold text-gray-900 border border-gray-100"
                 placeholder="+7 (___) ___ __ __"
                 keyboardType="phone-pad"
                 value={formData.phone}
                 onChangeText={v => setFormData({...formData, phone: v})}
              />
           </View>

           <View>
              <Text className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">Специализация</Text>
              <TextInput 
                 className="h-14 bg-gray-50 rounded-2xl px-5 font-bold text-gray-900 border border-gray-100"
                 placeholder="Напр. Робототехника"
                 value={formData.specialization}
                 onChangeText={v => setFormData({...formData, specialization: v})}
              />
           </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading || !formData.fullName || !formData.phone}
          style={SHADOWS.md}
          className={`h-16 rounded-3xl items-center justify-center mt-8 ${loading || !formData.fullName || !formData.phone ? 'bg-gray-200' : 'bg-blue-600'}`}
        >
           <Text className="text-white font-black uppercase text-sm">{loading ? "ОТПРАВКА..." : "ПРИГЛАСИТЬ УЧИТЕЛЯ"}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
