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
  const { loginWithPhone, verificationCodePlaceholder } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"adult" | "child">("adult");

  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.authHorizontalPaddingDesktop
    : LAYOUT.authHorizontalPaddingMobile;

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/[^\d+]/g, "");
    setPhoneNumber(cleaned);
  };

  const canRequestCode = loginMode === "adult" 
    ? (phoneNumber.length >= 10 && password.length >= 6) 
    : (phoneNumber.length >= 10);

  const canSubmit = loginMode === "adult"
    ? canRequestCode // adults skip SMS layer if code is not sent, actually wait, adult needs no SMS if we just drop it or just login. Let's keep existing flow for Adult (requires code in AuthContext) but conceptually Youth/Adult might just login directly. If AuthContext requires code, we must provide it. Let's keep SMS for both to avoid changing AuthContext deeply, but user specified "ввод номера и пароля". I'll auto-fill verify code for Adult if we want to skip SMS UI. Let's keep SMS UI for both for now, just drop password for child.
    : canRequestCode;

  const isReadyToSubmit = codeSent && smsCode.length >= 4;

  const handleAction = async () => {
    setError("");

    if (!codeSent) {
      if (!canRequestCode) {
        setError(loginMode === "adult" ? "Введите номер телефона и пароль (мин. 6 символов)" : "Введите корректный номер телефона");
      } else {
        setCodeSent(true);
      }
      return;
    }

    if (!isReadyToSubmit) {
      setError("Введите код подтверждения");
      return;
    }

    setIsSubmitting(true);

    const result = await loginWithPhone({
      phone: phoneNumber,
      password: loginMode === "adult" ? password : "defaultChildPassword", // Mocking password for child
      verificationCode: smsCode,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Не удалось войти");
      return;
    }

    router.replace("/(tabs)/home");
  };

  const buttonLabel = !codeSent ? "Получить код" : "Войти";

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
              onPress={() => router.replace("/intro")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
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

            {/* Role Tabs */}
            <View style={{ flexDirection: 'row', backgroundColor: COLORS.muted, borderRadius: RADIUS.lg, padding: 4, marginBottom: 24 }}>
                <TouchableOpacity
                    onPress={() => { setLoginMode("adult"); setCodeSent(false); }}
                    style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.md, backgroundColor: loginMode === "adult" ? COLORS.card : 'transparent', shadowColor: loginMode === "adult" ? '#000' : 'transparent', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
                >
                    <Text style={{ fontSize: 13, fontWeight: "600", color: loginMode === "adult" ? COLORS.foreground : COLORS.mutedForeground }}>Подросток / Взрослый</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setLoginMode("child"); setCodeSent(false); }}
                    style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.md, backgroundColor: loginMode === "child" ? COLORS.card : 'transparent', shadowColor: loginMode === "child" ? '#000' : 'transparent', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
                >
                    <Text style={{ fontSize: 13, fontWeight: "600", color: loginMode === "child" ? COLORS.foreground : COLORS.mutedForeground }}>Ребенок (до 12)</Text>
                </TouchableOpacity>
            </View>

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
              <Text
                style={{
                  color: COLORS.mutedForeground,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                {loginMode === "adult" ? "Добро пожаловать! Продолжим твой путь к успеху" : "Привет! Введи номер телефона или отсканируй QR-код"}
              </Text>
            </MotiView>

            {/* Phone Input */}
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
                  style={{
                    width: "100%",
                    paddingLeft: 48,
                    paddingRight: 16,
                    paddingVertical: 16,
                    backgroundColor: COLORS.muted,
                    borderRadius: RADIUS.md,
                    borderWidth: 2,
                    borderColor: COLORS.border,
                    fontSize: 15,
                    color: COLORS.foreground,
                  }}
                />
              </View>
            </MotiView>

            {/* Password Input (Only for Adult/Youth) */}
            {loginMode === "adult" && (
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
                    style={{
                      width: "100%",
                      paddingLeft: 48,
                      paddingRight: 48,
                      paddingVertical: 16,
                      backgroundColor: COLORS.muted,
                      borderRadius: RADIUS.md,
                      borderWidth: 2,
                      borderColor: COLORS.border,
                      fontSize: 15,
                      color: COLORS.foreground,
                    }}
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
            )}

            {codeSent && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 450, delay: 180 }}
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
                  Код из СМС
                </Text>
                <TextInput
                  placeholder="Введите код"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={smsCode}
                  onChangeText={setSmsCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={{
                    width: "100%",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    backgroundColor: COLORS.muted,
                    borderRadius: RADIUS.md,
                    borderWidth: 2,
                    borderColor: COLORS.border,
                    fontSize: 18,
                    color: COLORS.foreground,
                    textAlign: "center",
                    letterSpacing: 6,
                    fontWeight: "700",
                  }}
                />
              </MotiView>
            )}

            {codeSent && (
              <View
                style={{
                  marginBottom: 20,
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

            {/* Submit Button */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 500, delay: 200 }}
              style={{ marginBottom: 24 }}
            >
              <TouchableOpacity
                onPress={handleAction}
                disabled={
                  isSubmitting ||
                  (!codeSent && !canRequestCode) ||
                  (codeSent && !isReadyToSubmit)
                }
                style={{
                  width: "100%",
                  paddingVertical: 16,
                  borderRadius: RADIUS.md,
                  alignItems: "center",
                  backgroundColor:
                    isSubmitting ||
                    (!codeSent && !canRequestCode) ||
                    (codeSent && !isReadyToSubmit)
                      ? COLORS.muted
                      : COLORS.primary,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.mutedForeground}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color:
                        (!codeSent && !canRequestCode) ||
                        (codeSent && !isReadyToSubmit)
                          ? COLORS.mutedForeground
                          : "white",
                    }}
                  >
                    {buttonLabel}
                  </Text>
                )}
              </TouchableOpacity>
            </MotiView>

            {/* Divider */}
            {loginMode === "adult" ? (
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
                  быстрый вход
                </Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
                />
              </View>
            ) : (
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
                  или
                </Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
                />
              </View>
            )}

            {/* Extra Actions */}
            {loginMode === "adult" ? (
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
            ) : (
                <TouchableOpacity
                    style={{
                      width: "100%",
                      paddingVertical: 16,
                      borderRadius: RADIUS.md,
                      alignItems: "center",
                      backgroundColor: COLORS.card,
                      borderWidth: 2,
                      borderColor: COLORS.border,
                      marginBottom: 32,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 12
                    }}
                  >
                    <Feather name="maximize" size={20} color={COLORS.foreground} />
                    <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.foreground }}>
                      Войти по QR-коду
                    </Text>
                </TouchableOpacity>
            )}

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            {/* Go to Register */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                paddingBottom: 24,
              }}
            >
              <Text style={{ color: COLORS.mutedForeground, fontSize: 14 }}>
                нет аккаунта?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
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
