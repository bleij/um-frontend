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
import { useAuth, type UserRole } from "../../contexts/AuthContext";

const ROLES: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  role: UserRole;
  route: string;
}[] = [
  {
    title: "Родитель",
    description: "Управление профилями детей, бронирование занятий",
    icon: "users",
    role: "parent",
    route: "/profile/parent/create-profile",
  },
  {
    title: "Ребенок (6-11 лет)",
    description: "Рисование, первые навыки и игры",
    icon: "smile",
    role: "child",
    route: "/profile/youth/create-profile-child",
  },
  {
    title: "Подросток (12-17 лет)",
    description: "Цели, навыки и общение с ментором",
    icon: "zap",
    role: "youth",
    route: "/profile/youth/create-profile",
  },
  {
    title: "Студент (18-20 лет)",
    description: "Профориентация и серьезный рост",
    icon: "book-open",
    role: "young-adult",
    route: "/profile/youth/create-profile-young-adult",
  },
  {
    title: "Организация",
    description: "Управление клубами и учениками",
    icon: "briefcase",
    role: "org",
    route: "/profile/organization/create-profile",
  },
  {
    title: "Ментор",
    description: "Создание планов развития и поддержка",
    icon: "user-check",
    role: "mentor",
    route: "/profile/mentor/create-profile",
  },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { sendOtp, verifyOtpAndRegister, devOtpCode } = useAuth();

  // step 0 = role, step 1 = phone + name + password, step 2 = OTP
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedRoute, setSelectedRoute] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
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

  const handleAction = async () => {
    setError("");

    if (step === 0) {
      if (!selectedRole) {
        setError("Выберите роль для продолжения");
        return;
      }
      setStep(1);
      return;
    }

    if (step === 1) {
      if (phoneNumber.replace(/\D/g, "").length < 10) {
        setError("Введите корректный номер телефона");
        return;
      }
      if (!firstName.trim()) {
        setError("Введите имя");
        return;
      }
      if (password.length < 6) {
        setError("Пароль должен содержать минимум 6 символов");
        return;
      }
      if (password !== confirmPassword) {
        setError("Пароли не совпадают");
        return;
      }

      setIsSubmitting(true);
      const result = await sendOtp(phoneNumber);
      setIsSubmitting(false);

      if (!result.success) {
        setError(result.error || "Не удалось отправить код");
        return;
      }

      setOtp("");
      setStep(2);
      return;
    }

    // step 2: verify OTP and create account
    setIsSubmitting(true);
    const result = await verifyOtpAndRegister(
      phoneNumber,
      otp,
      password,
      selectedRole!,
      firstName,
      lastName,
    );
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Не удалось завершить регистрацию");
      return;
    }

    router.replace(selectedRoute as any);
  };

  const handleBack = () => {
    setError("");
    if (step === 0) router.back();
    else setStep(step - 1);
  };

  const isButtonEnabled = () => {
    if (step === 0) return selectedRole !== null;
    if (step === 1)
      return (
        phoneNumber.replace(/\D/g, "").length >= 10 &&
        firstName.trim().length > 0 &&
        password.length >= 6 &&
        password === confirmPassword
      );
    return otp.length === 6;
  };

  const getSubtitle = () => {
    if (step === 0) return "Выберите роль, чтобы продолжить";
    if (step === 1) return "Введите номер и имя для регистрации";
    return `Код отправлен на ${phoneNumber}`;
  };

  const getButtonLabel = () => {
    if (step === 0) return "Далее";
    if (step === 1) return "Получить код";
    return "Создать аккаунт";
  };

  const inputStyle = () => ({
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
              onPress={handleBack}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Feather name="arrow-left" size={18} color={COLORS.mutedForeground} />
              <Text
                style={{ color: COLORS.mutedForeground, marginLeft: 8, fontSize: 14 }}
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
                style={{ color: COLORS.mutedForeground, fontSize: 15, lineHeight: 22 }}
              >
                {getSubtitle()}
              </Text>
            </MotiView>

            {/* Step 0: Role */}
            {step === 0 && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 400 }}
              >
                {ROLES.map((item) => {
                  const isSelected = selectedRole === item.role;
                  return (
                    <TouchableOpacity
                      key={item.role}
                      onPress={() => {
                        setSelectedRole(item.role);
                        setSelectedRoute(item.route);
                      }}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 16,
                        marginBottom: 10,
                        borderRadius: RADIUS.md,
                        borderWidth: 2,
                        borderColor: isSelected ? COLORS.primary : COLORS.border,
                        backgroundColor: isSelected
                          ? `${COLORS.primary}10`
                          : COLORS.muted,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          backgroundColor: isSelected ? COLORS.primary : COLORS.border,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 14,
                        }}
                      >
                        <Feather
                          name={item.icon}
                          size={20}
                          color={isSelected ? "white" : COLORS.mutedForeground}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 15,
                            color: isSelected ? COLORS.primary : COLORS.foreground,
                            marginBottom: 2,
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.mutedForeground,
                            lineHeight: 16,
                          }}
                        >
                          {item.description}
                        </Text>
                      </View>
                      {isSelected && (
                        <Feather name="check-circle" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </MotiView>
            )}

            {/* Step 1: Phone + Name */}
            {step === 1 && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 400 }}
              >
                {/* Phone */}
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
                      <Feather name="phone" size={18} color={COLORS.mutedForeground} />
                    </View>
                    <TextInput
                      placeholder="+7 (999) 123-45-67"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={phoneNumber}
                      onChangeText={formatPhone}
                      keyboardType="phone-pad"
                      autoFocus
                      style={inputStyle()}
                    />
                  </View>
                </View>

                {/* First name */}
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
                  <View style={{ position: "relative", justifyContent: "center" }}>
                    <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                      <Feather name="user" size={18} color={COLORS.mutedForeground} />
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

                {/* Last name */}
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
                  <View style={{ position: "relative", justifyContent: "center" }}>
                    <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                      <Feather name="user" size={18} color={COLORS.mutedForeground} />
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
                  <View style={{ position: "relative", justifyContent: "center" }}>
                    <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                      <Feather name="lock" size={18} color={COLORS.mutedForeground} />
                    </View>
                    <TextInput
                      placeholder="Минимум 6 символов"
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

                {/* Confirm password */}
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
                  <View style={{ position: "relative", justifyContent: "center" }}>
                    <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                      <Feather name="lock" size={18} color={COLORS.mutedForeground} />
                    </View>
                    <TextInput
                      placeholder="Повторите пароль"
                      placeholderTextColor={COLORS.mutedForeground}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      style={{ ...inputStyle(), paddingRight: 48 }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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

            {/* Dev OTP banner */}
            {step === 2 && !!devOtpCode && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: RADIUS.md,
                  backgroundColor: "#FEF9C3",
                  borderWidth: 1,
                  borderColor: "#FDE047",
                }}
              >
                <Feather name="zap" size={14} color="#854D0E" />
                <Text style={{ fontSize: 13, color: "#854D0E" }}>
                  Dev mode — введите код:{" "}
                  <Text style={{ fontWeight: "700" }}>{devOtpCode}</Text>
                </Text>
              </View>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 400 }}
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
                  Код подтверждения
                </Text>
                <View style={{ position: "relative", justifyContent: "center" }}>
                  <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                    <Feather name="lock" size={18} color={COLORS.mutedForeground} />
                  </View>
                  <TextInput
                    placeholder="● ● ● ● ● ●"
                    placeholderTextColor={COLORS.mutedForeground}
                    value={otp}
                    onChangeText={(t) => setOtp(t.replace(/\D/g, "").slice(0, 6))}
                    keyboardType="number-pad"
                    autoFocus
                    style={{
                      ...inputStyle(),
                      fontSize: 20,
                      fontWeight: "600",
                      letterSpacing: 8,
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setError("");
                    sendOtp(phoneNumber);
                  }}
                  style={{ marginTop: 12, alignSelf: "flex-end" }}
                >
                  <Text style={{ color: COLORS.primary, fontSize: 13 }}>
                    Отправить ещё раз
                  </Text>
                </TouchableOpacity>
              </MotiView>
            )}

            {!!error && (
              <View
                style={{
                  marginBottom: 16,
                  marginTop: 8,
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

            {/* Action Button */}
            <TouchableOpacity
              onPress={handleAction}
              disabled={!isButtonEnabled() || isSubmitting}
              style={{
                width: "100%",
                paddingVertical: 16,
                borderRadius: RADIUS.md,
                alignItems: "center",
                backgroundColor: isButtonEnabled() ? COLORS.primary : COLORS.muted,
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

            {/* Divider + Social — only on step 0 */}
            {step === 0 && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
                  <Text
                    style={{
                      marginHorizontal: 12,
                      color: COLORS.mutedForeground,
                      fontSize: 13,
                    }}
                  >
                    или через
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
                </View>

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
                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#ea4335" }}>
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
              </>
            )}

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
                <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 14 }}>
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
