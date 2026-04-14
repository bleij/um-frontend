import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import { COLORS, LAYOUT, SHADOWS } from "../../../../constants/theme";

export default function CourseEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [formData, setFormData] = useState({
    title: "Робототехника",
    description: "Изучение основ электроники и программирования микроконтроллеров.",
    level: "beginner",
    price: "25000",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Редактировать курс</Text>
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
      >
        <View style={SHADOWS.md} className="bg-white rounded-[32px] p-6 border border-gray-100">
           <View className="gap-6">
              <View>
                 <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Название курса *</Text>
                 <TextInput
                    className="h-14 bg-gray-50 rounded-2xl px-4 font-medium text-gray-900 border border-gray-100"
                    placeholder="Например: Английский язык"
                    value={formData.title}
                    onChangeText={(val) => setFormData({...formData, title: val})}
                 />
              </View>

              <View>
                 <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Описание</Text>
                 <TextInput
                    className="bg-gray-50 rounded-2xl px-4 py-4 font-medium text-gray-900 border border-gray-100"
                    placeholder="О чем этот курс?"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={formData.description}
                    onChangeText={(val) => setFormData({...formData, description: val})}
                 />
              </View>

              <View className="flex-row gap-3">
                 <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Уровень</Text>
                    <View className="h-14 bg-gray-50 rounded-2xl px-4 justify-center border border-gray-100">
                       <Text className="font-medium text-gray-900">Начальный</Text>
                    </View>
                 </View>
                 <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Статус</Text>
                    <View className="h-14 bg-gray-50 rounded-2xl px-4 justify-center border border-gray-100">
                       <Text className="font-medium text-gray-900">Активный</Text>
                    </View>
                 </View>
              </View>

              <View>
                 <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Цена (₸/мес) *</Text>
                 <TextInput
                    className="h-14 bg-gray-50 rounded-2xl px-4 font-medium text-gray-900 border border-gray-100"
                    placeholder="0"
                    keyboardType="numeric"
                    value={formData.price}
                    onChangeText={(val) => setFormData({...formData, price: val})}
                 />
              </View>
           </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className={`h-16 rounded-2xl items-center justify-center mt-8 shadow-lg ${loading ? 'bg-gray-200' : 'bg-primary shadow-primary/20'}`}
        >
           <Text className="text-white font-bold text-lg">
              {loading ? "Сохранение..." : "Сохранить изменения"}
           </Text>
        </Pressable>

        <Pressable
          className="h-14 rounded-2xl items-center justify-center mt-4"
        >
           <Text className="text-red-500 font-bold">Удалить курс</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
