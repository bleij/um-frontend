import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

interface QRPayload {
  v: number;
  type: string;
  childId: string;
  parentId: string;
  token: string;
}

export default function QRScanScreen() {
  const router = useRouter();
  const { loginWithQR } = useAuth();
  const { width } = useWindowDimensions();

  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.authHorizontalPaddingDesktop
    : LAYOUT.authHorizontalPaddingMobile;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // On web or when user prefers manual entry
  const [useManual, setUseManual] = useState(Platform.OS === "web");

  const handleQRData = async (data: string) => {
    if (scanned || isSubmitting) return;
    setScanned(true);
    setError("");
    await processCode(data);
  };

  const processCode = async (raw: string) => {
    setIsSubmitting(true);
    try {
      const payload: QRPayload = JSON.parse(raw);
      if (payload.type !== "child_link" || !payload.childId || !payload.token) {
        setError("Неверный QR-код. Попросите родителя сгенерировать новый.");
        setScanned(false);
        setIsSubmitting(false);
        return;
      }
      const result = await loginWithQR({
        childId: payload.childId,
        parentId: payload.parentId,
        token: payload.token,
      });
      if (result.success) {
        router.replace("/(tabs)/home");
      } else {
        setError(result.error ?? "Недействительный QR-код");
        setScanned(false);
      }
    } catch {
      setError("Неверный формат QR-кода");
      setScanned(false);
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          flex: 1,
          maxWidth: isDesktop ? LAYOUT.authMaxWidth : undefined,
          alignSelf: "center",
          width: "100%",
          paddingHorizontal: horizontalPadding,
          paddingTop: 8,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
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
          style={{ marginBottom: 28 }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              color: COLORS.foreground,
              marginBottom: 6,
            }}
          >
            Войти по QR-коду
          </Text>
          <Text style={{ color: COLORS.mutedForeground, fontSize: 14, lineHeight: 20 }}>
            Попроси родителя показать QR-код из своего приложения
          </Text>
        </MotiView>

        {/* Camera / manual toggle */}
        {Platform.OS !== "web" && (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.muted,
              borderRadius: RADIUS.md,
              padding: 4,
              marginBottom: 20,
            }}
          >
            {(["camera", "manual"] as const).map((mode) => {
              const active = mode === "camera" ? !useManual : useManual;
              return (
                <TouchableOpacity
                  key={mode}
                  onPress={() => {
                    setUseManual(mode === "manual");
                    setError("");
                    setScanned(false);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: RADIUS.md - 2,
                    alignItems: "center",
                    backgroundColor: active ? COLORS.card : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      color: active ? COLORS.foreground : COLORS.mutedForeground,
                    }}
                  >
                    {mode === "camera" ? "Сканировать" : "Ввести код"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Camera view */}
        {!useManual && Platform.OS !== "web" && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 400 }}
          >
            {!permission?.granted ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 40,
                  backgroundColor: COLORS.muted,
                  borderRadius: RADIUS.lg,
                  marginBottom: 16,
                }}
              >
                <Feather name="camera-off" size={40} color={COLORS.mutedForeground} />
                <Text
                  style={{
                    color: COLORS.foreground,
                    fontWeight: "600",
                    fontSize: 15,
                    marginTop: 12,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Нужен доступ к камере
                </Text>
                <Text
                  style={{
                    color: COLORS.mutedForeground,
                    fontSize: 13,
                    textAlign: "center",
                    marginBottom: 20,
                    paddingHorizontal: 16,
                  }}
                >
                  Разрешите доступ, чтобы отсканировать QR-код
                </Text>
                <TouchableOpacity
                  onPress={requestPermission}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    backgroundColor: COLORS.primary,
                    borderRadius: RADIUS.md,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    Разрешить камеру
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  borderRadius: RADIUS.lg,
                  overflow: "hidden",
                  aspectRatio: 1,
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                <CameraView
                  style={{ flex: 1 }}
                  facing="back"
                  barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                  onBarcodeScanned={({ data }) => handleQRData(data)}
                />
                {/* Corner guides */}
                {(
                  [
                    { top: 20, left: 20, borderTopWidth: 3, borderLeftWidth: 3 },
                    { top: 20, right: 20, borderTopWidth: 3, borderRightWidth: 3 },
                    { bottom: 20, left: 20, borderBottomWidth: 3, borderLeftWidth: 3 },
                    { bottom: 20, right: 20, borderBottomWidth: 3, borderRightWidth: 3 },
                  ] as const
                ).map((style, i) => (
                  <View
                    key={i}
                    style={[
                      {
                        position: "absolute",
                        width: 28,
                        height: 28,
                        borderColor: "white",
                      },
                      style,
                    ]}
                  />
                ))}
                {isSubmitting && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator size="large" color="white" />
                  </View>
                )}
              </View>
            )}
          </MotiView>
        )}

        {/* Manual entry */}
        {useManual && (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 400 }}
          >
            <View
              style={{
                alignItems: "center",
                padding: 32,
                backgroundColor: COLORS.muted,
                borderRadius: RADIUS.lg,
                marginBottom: 20,
              }}
            >
              <Feather name="grid" size={48} color={COLORS.primary} />
              <Text
                style={{
                  color: COLORS.mutedForeground,
                  fontSize: 13,
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                {Platform.OS === "web"
                  ? "Введите код из QR-кода вручную"
                  : "Введите код из QR-кода"}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: COLORS.foreground,
                marginBottom: 8,
              }}
            >
              Код из QR
            </Text>
            <TextInput
              value={manualCode}
              onChangeText={setManualCode}
              placeholder='{"v":1,"type":"child_link",...}'
              placeholderTextColor={COLORS.mutedForeground}
              multiline
              style={{
                width: "100%",
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: COLORS.muted,
                borderRadius: RADIUS.md,
                borderWidth: 2,
                borderColor: COLORS.border,
                fontSize: 13,
                color: COLORS.foreground,
                minHeight: 80,
                marginBottom: 16,
              }}
            />

            <TouchableOpacity
              onPress={() => processCode(manualCode)}
              disabled={!manualCode.trim() || isSubmitting}
              style={{
                width: "100%",
                paddingVertical: 16,
                borderRadius: RADIUS.md,
                alignItems: "center",
                backgroundColor:
                  !manualCode.trim() || isSubmitting
                    ? COLORS.muted
                    : COLORS.primary,
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.mutedForeground} />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: !manualCode.trim() ? COLORS.mutedForeground : "white",
                  }}
                >
                  Войти
                </Text>
              )}
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Error */}
        {!!error && (
          <View
            style={{
              marginTop: 16,
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
      </View>
    </SafeAreaView>
  );
}

// Needed for the overlay style on iOS camera view
import { StyleSheet } from "react-native";
