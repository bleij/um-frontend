import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS, TYPOGRAPHY } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";

export default function AdminIntroScreen() {
  const { completeRegistration } = useAuth();

  useEffect(() => {
    // В случае администратора мы просто сразу подтверждаем регистрацию профиля
    // с искусственной задержкой для показа красивого лоадера.
    const timer = setTimeout(() => {
      completeRegistration("admin");
    }, 2000);
    return () => clearTimeout(timer);
  }, [completeRegistration]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500 }}
          style={{ alignItems: "center" }}
        >
          <LinearGradient
            colors={COLORS.gradients.primary as any}
            style={{
              width: 80,
              height: 80,
              borderRadius: RADIUS.xxl,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
              ...SHADOWS.lg,
            }}
          >
            <Feather name="shield" size={32} color="white" />
          </LinearGradient>
          
          <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 8 }}>
            Панель Администратора
          </Text>
          <Text style={{ fontSize: TYPOGRAPHY.size.md, color: COLORS.mutedForeground, marginBottom: 32 }}>
            Подготовка рабочего пространства...
          </Text>

          <ActivityIndicator size="large" color={COLORS.primary} />
        </MotiView>
      </SafeAreaView>
    </View>
  );
}
