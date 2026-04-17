import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

interface Teacher {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  specialization: string;
  rating: number;
  status: "active" | "invited" | "inactive";
}

const MOCK_TEACHERS: Teacher[] = [
  {
    id: "1",
    full_name: "Анна Петрова",
    phone: "+7 701 123 45 67",
    email: "anna@example.com",
    specialization: "Рисование и живопись",
    rating: 4.9,
    status: "active",
  },
  {
    id: "2",
    full_name: "Игорь Соколов",
    phone: "+7 707 987 65 43",
    email: "igor@example.com",
    specialization: "Робототехника",
    rating: 4.7,
    status: "invited",
  },
  {
    id: "3",
    full_name: "Марина Иванова",
    phone: "+7 702 555 11 22",
    email: "marina@example.com",
    specialization: "Английский язык",
    rating: 4.8,
    status: "active",
  },
];

export default function OrgStaffScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [loading] = useState(false);

  const getStatusBadge = (status: Teacher["status"]) => {
    switch (status) {
      case "active":
        return (
          <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.md, backgroundColor: 'rgba(52, 199, 89, 0.1)' }}>
            <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.success }}>АКТИВЕН</Text>
          </View>
        );
      case "invited":
        return (
          <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.md, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: "#F59E0B" }}>ПРИГЛАШЕН</Text>
          </View>
        );
      case "inactive":
        return (
          <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.md, backgroundColor: COLORS.background }}>
            <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground }}>НЕАКТИВЕН</Text>
          </View>
        );
      default:
        return null;
    }
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
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: paddingX, paddingTop: SPACING.md }}>
              <View>
                <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.bold, color: "white" }}>Учителя</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium, marginTop: 2 }}>Преподавательский состав</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/organization/staff/add" as any)}
                style={{ width: 52, height: 52, borderRadius: RADIUS.md, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
              >
                <Feather name="plus" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingX,
          paddingTop: SPACING.xl,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Summary Card */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{teachers.length}</Text>
            <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1 }}>Всего</Text>
          </View>
          <View style={{ width: 1, height: '100%', backgroundColor: COLORS.border }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.success }}>{teachers.filter((t) => t.status === "active").length}</Text>
            <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1 }}>Активных</Text>
          </View>
          <View style={{ width: 1, height: '100%', backgroundColor: COLORS.border }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: "#F59E0B" }}>{teachers.filter((t) => t.status === "invited").length}</Text>
            <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1 }}>Новых</Text>
          </View>
        </View>

        {/* Teachers List */}
        {loading ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
          </View>
        ) : teachers.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border }}>
            <View style={{ width: 80, height: 80, backgroundColor: COLORS.background, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl }}>
              <Feather name="users" size={32} color={COLORS.mutedForeground} />
            </View>
            <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 8 }}>Нет учителей</Text>
            <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 20 }}>Добавьте первого преподавателя для вашей организации</Text>
            <TouchableOpacity onPress={() => router.push("/organization/staff/add" as any)} style={{ backgroundColor: COLORS.primary, paddingHorizontal: 32, height: 56, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', ...SHADOWS.md }}>
               <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 16 }}>Добавить учителя</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: SPACING.lg }}>
            {teachers.map((teacher, idx) => (
              <MotiView
                key={teacher.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: idx * 100 }}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/organization/staff/${teacher.id}` as any)}
                  style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: 40, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xl, marginBottom: SPACING.xl }}>
                    <View style={{ width: 64, height: 64, borderRadius: RADIUS.full, backgroundColor: 'rgba(108, 92, 231, 0.05)', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: COLORS.primary, fontSize: 24, fontWeight: TYPOGRAPHY.weight.bold }}>{teacher.full_name.charAt(0)}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{teacher.full_name}</Text>
                        {getStatusBadge(teacher.status)}
                      </View>
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.medium }}>{teacher.specialization}</Text>
                    </View>
                  </View>

                  <View style={{ gap: SPACING.sm, marginBottom: SPACING.xl }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Feather name="phone" size={14} color={COLORS.mutedForeground} />
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.medium }}>{teacher.phone}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Feather name="mail" size={14} color={COLORS.mutedForeground} />
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.medium }}>{teacher.email}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: SPACING.md }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/organization/staff/${teacher.id}` as any)}
                      style={{ flex: 1, height: 48, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text style={{ color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.bold, fontSize: 14 }}>ПОДРОБНЕЕ</Text>
                    </TouchableOpacity>
                    {teacher.status === "invited" && (
                       <TouchableOpacity style={{ paddingHorizontal: 24, height: 48, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', ...SHADOWS.md }}>
                        <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 14 }}>НАПОМНИТЬ</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
