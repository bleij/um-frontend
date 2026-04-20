import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, TYPOGRAPHY } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { useMentorProfileStats } from "../../../hooks/useMentorData";

export default function MentorProfile() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? 40 : 24;

  const { stats } = useMentorProfileStats();
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

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

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Арман Сейтказиев";

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F7FF' }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: paddingX, paddingTop: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} style={{ marginBottom: 24 }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.foreground }}>Профиль</Text>
                <TouchableOpacity style={styles.settingsBtn}>
                    <Feather name="settings" size={20} color={COLORS.mutedForeground} />
                </TouchableOpacity>
             </View>
          </MotiView>

          {/* Profile Card */}
          <View style={styles.profileCard}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.avatarContainer}>
                    <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={styles.avatarGradient}>
                        <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
                    </LinearGradient>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.profileName}>{displayName}</Text>
                    <Text style={styles.profileRole}>Ментор • Психолог</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Feather name="star" size={14} color="#FBBF24" fill="#FBBF24" />
                        <Text style={styles.ratingText}>4.9 (47 отзывов)</Text>
                    </View>
                </View>
                <TouchableOpacity>
                   <Feather name="edit-3" size={20} color={COLORS.primary} />
                </TouchableOpacity>
             </View>

             <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>156</Text>
                    <Text style={styles.statLabel}>Сессий</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#F5F3FF' }]}>
                    <Text style={[styles.statValue, { color: COLORS.primary }]}>{stats.studentCount}</Text>
                    <Text style={styles.statLabel}>Учеников</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>8 лет</Text>
                    <Text style={styles.statLabel}>Опыт</Text>
                </View>
             </View>
          </View>

          {/* Accept Orders Toggle */}
          <View style={styles.toggleCard}>
              <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[styles.statusDot, { backgroundColor: isAcceptingOrders ? '#10B981' : '#9CA3AF' }]} />
                      <Text style={styles.toggleTitle}>Принимаю заказы</Text>
                  </View>
                  <Text style={styles.toggleSub}>
                      {isAcceptingOrders ? 'Вы видны в поиске' : 'Режим отпуска'}
                  </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsAcceptingOrders(!isAcceptingOrders)}
                style={[styles.toggleSwitch, isAcceptingOrders && styles.toggleSwitchActive]}
              >
                  <MotiView 
                    animate={{ translateX: isAcceptingOrders ? 22 : 0 }} 
                    style={styles.toggleThumb} 
                  />
              </TouchableOpacity>
          </View>

          {/* Contact Info Card */}
          <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Контактная информация</Text>
              <View style={{ gap: 16 }}>
                 <InfoRow icon="mail" label={user?.phone || "arman@mentor.app"} />
                 <InfoRow icon="phone" label={user?.phone || "+7 (777) 123-45-67"} />
                 <InfoRow icon="map-pin" label="Алматы" />
              </View>
          </View>

          {/* Professional Info Card */}
          <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Профессиональная информация</Text>
              <View style={{ gap: 20 }}>
                 <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Специализация</Text>
                    <Text style={styles.infoValue}>Психолог</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Образование</Text>
                    <Text style={styles.infoValue}>КазНУ им. аль-Фараби</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Языки</Text>
                    <Text style={styles.infoValue}>Казахский, Русский, Английский</Text>
                 </View>
              </View>
          </View>

          {/* Bio */}
          <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>О себе</Text>
              <Text style={styles.bioText}>
                  Помогаю детям и подросткам раскрыть их потенциал через развитие эмоционального интеллекта и soft skills. Обладаю большим опытом работы со сложными кейсами.
              </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Feather name="log-out" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function InfoRow({ icon, label }: { icon: string, label: string }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.iconCircle}>
                <Feather name={icon as any} size={16} color={COLORS.primary} />
            </View>
            <Text style={{ fontSize: 15, color: COLORS.foreground, fontWeight: '500' }}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    settingsBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 24,
        marginBottom: 20,
        ...SHADOWS.md
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        overflow: 'hidden',
        marginRight: 16,
        borderWidth: 3,
        borderColor: '#F5F3FF'
    },
    avatarGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 28, fontWeight: '800', color: 'white' },
    profileName: { fontSize: 20, fontWeight: '900', color: COLORS.foreground },
    profileRole: { fontSize: 14, color: COLORS.mutedForeground, marginTop: 2 },
    ratingText: { fontSize: 13, color: COLORS.mutedForeground, marginLeft: 6, fontWeight: '600' },
    statsGrid: { flexDirection: 'row', gap: 12, marginTop: 24 },
    statBox: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: '800', color: COLORS.foreground },
    statLabel: { fontSize: 11, color: COLORS.mutedForeground, marginTop: 4 },
    toggleCard: { backgroundColor: '#F5F3FF', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    toggleTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
    toggleSub: { fontSize: 12, color: COLORS.primary, opacity: 0.7, marginTop: 2 },
    toggleSwitch: { width: 52, height: 30, borderRadius: 15, backgroundColor: '#D1D5DB', padding: 4 },
    toggleSwitchActive: { backgroundColor: '#10B981' },
    toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'white' },
    sectionCard: { backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 16, ...SHADOWS.sm },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.foreground, marginBottom: 20 },
    iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
    infoLabel: { fontSize: 12, color: COLORS.mutedForeground, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    infoValue: { fontSize: 15, fontWeight: '700', color: COLORS.foreground },
    bioText: { fontSize: 15, color: COLORS.foreground, lineHeight: 22, opacity: 0.8 },
    logoutBtn: { backgroundColor: '#FEF2F2', padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
    logoutText: { color: '#EF4444', fontWeight: '800', fontSize: 16 }
});
