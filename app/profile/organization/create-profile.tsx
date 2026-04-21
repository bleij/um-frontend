import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, TYPOGRAPHY } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase";

export default function CreateProfileOrganization() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;
    
  const [formData, setFormData] = useState({
    orgName: "",
    city: "",
    contactPerson: "",
    phone: user?.phone || "",
    email: user?.email || "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMockSubmit = async () => {
    setError(null);
    if (!formData.orgName.trim()) { setError("Укажите название организации."); return; }
    if (!formData.city.trim()) { setError("Укажите город."); return; }
    if (!formData.contactPerson.trim()) { setError("Укажите ФИО ответственного лица."); return; }

    setSubmitting(true);
    try {
      if (supabase && isSupabaseConfigured) {
        // 1. Update Auth if password or email changed (and provided)
        if (formData.password) {
           const { error: authErr } = await supabase.auth.updateUser({ 
             password: formData.password,
             email: formData.email !== user?.email ? formData.email : undefined
           });
           if (authErr) {
             setError(`Ошибка обновления данных входа: ${authErr.message}`);
             setSubmitting(false);
             return;
           }
        }

        // 2. Create/Update Organization Record
        const { error: insertErr } = await supabase.from("organizations").upsert({
          owner_user_id: user?.id ?? null,
          name: formData.orgName.trim(),
          contact_person: formData.contactPerson.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          status: "new",
        }, { onConflict: 'owner_user_id' });

        if (insertErr) {
          setError(insertErr.message);
          setSubmitting(false);
          return;
        }
      }
      setIsSuccess(true);
    } catch (e: any) {
      setError(e.message || "Произошла ошибка");
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SuccessView onHome={() => router.replace("/(tabs)/home")} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Background Blobs */}
      <View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
        <View style={{ 
          position: 'absolute', 
          top: -100, 
          right: -100, 
          width: 400, 
          height: 400, 
          borderRadius: 200, 
          backgroundColor: `${COLORS.primary}08`,
        }} />
        <View style={{ 
          position: 'absolute', 
          top: '40%', 
          left: -150, 
          width: 350, 
          height: 350, 
          borderRadius: 175, 
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
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={20} color={COLORS.foreground} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Профиль организации</Text>
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
            
            {/* Header Text */}
            <View style={{ marginBottom: 32 }}>
               <Text style={styles.title}>Добро пожаловать! 🏫</Text>
               <Text style={styles.subtitle}>
                 Заполните базовую информацию, чтобы начать настройку ваших кружков
               </Text>
            </View>

            {/* General Info Card */}
            <MotiView
               from={{ opacity: 0, translateY: 20 }}
               animate={{ opacity: 1, translateY: 0 }}
               style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.primary}10` }]}>
                  <MaterialCommunityIcons name="office-building" size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.cardTitle}>Общая информация</Text>
              </View>

              <View style={{ gap: 20 }}>
                <View>
                  <Text style={styles.inputLabel}>Название организации</Text>
                  <TextInput
                    value={formData.orgName}
                    onChangeText={(text) => setFormData({ ...formData, orgName: text })}
                    placeholder="Напр. RoboTech Academy"
                    placeholderTextColor={COLORS.tertiary}
                    style={styles.input}
                  />
                </View>
                
                <View>
                  <Text style={styles.inputLabel}>Город</Text>
                  <TextInput
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    placeholder="Алматы"
                    placeholderTextColor={COLORS.tertiary}
                    style={styles.input}
                  />
                </View>
              </View>
            </MotiView>

            {/* Contact Person Card */}
            <MotiView
               from={{ opacity: 0, translateY: 20 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ delay: 100 }}
               style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.secondary}10` }]}>
                  <Feather name="user" size={18} color={COLORS.secondary} />
                </View>
                <Text style={styles.cardTitle}>Ответственное лицо</Text>
              </View>

              <View style={{ gap: 20 }}>
                <View>
                  <Text style={styles.inputLabel}>ФИО представителя</Text>
                  <TextInput
                    value={formData.contactPerson}
                    onChangeText={(text) => setFormData({ ...formData, contactPerson: text })}
                    placeholder="Иванов Иван Иванович"
                    placeholderTextColor={COLORS.tertiary}
                    style={styles.input}
                  />
                </View>
                
                <View>
                  <Text style={styles.inputLabel}>Контактный телефон</Text>
                  <TextInput
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="+7 (___) ___-__-__"
                    placeholderTextColor={COLORS.tertiary}
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                </View>
              </View>
            </MotiView>

            {/* Auth Card */}
            <MotiView
               from={{ opacity: 0, translateY: 20 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ delay: 200 }}
               style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.accent}15` }]}>
                  <Feather name="lock" size={18} color={COLORS.accent} />
                </View>
                <Text style={styles.cardTitle}>Данные для входа</Text>
              </View>

              <View style={{ gap: 20 }}>
                <View>
                  <Text style={styles.inputLabel}>Email (логин)</Text>
                  <TextInput
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="org@example.com"
                    placeholderTextColor={COLORS.tertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
                
                <View>
                  <Text style={styles.inputLabel}>Новый пароль (опционально)</Text>
                  <TextInput
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.tertiary}
                    secureTextEntry
                    style={styles.input}
                  />
                  <Text style={{ fontSize: 11, color: COLORS.mutedForeground, marginTop: 8, marginLeft: 4 }}>
                    Оставьте пустым, если не хотите менять пароль
                  </Text>
                </View>
              </View>
            </MotiView>

            {error && (
              <Text style={{ color: COLORS.destructive, textAlign: 'center', marginBottom: 16, fontWeight: '600' }}>
                {error}
              </Text>
            )}

            <TouchableOpacity
              onPress={handleMockSubmit}
              disabled={submitting}
              activeOpacity={0.8}
              style={{ marginTop: 12 }}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>
                  {submitting ? "Сохранение..." : "Создать профиль"}
                </Text>
                {!submitting && <Feather name="arrow-right" size={20} color="white" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function SuccessView({ onHome }: { onHome: () => void }) {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
             <View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: `${COLORS.success}08` }} />
            </View>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
                <MotiView 
                    from={{ opacity: 0, scale: 0.9, translateY: 20 }} 
                    animate={{ opacity: 1, scale: 1, translateY: 0 }} 
                    style={{ backgroundColor: 'white', borderRadius: 40, padding: 32, alignItems: 'center', ...SHADOWS.lg }}
                >
                    <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: `${COLORS.success}10`, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <Feather name="check-circle" size={48} color={COLORS.success} />
                    </View>
                    
                    <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.foreground, textAlign: 'center', marginBottom: 12 }}>Профиль создан!</Text>
                    <Text style={{ fontSize: 16, color: COLORS.mutedForeground, textAlign: 'center', lineHeight: 24, marginBottom: 32 }}>Теперь вы можете начать заполнять информацию о кружках, учителях и группах.</Text>
                    
                    <TouchableOpacity onPress={onHome} style={{ width: '100%' }} activeOpacity={0.8}>
                        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} start={{x:0,y:0}} end={{x:1,y:0}} style={{ paddingVertical: 20, borderRadius: 22, alignItems: 'center', ...SHADOWS.md }}>
                            <Text style={{ color: 'white', fontWeight: '900', fontSize: 17 }}>Перейти в дашборд</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </MotiView>
            </SafeAreaView>
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
