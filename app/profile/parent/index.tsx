import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";
import { useParentData } from "../../../contexts/ParentDataContext";

export default function ParentProfile() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;
  const { parentProfile, childrenProfile: children } = useParentData();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);

  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    age: "",
  });

  useEffect(() => {
    if (parentProfile && showEditModal) {
      setEditForm({
        full_name: parentProfile.firstName || "",
        phone: "",
        age: "",
      });
    }
  }, [parentProfile, showEditModal]);

  const handleSaveProfile = async () => {
    Alert.alert("Успешно", "Профиль обновлен");
    setShowEditModal(false);
  };

  const handleLogout = () => {
    Alert.alert("Выход", "Вы действительно хотите выйти?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Выйти",
        style: "destructive",
        onPress: () => router.replace("/(auth)"),
      },
    ]);
  };

  const menuItems = [
    {
      icon: "user" as const,
      label: "Редактировать профиль",
      action: () => setShowEditModal(true),
    },
    {
      icon: "bell" as const,
      label: "Уведомления",
      action: () => setShowNotificationsModal(true),
    },
    {
      icon: "credit-card" as const,
      label: "Способы оплаты",
      action: () => setShowPaymentModal(true),
    },
    {
      icon: "settings" as const,
      label: "Настройки",
      action: () => setShowSettingsModal(true),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            width: "100%",
            maxWidth: isDesktop ? LAYOUT.dashboardMaxWidth : undefined,
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: horizontalPadding,
            paddingVertical: 12,
          }}
        >
          <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Feather name="arrow-left" size={22} color={COLORS.foreground} />
          </Pressable>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: COLORS.foreground,
            }}
          >
            Профиль
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 24,
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
                marginBottom: 20,
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
                <Feather name="user" size={32} color={COLORS.primary} />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: COLORS.foreground,
                  marginBottom: 4,
                }}
              >
                {parentProfile?.firstName || "Родитель"}
              </Text>
              <Text style={{ color: COLORS.mutedForeground, marginBottom: 20 }}>
                parent@example.com
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
                      {children.length}
                    </Text>
                  </LinearGradient>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.mutedForeground,
                      fontWeight: "500",
                    }}
                  >
                    Детей
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
                      {enrollmentsCount}
                    </Text>
                  </LinearGradient>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.mutedForeground,
                      fontWeight: "500",
                    }}
                  >
                    Записей
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View style={{ marginBottom: 20 }}>
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
                marginTop: 4,
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
                Выйти
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Edit Profile Modal */}
        <Modal visible={showEditModal} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "flex-end",
              padding: 16,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.lg,
                padding: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: COLORS.foreground,
                  }}
                >
                  Редактировать профиль
                </Text>
                <Pressable onPress={() => setShowEditModal(false)}>
                  <Feather name="x" size={24} color={COLORS.mutedForeground} />
                </Pressable>
              </View>

              {[
                {
                  label: "Полное имя",
                  key: "full_name" as const,
                  placeholder: "Введите полное имя",
                },
                {
                  label: "Возраст",
                  key: "age" as const,
                  placeholder: "Введите возраст",
                  keyboard: "numeric" as const,
                },
                {
                  label: "Телефон",
                  key: "phone" as const,
                  placeholder: "+7 (999) 123-45-67",
                  keyboard: "phone-pad" as const,
                },
              ].map((field) => (
                <View key={field.key} style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: COLORS.foreground,
                      marginBottom: 8,
                    }}
                  >
                    {field.label}
                  </Text>
                  <TextInput
                    value={editForm[field.key]}
                    onChangeText={(text) =>
                      setEditForm((prev) => ({ ...prev, [field.key]: text }))
                    }
                    placeholder={field.placeholder}
                    placeholderTextColor={COLORS.mutedForeground}
                    keyboardType={field.keyboard || "default"}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderWidth: 2,
                      borderColor: COLORS.border,
                      borderRadius: RADIUS.md,
                      fontSize: 15,
                      color: COLORS.foreground,
                    }}
                  />
                </View>
              ))}

              <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                <Pressable
                  onPress={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: RADIUS.md,
                    borderWidth: 2,
                    borderColor: COLORS.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontWeight: "600", color: COLORS.mutedForeground }}
                  >
                    Отмена
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveProfile}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: RADIUS.md,
                    backgroundColor: COLORS.primary,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "600", color: "white" }}>
                    Сохранить
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Placeholder Modals */}
        <Modal
          visible={
            showNotificationsModal || showPaymentModal || showSettingsModal
          }
          transparent
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.lg,
                padding: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: COLORS.foreground,
                  }}
                >
                  Уведомление
                </Text>
                <Pressable
                  onPress={() => {
                    setShowNotificationsModal(false);
                    setShowPaymentModal(false);
                    setShowSettingsModal(false);
                  }}
                >
                  <Feather name="x" size={24} color={COLORS.mutedForeground} />
                </Pressable>
              </View>
              <Text style={{ color: COLORS.mutedForeground }}>
                Этот раздел находится в разработке.
              </Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
