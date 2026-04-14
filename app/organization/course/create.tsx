import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
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

interface Skill {
  name: string;
}

export default function CreateCourseScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", level: "beginner", price: "" });
  const [skills, setSkills] = useState<Skill[]>([]);
  
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const skillOptions = [
    "Логика", "Креативность", "Команда", "Лидерство", "Крит. мышление", 
    "Коммуникация", "Код", "Дизайн", "Математика", "Языки"
  ];

  const toggleSkill = (name: string) => {
    if (skills.find(s => s.name === name)) {
      setSkills(skills.filter(s => s.name !== name));
    } else {
      setSkills([...skills, { name }]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) return;
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
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Создать курс</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 24,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={SHADOWS.md} className="bg-white rounded-[40px] p-8 gap-8 border border-gray-50">
            <View>
              <Text className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">Название курса</Text>
              <TextInput 
                className="h-14 bg-gray-50 rounded-2xl px-5 font-bold text-gray-900 border border-gray-100"
                placeholder="Напр. Робототехника"
                value={formData.title}
                onChangeText={v => setFormData({...formData, title: v})}
              />
            </View>

            <View>
              <Text className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">Описание</Text>
              <TextInput 
                className="min-h-[120] bg-gray-50 rounded-3xl px-5 py-4 font-medium text-gray-900 border border-gray-100"
                placeholder="О чем этот курс..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.description}
                onChangeText={v => setFormData({...formData, description: v})}
              />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">Цена (₸/мес)</Text>
                <TextInput 
                  className="h-14 bg-gray-50 rounded-2xl px-5 font-bold text-gray-900 border border-gray-100"
                  placeholder="0"
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={v => setFormData({...formData, price: v})}
                />
              </View>
            </View>
          </View>

          <View style={SHADOWS.md} className="bg-white rounded-[40px] p-8 mt-8 border border-gray-50">
             <Text className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4 px-1">РАЗВИВАЕМЫЕ НАВЫКИ</Text>
             <View className="flex-row flex-wrap gap-2">
                {skillOptions.map(skill => {
                   const isSelected = skills.some(s => s.name === skill);
                   return (
                      <Pressable 
                         key={skill}
                         onPress={() => toggleSkill(skill)}
                         className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-100'}`}
                      >
                         <Text className={`text-[10px] font-black uppercase ${isSelected ? 'text-white' : 'text-gray-400'}`}>{skill}</Text>
                      </Pressable>
                   )
                })}
             </View>
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={loading || !formData.title}
            style={SHADOWS.md}
            className={`h-16 rounded-3xl items-center justify-center mt-8 ${loading || !formData.title ? 'bg-gray-200' : 'bg-blue-600'}`}
          >
             <Text className="text-white font-black uppercase text-sm">{loading ? "СОХРАНЕНИЕ..." : "СОЗДАТЬ КУРС"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
