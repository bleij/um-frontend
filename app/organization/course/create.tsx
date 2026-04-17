import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS, RADIUS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

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
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

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
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: SPACING.xl }}
        >
          <SafeAreaView edges={["top"]}>
            <View style={{ paddingHorizontal: paddingX, paddingTop: SPACING.md }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: RADIUS.md,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: SPACING.md,
                  }}
                >
                  <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white" }}>Создать курс</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: paddingX,
            paddingTop: SPACING.xl,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
          >
            <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xl }}>
              <View>
                <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Название курса</Text>
                <TextInput 
                  style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border }}
                  placeholder="Напр. Робототехника"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={formData.title}
                  onChangeText={v => setFormData({...formData, title: v})}
                />
              </View>

              <View>
                <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Описание</Text>
                <TextInput 
                  style={{ minHeight: 120, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border }}
                  placeholder="О чем этот курс..."
                  placeholderTextColor={COLORS.mutedForeground}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={v => setFormData({...formData, description: v})}
                />
              </View>

              <View>
                <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Цена (₸/мес)</Text>
                <TextInput 
                  style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border }}
                  placeholder="0"
                  placeholderTextColor={COLORS.mutedForeground}
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={v => setFormData({...formData, price: v})}
                />
              </View>
            </View>

            <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginTop: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
               <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.lg }}>РАЗВИВАЕМЫЕ НАВЫКИ</Text>
               <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
                  {skillOptions.map(skill => {
                     const isSelected = skills.some(s => s.name === skill);
                     return (
                        <TouchableOpacity 
                           key={skill}
                           onPress={() => toggleSkill(skill)}
                           style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.full, borderWidth: 1, borderColor: isSelected ? COLORS.primary : COLORS.border, backgroundColor: isSelected ? COLORS.primary : COLORS.white }}
                        >
                           <Text style={{ fontSize: 11, fontWeight: TYPOGRAPHY.weight.bold, color: isSelected ? "white" : COLORS.mutedForeground }}>{skill.toUpperCase()}</Text>
                        </TouchableOpacity>
                     )
                  })}
               </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading || !formData.title}
              style={{ ...SHADOWS.md, height: 60, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xxxl, backgroundColor: loading || !formData.title ? COLORS.border : COLORS.primary }}
            >
               <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 16 }}>{loading ? "СОХРАНЕНИЕ..." : "СОЗДАТЬ КУРС"}</Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
