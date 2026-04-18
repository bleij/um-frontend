import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS } from "../../constants/theme";
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
    const cleaned = text.replace(/[^\d+]/g, "");
    const max = cleaned.startsWith("+") ? 12 : 11;
    setPhoneNumber(cleaned.slice(0, max));
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

  const inputStyle = {
    width: "100%" as const,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.muted,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontSize: 15,
    color: COLORS.foreground,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingVertical: isDesktop ? 24 : 12,
          }}
          keyboardShouldPersistTaps="handled"
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
            {/* Back */}
            <TouchableOpacity
              onPress={() => router.replace("/intro")}
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 32 }}
            >
              <Feather name="arrow-left" size={18} color={COLORS.mutedForeground} />
              <Text style={{ color: COLORS.mutedForeground, marginLeft: 8, fontSize: 14 }}>
                Назад
              </Text>
            </TouchableOpacity>

            {/* Header */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 500 }}
              style={{ marginBottom: 32 }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: COLORS.foreground,
                  marginBottom: 8,
                }}
              >
                Войти в аккаунт
              </Text>
              <Text style={{ color: COLORS.mutedForeground, fontSize: 15, lineHeight: 22 }}>
                Добро пожаловать! Продолжим твой путь к успеху
              </Text>
            </MotiView>

            {/* Phone */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 500, delay: 100 }}
              style={{ marginBottom: 16 }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: COLORS.foreground,
                  marginBottom: 8,
                }}
              >
                Номер телефона
              </Text>
              <View style={{ position: "relative", justifyContent: "center" }}>
                <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                  <Feather name="phone" size={18} color={COLORS.mutedForeground} />
                </View>
                <TextInput
                  placeholder="+7 (999) 123-45-67"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={phoneNumber}
                  onChangeText={formatPhone}
                  keyboardType="phone-pad"
                  style={inputStyle}
                />
              </View>
            </MotiView>

            {/* Password */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 500, delay: 150 }}
              style={{ marginBottom: 12 }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: COLORS.foreground,
                  marginBottom: 8,
                }}
              >
                Пароль
              </Text>
              <View style={{ position: "relative", justifyContent: "center" }}>
                <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                  <Feather name="lock" size={18} color={COLORS.mutedForeground} />
                </View>
                <TextInput
                  placeholder="Введите пароль"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{ ...inputStyle, paddingRight: 48 }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 16, zIndex: 1 }}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color={COLORS.mutedForeground}
                  />
                </TouchableOpacity>
              </View>
            </MotiView>

            {!!error && (
              <View
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: RADIUS.md,
                  backgroundColor: "#FEE2E2",
                }}
              >
                <Text style={{ color: "#B91C1C", fontWeight: "500", fontSize: 13 }}>
                  {error}
                </Text>
              </View>
            )}

            {/* Submit */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 500, delay: 200 }}
              style={{ marginBottom: 24 }}
            >
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isSubmitting || !canSubmit}
                style={{
                  width: "100%",
                  paddingVertical: 16,
                  borderRadius: RADIUS.md,
                  alignItems: "center",
                  backgroundColor:
                    isSubmitting || !canSubmit ? COLORS.muted : COLORS.primary,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={COLORS.mutedForeground} />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: !canSubmit ? COLORS.mutedForeground : "white",
                    }}
                  >
                    Войти
                  </Text>
                )}
              </TouchableOpacity>
            </MotiView>

            {/* Divider */}
            <View
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
              <Text
                style={{ marginHorizontal: 12, color: COLORS.mutedForeground, fontSize: 13 }}
              >
                быстрый вход
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            </View>

            {/* Social */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: RADIUS.md,
                  backgroundColor: COLORS.card,
                  borderWidth: 2,
                  borderColor: COLORS.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "700", color: "#ea4335" }}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: RADIUS.md,
                  backgroundColor: COLORS.card,
                  borderWidth: 2,
                  borderColor: COLORS.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="github" size={22} color={COLORS.foreground} />
              </TouchableOpacity>
            </View>

            {/* QR Login */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/qr-scan")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                paddingVertical: 14,
                borderRadius: RADIUS.md,
                borderWidth: 2,
                borderColor: COLORS.border,
                backgroundColor: COLORS.card,
                marginBottom: 32,
              }}
            >
              <Feather name="grid" size={18} color={COLORS.primary} />
              <Text style={{ fontSize: 15, fontWeight: "600", color: COLORS.primary }}>
                Войти по QR-коду
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <View
              style={{ flexDirection: "row", justifyContent: "center", paddingBottom: 24 }}
            >
              <Text style={{ color: COLORS.mutedForeground, fontSize: 14 }}>
                нет аккаунта?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 14 }}>
                  Зарегистрироваться
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
