import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../../constants/theme";

export default function CourseEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

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
      {/* Header - Unified Brand Style */}
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
                <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white" }}>Редактировать курс</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

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
          <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
             <View style={{ gap: SPACING.xl }}>
                <View>
                   <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Название курса *</Text>
                   <TextInput
                      style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="Например: Английский язык"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={formData.title}
                      onChangeText={(val) => setFormData({...formData, title: val})}
                   />
                </View>

                <View>
                   <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Описание</Text>
                   <TextInput
                      style={{ backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border, minHeight: 120 }}
                      placeholder="О чем этот курс?"
                      placeholderTextColor={COLORS.mutedForeground}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={formData.description}
                      onChangeText={(val) => setFormData({...formData, description: val})}
                   />
                </View>

                <View style={{ flexDirection: 'row', gap: SPACING.md }}>
                   <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Уровень</Text>
                      <TouchableOpacity style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                         <Text style={{ fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground }}>Начальный</Text>
                      </TouchableOpacity>
                   </View>
                   <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Статус</Text>
                      <TouchableOpacity style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                         <Text style={{ fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground }}>Активный</Text>
                      </TouchableOpacity>
                   </View>
                </View>

                <View>
                   <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Цена (₸/мес) *</Text>
                   <TextInput
                      style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="0"
                      placeholderTextColor={COLORS.mutedForeground}
                      keyboardType="numeric"
                      value={formData.price}
                      onChangeText={(val) => setFormData({...formData, price: val})}
                   />
                </View>
             </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{ height: 60, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xxl, backgroundColor: loading ? COLORS.border : COLORS.primary, ...SHADOWS.md }}
          >
             <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 16 }}>
                {loading ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ ИЗМЕНЕНИЯ"}
             </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ height: 56, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.md }}>
             <Text style={{ color: COLORS.destructive, fontWeight: TYPOGRAPHY.weight.bold, fontSize: 14 }}>УДАЛИТЬ КУРС</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </View>
  );
}
