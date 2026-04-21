import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { useParentData } from "../../../contexts/ParentDataContext";

function generateQRToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}-${Math.random().toString(36).slice(2, 9)}`;
}

type AgeGroup = "6-11" | "12-17" | "18-20";

type Child = {
  id: string;
  name: string;
  ageGroup: AgeGroup | null;
  hasPhone: boolean | null;
  phone: string;
  qrToken: string | null;
};

const AGE_OPTIONS: { label: string; value: AgeGroup }[] = [
  { label: "Ребенок (6-11)", value: "6-11" },
  { label: "Подросток (12-17)", value: "12-17" },
];

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function CreateProfileParent() {
  const router = useRouter();
  const { user } = useAuth();
  const { saveParentProfile } = useParentData();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;

  const [parentData, setParentData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;

    setParentData((prev) => ({
      ...prev,
      firstName: prev.firstName || user.firstName,
      lastName: prev.lastName || user.lastName,
      phone: prev.phone || user.phone,
    }));
  }, [user]);

  const [children, setChildren] = useState<Child[]>([
    { id: makeId(), name: "", ageGroup: null, hasPhone: null, phone: "", qrToken: null },
  ]);

  const canContinue = useMemo(() => {
    const hasParent = parentData.firstName.trim().length > 0;
    const hasValidChild = children.some((c) => {
      if (!c.name.trim() || !c.ageGroup) return false;
      if (c.hasPhone === null) return false;
      if (c.hasPhone && !c.phone.trim()) return false;
      if (!c.hasPhone && !c.qrToken) return false;
      return true;
    });
    return hasParent && hasValidChild;
  }, [parentData, children]);

  function addChild() {
    setChildren((prev) => [
      ...prev,
      { id: makeId(), name: "", ageGroup: null, hasPhone: null, phone: "", qrToken: null },
    ]);
  }

  function removeChild(id: string) {
    setChildren((prev) => {
      const next = prev.filter((c) => c.id !== id);
      return next.length === 0
        ? [{ id: makeId(), name: "", ageGroup: null, hasPhone: null, phone: "", qrToken: null }]
        : next;
    });
  }

  function updateChild(id: string, patch: Partial<Child>) {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }

  const handleMockSubmit = async () => {
    await saveParentProfile(
      parentData,
      children.map((c) => ({
        id: c.id,
        name: c.name,
        ageGroup: c.ageGroup,
        phone: c.hasPhone ? c.phone : undefined,
        qrToken: !c.hasPhone ? (c.qrToken ?? undefined) : undefined,
      })),
    );
    router.push("/profile/common/done");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Background Blobs */}
      <View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
        <View style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: `${COLORS.primary}08`,
        }} />
        <View style={{
          position: 'absolute',
          top: '30%',
          left: -120,
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor: `${COLORS.secondary}05`,
        }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView edges={["top"]} style={{ zIndex: 20 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: horizontalPadding,
            paddingVertical: 12,
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={20} color={COLORS.foreground} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Создание профиля</Text>
          </View>
        </SafeAreaView>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 8,
            paddingBottom: 60,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: "100%", maxWidth: 600, alignSelf: 'center' }}>

            {/* Title Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={styles.title}>Родительский{'\n'}аккаунт</Text>
              <Text style={styles.subtitle}>
                Заполните информацию о себе и добавьте детей
              </Text>
            </View>

            {/* Parent Info Card */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.primary}10` }]}>
                  <Feather name="user" size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.cardTitle}>Ваши данные</Text>
              </View>

              <View style={{ gap: 20 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Имя</Text>
                    <TextInput
                      value={parentData.firstName}
                      onChangeText={(text) => setParentData({ ...parentData, firstName: text })}
                      placeholder="Имя"
                      placeholderTextColor={COLORS.tertiary}
                      style={styles.input}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Фамилия</Text>
                    <TextInput
                      value={parentData.lastName}
                      onChangeText={(text) => setParentData({ ...parentData, lastName: text })}
                      placeholder="Фамилия"
                      placeholderTextColor={COLORS.tertiary}
                      style={styles.input}
                    />
                  </View>
                </View>

                <View>
                  <Text style={styles.inputLabel}>Телефон</Text>
                  <TextInput
                    value={parentData.phone}
                    onChangeText={(text) => setParentData({ ...parentData, phone: text })}
                    placeholder="+7 (___) ___-__-__"
                    placeholderTextColor={COLORS.tertiary}
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                </View>
              </View>
            </MotiView>

            {/* Children Section Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 8 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.foreground }}>Дети</Text>
              <TouchableOpacity
                onPress={addChild}
                activeOpacity={0.7}
                style={styles.addButton}
              >
                <Feather name="plus" size={18} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Добавить</Text>
              </TouchableOpacity>
            </View>

            {/* Children Cards */}
            {children.map((child, index) => (
              <MotiView
                key={child.id}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: COLORS.muted }]}>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: COLORS.foreground }}>{index + 1}</Text>
                  </View>
                  <Text style={styles.cardTitle}>Ребенок</Text>
                  {children.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeChild(child.id)}
                      style={{ marginLeft: 'auto', padding: 4 }}
                    >
                      <Feather name="trash-2" size={20} color={COLORS.destructive} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{ gap: 24 }}>
                  <View>
                    <Text style={styles.inputLabel}>Имя ребенка</Text>
                    <TextInput
                      value={child.name}
                      onChangeText={(text) => updateChild(child.id, { name: text })}
                      placeholder="Например, Анна"
                      placeholderTextColor={COLORS.tertiary}
                      style={styles.input}
                    />
                  </View>

                  <View>
                    <Text style={styles.inputLabel}>Возрастная категория</Text>
                    <View style={{ gap: 10 }}>
                      {AGE_OPTIONS.map((opt) => {
                        const active = child.ageGroup === opt.value;
                        return (
                          <TouchableOpacity
                            key={opt.value}
                            onPress={() => updateChild(child.id, { ageGroup: opt.value })}
                            activeOpacity={0.7}
                            style={[
                              styles.optionCard,
                              active && styles.optionCardActive
                            ]}
                          >
                            <Text style={[
                              styles.optionText,
                              active && styles.optionTextActive
                            ]}>{opt.label}</Text>
                            {active && <Feather name="check-circle" size={20} color={COLORS.primary} />}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 24 }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.foreground, marginBottom: 16 }}>
                      Есть ли у ребёнка свой телефон?
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                      {(["YES", "NO"] as const).map((opt) => {
                        const active = opt === "YES" ? child.hasPhone === true : child.hasPhone === false;
                        return (
                          <TouchableOpacity
                            key={opt}
                            onPress={() => updateChild(child.id, { hasPhone: opt === "YES", phone: "", qrToken: null })}
                            style={[
                              styles.toggleOption,
                              active && styles.toggleOptionActive
                            ]}
                          >
                            <Text style={[
                              styles.toggleText,
                              active && styles.toggleTextActive
                            ]}>{opt === "YES" ? "Да" : "Нет"}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {child.hasPhone === true && (
                      <MotiView from={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <Text style={styles.inputLabel}>Номер телефона</Text>
                        <TextInput
                          value={child.phone}
                          onChangeText={(text) => updateChild(child.id, { phone: text.replace(/[^\d+]/g, "") })}
                          placeholder="+7 (___) ___-__-__"
                          placeholderTextColor={COLORS.tertiary}
                          keyboardType="phone-pad"
                          style={styles.input}
                        />
                      </MotiView>
                    )}

                    {child.hasPhone === false && (
                      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignItems: 'center' }}>
                        {child.qrToken ? (
                          <>
                            <View style={styles.qrContainer}>
                              <QRCode
                                value={JSON.stringify({ v: 1, type: "child_link", childId: child.id, parentId: user?.id ?? "", token: child.qrToken })}
                                size={160}
                                color={COLORS.foreground}
                              />
                            </View>
                            <Text style={styles.qrHint}>
                              Покажите этот QR-код ребёнку для{'\n'}входа в приложение
                            </Text>
                            <TouchableOpacity
                              onPress={() => updateChild(child.id, { qrToken: generateQRToken() })}
                              style={styles.refreshBtn}
                            >
                              <Feather name="refresh-cw" size={14} color={COLORS.primary} />
                              <Text style={styles.refreshText}>Обновить QR-код</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <TouchableOpacity
                            onPress={() => updateChild(child.id, { qrToken: generateQRToken() })}
                            style={styles.qrPlaceholder}
                          >
                            <Feather name="grid" size={20} color={COLORS.primary} />
                            <Text style={styles.qrPlaceholderText}>Создать QR-код для входа</Text>
                          </TouchableOpacity>
                        )}
                      </MotiView>
                    )}
                  </View>
                </View>
              </MotiView>
            ))}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleMockSubmit}
              disabled={!canContinue}
              activeOpacity={0.8}
              style={{ marginTop: 12 }}
            >
              <LinearGradient
                colors={canContinue ? [COLORS.primary, COLORS.secondary] : [COLORS.tertiary, COLORS.tertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Продолжить</Text>
                {canContinue && <Feather name="arrow-right" size={20} color="white" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.foreground,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.foreground,
    lineHeight: 38,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mutedForeground,
    lineHeight: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: RADIUS.xxl,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.foreground,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.mutedForeground,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.muted,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.foreground,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  optionCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.muted,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}05`,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.mutedForeground,
  },
  optionTextActive: {
    color: COLORS.primary,
  },
  toggleOption: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}05`,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.mutedForeground,
  },
  toggleTextActive: {
    color: COLORS.primary,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 32,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  qrHint: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  qrPlaceholder: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  qrPlaceholderText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...SHADOWS.md,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  }
});
