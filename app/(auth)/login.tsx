import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
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

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.authHorizontalPaddingDesktop
    : LAYOUT.authHorizontalPaddingMobile;

  const handleLogin = () => {
    router.push("/(tabs)/home");
  };

  const canSubmit = email.length > 0 && password.length > 0;

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
                Войти в аккаунт
              </Text>
              <Text
                style={{
                  color: COLORS.mutedForeground,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                Добро пожаловать! Продолжим твой путь к успеху
              </Text>
            </MotiView>

            {/* Email Input */}
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
                Email
              </Text>
              <View style={{ position: "relative", justifyContent: "center" }}>
                <View style={{ position: "absolute", left: 16, zIndex: 1 }}>
                  <Feather
                    name="mail"
                    size={18}
                    color={COLORS.mutedForeground}
                  />
                </View>
                <TextInput
                  placeholder="Введите email"
                  placeholderTextColor={COLORS.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
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

            {/* Password Input */}
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={{ alignItems: "flex-end", marginBottom: 24 }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                Забыли пароль?
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 500, delay: 200 }}
              style={{ marginBottom: 24 }}
            >
              <TouchableOpacity
                onPress={handleLogin}
                disabled={!canSubmit}
                style={{
                  width: "100%",
                  paddingVertical: 16,
                  borderRadius: RADIUS.md,
                  alignItems: "center",
                  backgroundColor: canSubmit ? COLORS.primary : COLORS.muted,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: canSubmit ? "white" : COLORS.mutedForeground,
                  }}
                >
                  Войти
                </Text>
              </TouchableOpacity>
            </MotiView>

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
                или войти через
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
