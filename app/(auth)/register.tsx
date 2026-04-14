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

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { startRegistration, verificationCodePlaceholder } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.authHorizontalPaddingDesktop
    : LAYOUT.authHorizontalPaddingMobile;

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/[^\d+]/g, "");
    setPhoneNumber(cleaned);
  };

  const handleAction = async () => {
    setError("");

    if (!codeSent) {
      if (phoneNumber.replace(/\D/g, "").length < 10) {
        setError("Введите корректный номер телефона");
        return;
      }

      setCodeSent(true);
    } else if (!codeVerified) {
      if (smsCode !== verificationCodePlaceholder) {
        setError("Неверный код подтверждения");
        return;
      }

      setCodeVerified(true);
    } else {
      if (password.length < 6) {
        setError("Пароль должен содержать минимум 6 символов");
        return;
      }

      if (password !== confirmPassword) {
        setError("Пароли не совпадают");
        return;
      }

      setIsSubmitting(true);

      const result = await startRegistration({
        phone: phoneNumber.replace(/\D/g, ""),
        password,
        firstName,
        lastName,
      });

      setIsSubmitting(false);

      if (!result.success) {
        setError(result.error || "Не удалось продолжить регистрацию");
        return;
      }

      router.push("/role");
    }
  };

  const isButtonEnabled = () => {
    if (!codeSent) return phoneNumber.replace(/\D/g, "").length >= 10;
    if (!codeVerified) return smsCode.length >= 4;
    return (
      firstName.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword
    );
  };

  const getSubtitle = () => {
    if (!codeSent) return "Введите номер телефона для регистрации";
    if (!codeVerified) return "Введите код из СМС, отправленный на ваш номер";
    return "Заполните данные для завершения регистрации";
  };

  const getButtonLabel = () => {
    if (!codeSent) return "Получить СМС-код";
    if (!codeVerified) return "Подтвердить код";
    return "Создать аккаунт";
  };

  const inputStyle = (editable = true) => ({
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
    opacity: editable ? 1 : 0.5,
  });

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
            paddingVertical: isDesktop ? 24 : 0,
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
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Feather
                name="arrow-left"
                size={18}
                color={COLORS.mutedForeground}
              />
              <Text
                style={{
                  color: COLORS.mutedForeground,
                  marginLeft: 8,
                  fontSize: 14,
                }}
              >
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
                Создайте аккаунт
              </Text>
              <Text
                style={{
                  color: COLORS.mutedForeground,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                {getSubtitle()}
              </Text>
            </MotiView>

            {/* Phone Input */}
            <View style={{ marginBottom: 16 }}>
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
                  <Feather
                    name="phone"
                    size={18}
                    color={COLORS.mutedForeground}
                  />
                </View>
                <TextInput
                  placeholder="+7 (999) 123-45-67"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={phoneNumber}
                  onChangeText={formatPhone}
                  keyboardType="phone-pad"
                  editable={!codeSent}
                  style={inputStyle(!codeSent)}
                />
              </View>
            </View>

            {/* SMS Code */}
            {codeSent && !codeVerified && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
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
                  Код из СМС
                </Text>
                <TextInput
                  placeholder="••••"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={smsCode}
                  onChangeText={setSmsCode}
                  keyboardType="numeric"
                  maxLength={6}
                  style={{
                    width: "100%",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    backgroundColor: COLORS.muted,
                    borderRadius: RADIUS.md,
                    borderWidth: 2,
                    borderColor: COLORS.border,
                    fontSize: 20,
                    color: COLORS.foreground,
                    textAlign: "center",
                    letterSpacing: 8,
                    fontWeight: "700",
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setCodeSent(false);
                    setCodeVerified(false);
                    setSmsCode("");
                  }}
                  style={{ marginTop: 12, alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: "500",
                      fontSize: 13,
                    }}
                  >
                    Отправить код повторно
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: RADIUS.md,
                    backgroundColor: `${COLORS.primary}10`,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: "600",
                      fontSize: 13,
                    }}
                  >
                    Демо-код подтверждения: {verificationCodePlaceholder}
                  </Text>
                </View>
              </MotiView>
            )}

            {/* Post Verification Fields */}
            {codeVerified && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
              >
                {/* Name */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: COLORS.foreground,
                      marginBottom: 8,
                    }}
                  >
                    Имя
                  </Text>
                  <View
                    style={{ position: "relative", justifyContent: "center" }}
                  >
                    <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                      <Feather
                        name="user"
                        size={18}
                        color={COLORS.mutedForeground}
                      />
                    </View>
                    <TextInput
                      placeholder="Введите имя"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={firstName}
                      onChangeText={setFirstName}
                      style={inputStyle()}
                    />
                  </View>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: COLORS.foreground,
                      marginBottom: 8,
                    }}
                  >
                    Фамилия (опционально)
                  </Text>
                  <View
                    style={{ position: "relative", justifyContent: "center" }}
                  >
                    <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                      <Feather
                        name="user"
                        size={18}
                        color={COLORS.mutedForeground}
                      />
                    </View>
                    <TextInput
                      placeholder="Введите фамилию"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={lastName}
                      onChangeText={setLastName}
                      style={inputStyle()}
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={{ marginBottom: 16 }}>
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
                  <View
                    style={{ position: "relative", justifyContent: "center" }}
                  >
                    <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                      <Feather
                        name="lock"
                        size={18}
                        color={COLORS.mutedForeground}
                      />
                    </View>
                    <TextInput
                      placeholder="Введите пароль"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={{ ...inputStyle(), paddingRight: 48 }}
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
                </View>

                {/* Confirm Password */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: COLORS.foreground,
                      marginBottom: 8,
                    }}
                  >
                    Подтвердите пароль
                  </Text>
                  <View
                    style={{ position: "relative", justifyContent: "center" }}
                  >
                    <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                      <Feather
                        name="lock"
                        size={18}
                        color={COLORS.mutedForeground}
                      />
                    </View>
                    <TextInput
                      placeholder="Подтвердите пароль"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      style={{ ...inputStyle(), paddingRight: 48 }}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{ position: "absolute", right: 16, zIndex: 1 }}
                    >
                      <Feather
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={18}
                        color={COLORS.mutedForeground}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </MotiView>
            )}

            {!!error && (
              <View
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: RADIUS.md,
                  backgroundColor: "#FEE2E2",
                }}
              >
                <Text
                  style={{ color: "#B91C1C", fontWeight: "500", fontSize: 13 }}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              onPress={handleAction}
              disabled={!isButtonEnabled() || isSubmitting}
              style={{
                width: "100%",
                paddingVertical: 16,
                borderRadius: RADIUS.md,
                alignItems: "center",
                backgroundColor: isButtonEnabled()
                  ? COLORS.primary
                  : COLORS.muted,
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: isButtonEnabled() ? "white" : COLORS.mutedForeground,
                  }}
                >
                  {getButtonLabel()}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
              />
              <Text
                style={{
                  marginHorizontal: 12,
                  color: COLORS.mutedForeground,
                  fontSize: 13,
                }}
              >
                или через
              </Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
              />
            </View>

            {/* Social Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 12,
                marginBottom: 32,
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
                <Text
                  style={{ fontSize: 20, fontWeight: "700", color: "#ea4335" }}
                >
                  G
                </Text>
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

            {/* Go to Login */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                paddingBottom: 24,
              }}
            >
              <Text style={{ color: COLORS.mutedForeground, fontSize: 14 }}>
                уже есть аккаунт?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  Войти
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
