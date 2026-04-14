import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../../components/ui/ScreenHeader";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";

export default function MentorProfile() {
  const router = useRouter();
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      await logout();
      router.replace("/intro" as any);
    } else {
      Alert.alert("Выход", "Вы действительно хотите выйти?", [
        { text: "Отмена", style: "cancel" },
        {
          text: "Выйти",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/intro" as any);
          },
        },
      ]);
    }
  };

  const menuItems = [
    {
      icon: "award" as const,
      label: "Мои квалификации",
      action: () => Alert.alert("В разработке"),
    },
    {
      icon: "users" as const,
      label: "Мои ученики",
      action: () => router.push("/(tabs)/home"),
    },
    {
      icon: "settings" as const,
      label: "Настройки",
      action: () => Alert.alert("В разработке"),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {!isDesktop && (
          <ScreenHeader
            title="Личный кабинет"
            horizontalPadding={horizontalPadding}
            withSafeArea={false}
          />
        )}

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 16,
            paddingBottom: 100,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: isDesktop ? LAYOUT.dashboardMaxWidth : undefined,
            }}
          >
            {/* Profile Info */}
            <View
              style={{
                backgroundColor: COLORS.card,
                padding: 28,
                borderRadius: RADIUS.lg,
                alignItems: "center",
                marginBottom: 24,
                borderWidth: 1,
                borderColor: COLORS.border,
                ...SHADOWS.md,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: `${COLORS.primary}10`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Feather name="user-check" size={32} color={COLORS.primary} />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: COLORS.foreground,
                  marginBottom: 4,
                }}
              >
                Анна Сергеевна
              </Text>
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: "600",
                  marginBottom: 20,
                }}
              >
                Старший Ментор
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 16,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "800",
                        color: "white",
                      }}
                    >
                      12
                    </Text>
                  </LinearGradient>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.mutedForeground,
                      fontWeight: "500",
                    }}
                  >
                    Учеников
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "800",
                        color: "white",
                      }}
                    >
                      5+
                    </Text>
                  </LinearGradient>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.mutedForeground,
                      fontWeight: "500",
                    }}
                  >
                    Лет работы
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View style={{ marginBottom: 24 }}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={item.action}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    backgroundColor: COLORS.card,
                    borderRadius: RADIUS.sm,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    ...SHADOWS.sm,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: `${COLORS.primary}10`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <Feather
                      name={item.icon}
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontWeight: "600",
                      color: COLORS.foreground,
                      fontSize: 16,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={COLORS.mutedForeground}
                  />
                </Pressable>
              ))}
            </View>

            {/* Logout */}
            <Pressable
              onPress={handleLogout}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.sm,
                borderWidth: 1,
                borderColor: `${COLORS.destructive}20`,
              }}
            >
              <Feather name="log-out" size={18} color={COLORS.destructive} />
              <Text
                style={{
                  color: COLORS.destructive,
                  fontWeight: "600",
                  fontSize: 16,
                  marginLeft: 8,
                }}
              >
                Выйти из системы
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
