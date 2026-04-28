import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { loginWithPhone } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.authHorizontalPaddingDesktop
    : LAYOUT.authHorizontalPaddingMobile;

  const formatPhone = (text: string) => {
    // Remove all non-digit characters except +
    const cleaned = text.replace(/[^\d+]/g, "");
    
    // Check if it starts with +
    const hasPlus = cleaned.startsWith("+");
    
    // Get only digits (no +)
    const digitsOnly = cleaned.replace(/\D/g, "");
    
    // Format based on length
    let formatted = "";
    
    if (digitsOnly.length === 0) {
      // Allow typing just "+"
      formatted = hasPlus ? "+" : "";
    } else if (digitsOnly.length === 1) {
      // First digit: keep + if user typed it, otherwise just the digit
      formatted = hasPlus ? `+${digitsOnly}` : digitsOnly;
    } else if (digitsOnly.length <= 4) {
      const prefix = hasPlus ? `+${digitsOnly[0]}` : digitsOnly[0];
      formatted = `${prefix} (${digitsOnly.slice(1)}`;
    } else if (digitsOnly.length <= 7) {
      const prefix = hasPlus ? `+${digitsOnly[0]}` : digitsOnly[0];
      formatted = `${prefix} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4)}`;
    } else if (digitsOnly.length <= 9) {
      const prefix = hasPlus ? `+${digitsOnly[0]}` : digitsOnly[0];
      formatted = `${prefix} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
    } else {
      const prefix = hasPlus ? `+${digitsOnly[0]}` : digitsOnly[0];
      formatted = `${prefix} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 9)}-${digitsOnly.slice(9, 11)}`;
    }
    
    setPhoneNumber(formatted);
  };

  const canSubmit = phoneNumber.replace(/\D/g, "").length >= 10 && password.length >= 6;

  const handleLogin = async () => {
    setError("");
    setIsSubmitting(true);
    const result = await loginWithPhone(phoneNumber, password);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || "Не удалось войти");
      return;
    }
    router.replace("/(tabs)/home");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        {/* Background Blobs */}
        <View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
            <View style={{ 
                position: 'absolute', 
                top: -60, 
                left: -60, 
                width: 220, 
                height: 220, 
                borderRadius: 110, 
                backgroundColor: `${COLORS.primary}10`,
            }} />
            <View style={{ 
                position: 'absolute', 
                bottom: '15%', 
                right: -80, 
                width: 280, 
                height: 280, 
                borderRadius: 140, 
                backgroundColor: `${COLORS.secondary}05`,
            }} />
        </View>

        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              paddingVertical: isDesktop ? 24 : 12,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                maxWidth: isDesktop ? LAYOUT.authMaxWidth : undefined,
                paddingHorizontal: horizontalPadding,
                paddingTop: 8,
              }}
            >
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.replace("/intro")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 32,
                }}
              >
                <Feather name="arrow-left" size={20} color={COLORS.mutedForeground} />
                <Text style={{ color: COLORS.mutedForeground, marginLeft: 8, fontSize: 15, fontWeight: '500' }}>
                  Назад
                </Text>
              </TouchableOpacity>

              {/* Header */}
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 500 }}
                style={{ marginBottom: 32 }}
              >
                <Text style={{ fontSize: 32, fontWeight: "900", color: COLORS.foreground, marginBottom: 8, letterSpacing: -1 }}>
                   С возвращением!
                </Text>
                <Text style={{ color: COLORS.mutedForeground, fontSize: 16, lineHeight: 24 }}>
                   Введите данные ниже, чтобы продолжить обучение и достигать новых высот
                </Text>
              </MotiView>

              {/* Form Card */}
              <MotiView
                  from={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 100 }}
                  style={{ backgroundColor: 'white', borderRadius: RADIUS.xxl, padding: 24, ...SHADOWS.md }}
              >
                {/* Phone Field */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.label}>НОМЕР ТЕЛЕФОНА</Text>
                    <View style={styles.inputWrapper}>
                        <Feather name="phone" size={18} color={COLORS.mutedForeground} style={styles.inputIcon} />
                        <TextInput
                            placeholder="+7 (___) ___-__-__"
                            placeholderTextColor={COLORS.mutedForeground}
                            value={phoneNumber}
                            onChangeText={formatPhone}
                            keyboardType="phone-pad"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-100"
                            style={styles.inputText}
                        />
                    </View>
                </View>

                {/* Password Field */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.label}>ПАРОЛЬ</Text>
                    <View style={styles.inputWrapper}>
                        <Feather name="lock" size={18} color={COLORS.mutedForeground} style={styles.inputIcon} />
                        <TextInput
                            placeholder="Ваш пароль"
                            placeholderTextColor={COLORS.mutedForeground}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border border-gray-100"
                            style={styles.inputText}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)} 
                            style={styles.eyeIcon}
                        >
                            <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={COLORS.mutedForeground} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity 
                  onPress={() => {/* Forgot password logic */}}
                  style={{ alignSelf: 'flex-end', marginBottom: 24 }}
                >
                  <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: '700' }}>Забыли пароль?</Text>
                </TouchableOpacity>

                {!!error && (
                    <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </MotiView>
                )}

                {/* Submit button inside card for cohesion */}
                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isSubmitting || !canSubmit}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={canSubmit ? [COLORS.primary, COLORS.secondary] : [COLORS.muted, COLORS.muted]}
                        style={styles.submitBtn}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={{ 
                                fontSize: 18, 
                                fontWeight: "800", 
                                color: canSubmit ? "white" : COLORS.mutedForeground 
                            }}>
                                Войти
                            </Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
              </MotiView>

              {/* QR Login Alternative */}
              <View style={{ marginTop: 32 }}>
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>или</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={{ alignItems: 'center', marginTop: 16 }}>
                    <TouchableOpacity 
                        onPress={() => router.push("/(auth)/qr-scan")}
                        style={styles.qrBtn}
                    >
                        <Feather name="grid" size={20} color={COLORS.primary} />
                        <Text style={styles.qrBtnText}>Войти по QR-коду</Text>
                    </TouchableOpacity>
                </View>
              </View>

              {/* Register link */}
              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24, paddingBottom: 40 }}>
                <Text style={{ color: COLORS.mutedForeground, fontSize: 15 }}>Нет аккаунта? </Text>
                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text style={{ color: COLORS.primary, fontWeight: "800", fontSize: 15 }}>Зарегистрироваться</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.foreground,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        opacity: 0.6,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    inputText: {
        fontSize: 15,
        fontWeight: '500',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        zIndex: 1,
    },
    errorBox: {
        marginBottom: 16,
        padding: 12,
        borderRadius: RADIUS.md,
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#FCA5A5'
    },
    errorText: {
        color: '#B91C1C',
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600'
    },
    submitBtn: {
        paddingVertical: 18,
        borderRadius: RADIUS.xl,
        alignItems: "center",
        justifyContent: "center",
        ...SHADOWS.md,
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: 12,
        color: COLORS.mutedForeground,
        fontSize: 13,
        fontWeight: '500'
    },
    qrBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: RADIUS.xl,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: COLORS.border,
        ...SHADOWS.sm,
    },
    qrBtnText: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.primary
    }
});
