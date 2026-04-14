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

export default function TaskCreateScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    groupId: "",
    dueDate: "",
    xp: "50",
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Новое задание</Text>
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
                 <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Название задания *</Text>
                 <TextInput
                    className="h-14 bg-gray-50 rounded-2xl px-4 font-medium text-gray-900 border border-gray-100"
                    placeholder="Например: Домашняя работа №1"
                    value={formData.title}
                    onChangeText={(val) => setFormData({...formData, title: val})}
                 />
              </View>

              <View>
                 <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Инструкции</Text>
                 <TextInput
                    className="bg-gray-50 rounded-2xl px-4 py-4 font-medium text-gray-900 border border-gray-100"
                    placeholder="Что нужно сделать?"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={formData.description}
                    onChangeText={(val) => setFormData({...formData, description: val})}
                 />
              </View>

              <View>
                 <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">XP за выполнение</Text>
                 <TextInput
                    className="h-14 bg-gray-50 rounded-2xl px-4 font-medium text-gray-900 border border-gray-100"
                    placeholder="50"
                    keyboardType="numeric"
                    value={formData.xp}
                    onChangeText={(val) => setFormData({...formData, xp: val})}
                 />
              </View>

              <View>
                 <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Срок выполнения</Text>
                 <Pressable className="h-14 bg-gray-50 rounded-2xl px-4 flex-row items-center justify-between border border-gray-100">
                    <Text className="font-medium text-gray-700">{formData.dueDate || "Выберите дату"}</Text>
                    <Feather name="calendar" size={18} color={COLORS.primary} />
                 </Pressable>
              </View>
           </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading || !formData.title}
          className={`h-16 rounded-2xl items-center justify-center mt-8 shadow-lg ${loading || !formData.title ? 'bg-gray-200' : 'bg-primary shadow-primary/20'}`}
        >
           <Text className="text-white font-bold text-lg">
              {loading ? "Создание..." : "Опубликовать задание"}
           </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
