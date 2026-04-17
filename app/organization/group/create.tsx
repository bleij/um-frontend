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
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

export default function GroupCreateScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const [formData, setFormData] = useState({
    name: "",
    teacherId: "",
    maxStudents: "12",
    schedule: "",
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
                <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white" }}>Создать группу</Text>
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
                   <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Название группы *</Text>
                    <TextInput
                      style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="Напр: Утренняя группа"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={formData.name}
                      onChangeText={(val) => setFormData({...formData, name: val})}
                   />
                </View>

                <View>
                   <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Выбрать учителя</Text>
                   <TouchableOpacity style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.border }}>
                      <Text style={{ fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: formData.teacherId ? COLORS.foreground : COLORS.mutedForeground }}>{formData.teacherId ? "Игорь Соколов" : "Не выбран"}</Text>
                      <Feather name="chevron-down" size={18} color={COLORS.mutedForeground} />
                   </TouchableOpacity>
                </View>

                <View>
                   <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Расписание</Text>
                   <TextInput
                      style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="Напр: Вт, Чт 16:00"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={formData.schedule}
                      onChangeText={(val) => setFormData({...formData, schedule: val})}
                   />
                </View>

                <View>
                   <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>Макс. учеников</Text>
                   <TextInput
                      style={{ height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: 16, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.foreground, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="12"
                      placeholderTextColor={COLORS.mutedForeground}
                      keyboardType="numeric"
                      value={formData.maxStudents}
                      onChangeText={(val) => setFormData({...formData, maxStudents: val})}
                   />
                </View>
             </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !formData.name}
            style={{ height: 60, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xxl, backgroundColor: loading || !formData.name ? COLORS.border : COLORS.primary, ...SHADOWS.md }}
          >
             <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 16 }}>
                {loading ? "СОЗДАНИЕ..." : "СОЗДАТЬ ГРУППУ"}
             </Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </View>
  );
}
