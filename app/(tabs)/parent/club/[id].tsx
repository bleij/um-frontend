import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SHADOWS } from "../../../../constants/theme";
import { useAuth } from "../../../../contexts/AuthContext";
import { useParentData } from "../../../../contexts/ParentDataContext";
import {
  applyToCourse,
  courseGradient,
  usePublicCourseById,
} from "../../../../hooks/usePublicData";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Начальный",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

// Hardcoded mock reviews — real reviews table is a future feature
const REVIEWS = [
  { id: 1, author: "Елена К.", rating: 5, text: "Отличная студия! Дочка с удовольствием ходит на занятия." },
  { id: 2, author: "Андрей М.", rating: 5, text: "Профессиональный подход, видны результаты." },
];

export default function ParentClubDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { childrenProfile, activeChildId } = useParentData();
  const activeChild =
    childrenProfile.find((c) => c.id === activeChildId) || childrenProfile[0];

  const { course, groups, loading } = usePublicCourseById(id);
  const [gradient] = useState<[string, string]>(courseGradient(0));

  const [enrolled, setEnrolled] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const handleConfirmBooking = async () => {
    if (!course || !activeChild) return;
    setApplying(true);
    const result = await applyToCourse({
      orgId: course.org_id,
      courseTitle: course.title,
      childName: activeChild.name,
      childAge: activeChild.age ?? null,
      parentName: user ? `${user.firstName} ${user.lastName}`.trim() : undefined,
    });
    setApplying(false);
    if (result.error) {
      Alert.alert("Ошибка", result.error);
      return;
    }
    setEnrolled(true);
    setShowBookingModal(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Feather name="alert-circle" size={40} color="#D1D5DB" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#9CA3AF", textAlign: "center" }}>
          Курс не найден
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: "#6C5CE7", borderRadius: 16 }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>Вернуться</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const displayLevel = LEVEL_LABELS[course.level] ?? course.level;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
        {/* Hero gradient */}
        <View style={{ position: "relative" }}>
          <LinearGradient
            colors={gradient}
            style={{ width: "100%", height: 280, alignItems: "center", justifyContent: "center" }}
          >
            <Feather name={(course.icon as any) || "book-open"} size={72} color="rgba(255,255,255,0.9)" />
            {course.org_name ? (
              <View style={{ position: "absolute", bottom: 20, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" }}>
                <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>{course.org_name}</Text>
              </View>
            ) : null}
          </LinearGradient>

          <SafeAreaView style={{ position: "absolute", top: Platform.OS === "ios" ? 0 : 10, left: 16 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center", ...SHADOWS.sm }}
            >
              <Feather name="arrow-left" size={22} color="#1F2937" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={{ padding: 20, marginTop: -32, backgroundColor: "#F9FAFB", borderTopLeftRadius: 36, borderTopRightRadius: 36 }}>
          {/* Title */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: "#6C5CE7", fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {displayLevel}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FEF3C7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Feather name="star" size={13} color="#F59E0B" />
                <Text style={{ fontSize: 12, fontWeight: "800", color: "#B45309", marginLeft: 4 }}>Новое</Text>
              </View>
            </View>
            <Text style={{ fontSize: 26, fontWeight: "900", color: "#111827" }}>{course.title}</Text>
            {course.description ? (
              <Text style={{ fontSize: 15, color: "#6B7280", marginTop: 6, lineHeight: 22 }}>
                {course.description}
              </Text>
            ) : null}
          </View>

          {/* Quick stats */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24, backgroundColor: "white", borderRadius: 24, padding: 16, ...SHADOWS.sm }}>
            <View style={{ alignItems: "center", flex: 1 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                <Feather name="tag" size={18} color="#6C5CE7" />
              </View>
              <Text style={{ fontSize: 10, color: "#9CA3AF", fontWeight: "600" }}>Уровень</Text>
              <Text style={{ fontSize: 12, fontWeight: "800", color: "#111827", marginTop: 2, textAlign: "center" }}>{displayLevel}</Text>
            </View>
            {(course.age_min || course.age_max) ? (
              <View style={{ alignItems: "center", flex: 1 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                  <Feather name="users" size={18} color="#6C5CE7" />
                </View>
                <Text style={{ fontSize: 10, color: "#9CA3AF", fontWeight: "600" }}>Возраст</Text>
                <Text style={{ fontSize: 12, fontWeight: "800", color: "#111827", marginTop: 2 }}>
                  {course.age_min ?? ""}–{course.age_max ?? ""} лет
                </Text>
              </View>
            ) : null}
            <View style={{ alignItems: "center", flex: 1 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                <Feather name="layers" size={18} color="#6C5CE7" />
              </View>
              <Text style={{ fontSize: 10, color: "#9CA3AF", fontWeight: "600" }}>Группы</Text>
              <Text style={{ fontSize: 12, fontWeight: "800", color: "#111827", marginTop: 2 }}>{groups.length}</Text>
            </View>
          </View>

          {/* Skills */}
          {course.skills.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 17, fontWeight: "900", color: "#1F2937", marginBottom: 12 }}>Развиваемые навыки</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {course.skills.map((skill) => (
                  <View key={skill} style={{ backgroundColor: "rgba(108,92,231,0.08)", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, borderWidth: 1, borderColor: "rgba(108,92,231,0.15)" }}>
                    <Text style={{ color: "#6C5CE7", fontWeight: "800", fontSize: 12 }}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Reviews */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 17, fontWeight: "900", color: "#1F2937" }}>Отзывы</Text>
            </View>
            {REVIEWS.map((item) => (
              <View key={item.id} style={{ backgroundColor: "white", borderRadius: 20, padding: 16, marginBottom: 10, ...SHADOWS.sm }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <Text style={{ fontWeight: "800", color: "#1F2937" }}>{item.author}</Text>
                  <View style={{ flexDirection: "row", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Feather key={s} name="star" size={11} color={s <= item.rating ? "#F59E0B" : "#E5E7EB"} />
                    ))}
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 20 }}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", padding: 20, paddingBottom: Platform.OS === "ios" ? 36 : 20, borderTopLeftRadius: 28, borderTopRightRadius: 28, ...SHADOWS.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 11, color: "#9CA3AF", fontWeight: "600" }}>Стоимость</Text>
          <Text style={{ fontSize: 20, fontWeight: "900", color: "#111827" }}>
            {course.price.toLocaleString()} ₸/мес
          </Text>
        </View>
        {enrolled ? (
          <View style={{ backgroundColor: "#22C55E", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name="check-circle" size={18} color="white" />
            <Text style={{ color: "white", fontWeight: "900", fontSize: 15 }}>Вы записаны</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowBookingModal(true)}
            style={{ backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 20 }}
          >
            <Text style={{ color: "white", fontWeight: "900", fontSize: 15 }}>Записаться</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Booking modal */}
      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "white", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, ...SHADOWS.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: "900", color: COLORS.foreground }}>Запись в группу</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)} style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
                <Feather name="x" size={22} color={COLORS.mutedForeground} />
              </TouchableOpacity>
            </View>

            {/* Selected child */}
            {activeChild && (
              <View style={{ backgroundColor: COLORS.primary + "10", padding: 14, borderRadius: 18, flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                    {activeChild.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: COLORS.mutedForeground, fontWeight: "700", textTransform: "uppercase" }}>Ребёнок</Text>
                  <Text style={{ fontSize: 17, fontWeight: "900", color: COLORS.foreground }}>{activeChild.name}</Text>
                </View>
              </View>
            )}

            <Text style={{ fontSize: 15, fontWeight: "800", color: COLORS.foreground, marginBottom: 12 }}>
              {groups.length > 0 ? "Выберите группу" : "Расписание уточняется"}
            </Text>

            {groups.length > 0 ? (
              <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                {groups.map((group) => (
                  <Pressable
                    key={group.id}
                    onPress={() => setSelectedGroupId(group.id)}
                    style={{
                      flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                      padding: 14, borderRadius: 18, marginBottom: 10,
                      borderWidth: 2, borderColor: selectedGroupId === group.id ? COLORS.primary : "#F3F4F6",
                      backgroundColor: selectedGroupId === group.id ? COLORS.primary + "05" : "white",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "800", color: COLORS.foreground }}>{group.name}</Text>
                      {group.schedule ? (
                        <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginTop: 3 }}>{group.schedule}</Text>
                      ) : null}
                      <Text style={{ fontSize: 11, color: COLORS.mutedForeground, marginTop: 2 }}>
                        Мест: {group.capacity - group.enrolled > 0 ? `${group.capacity - group.enrolled} свободно` : "Группа полная"}
                      </Text>
                    </View>
                    <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selectedGroupId === group.id ? COLORS.primary : "#D1D5DB", alignItems: "center", justifyContent: "center" }}>
                      {selectedGroupId === group.id && (
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary }} />
                      )}
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View style={{ backgroundColor: "#F9FAFB", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                <Text style={{ color: COLORS.mutedForeground, fontSize: 14, textAlign: "center" }}>
                  Организация скоро добавит группы с расписанием
                </Text>
              </View>
            )}

            <TouchableOpacity
              disabled={applying || (groups.length > 0 && !selectedGroupId)}
              onPress={handleConfirmBooking}
              style={{
                backgroundColor: applying || (groups.length > 0 && !selectedGroupId) ? "#E5E7EB" : COLORS.primary,
                paddingVertical: 18, borderRadius: 22, alignItems: "center", marginTop: 16,
              }}
            >
              <Text style={{ color: applying || (groups.length > 0 && !selectedGroupId) ? "#9CA3AF" : "white", fontSize: 16, fontWeight: "900" }}>
                {applying ? "Отправка..." : "Подтвердить заявку"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
