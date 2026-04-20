import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { useParentData } from "../../../contexts/ParentDataContext";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase";

export default function ParentProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;
    
  const { parentProfile, childrenProfile: children, updateParentProfile, setParentTariff } = useParentData();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  useEffect(() => {
    if (parentProfile) {
        setEditForm({
            firstName: parentProfile.firstName || "",
            lastName: parentProfile.lastName || "",
            phone: parentProfile.phone || user?.phone || ""
        });
    }
  }, [parentProfile]);

  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children]);

  useEffect(() => {
    if (selectedChild) {
      fetchEnrollments(selectedChild.id);
    }
  }, [selectedChild?.id]);

  const fetchEnrollments = async (childId: string) => {
    if (!supabase || !isSupabaseConfigured) return;
    setLoadingEnrollments(true);
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          status,
          organizations (name),
          groups (name, schedule)
        `)
        .eq('child_id', childId);
      
      if (!error && data) {
        setEnrollments(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleUpdateProfile = async () => {
      await updateParentProfile(editForm);
      setShowEditModal(false);
      Alert.alert("Успех", "Профиль обновлен");
  };

  const handleToggleTariff = () => {
      if (parentProfile?.tariff === 'pro') {
          Alert.alert(
              "Деактивация PRO",
              "Вы действительно хотите отключить PRO функции? Доступ сохранится до конца оплаченного периода.",
              [
                  { text: "Отмена", style: "cancel" },
                  { text: "Отключить", style: "destructive", onPress: () => setParentTariff('basic') }
              ]
          );
      } else {
          router.push("/parent/subscription" as any);
      }
  };

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

  if (!selectedChild && children.length === 0) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: COLORS.mutedForeground }}>Данные не найдены</Text>
          </View>
      );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F7FF' }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <LinearGradient
          colors={["#6C5CE7", "#8B7FE8"]}
          style={{ height: 160, position: 'absolute', top: 0, left: 0, right: 0 }}
        />
        
        <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Feather name="arrow-left" size={22} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Профиль</Text>
            <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.backBtn}>
                <Feather name="edit-3" size={20} color="white" />
            </TouchableOpacity>
        </View>
 
        <ScrollView
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: horizontalPadding }}>
            {/* Parent Info Card */}
            <View style={styles.parentCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.avatarPlaceholder}>
                      <Text style={{ fontSize: 24 }}>👤</Text>
                  </View>
                  <View style={{ marginLeft: 16, flex: 1 }}>
                      <Text style={styles.parentName}>{parentProfile?.firstName} {parentProfile?.lastName || ""}</Text>
                      <Text style={styles.parentPhone}>{parentProfile?.phone || user?.phone}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.editBtnSmall}>
                      <Feather name="settings" size={16} color={COLORS.mutedForeground} />
                  </TouchableOpacity>
              </View>
              
              <View style={styles.divider} />
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                      <Text style={styles.statLabel}>Тарифный план</Text>
                      <Text style={styles.statValue}>{parentProfile?.tariff === 'pro' ? 'Family PRO' : 'Базовый'}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={handleToggleTariff}
                    style={[styles.tariffBtn, parentProfile?.tariff === 'pro' && styles.tariffBtnActive]}
                  >
                      <Text style={[styles.tariffBtnText, parentProfile?.tariff === 'pro' && styles.tariffBtnTextActive]}>
                          {parentProfile?.tariff === 'pro' ? 'Управление' : 'Активировать PRO'}
                      </Text>
                  </TouchableOpacity>
              </View>
            </View>

            {/* Children Selector */}
            <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Мои дети</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 10 }}>
                    {children.map((child) => {
                        const isSelected = selectedChildId === child.id;
                        return (
                            <TouchableOpacity
                                key={child.id}
                                onPress={() => setSelectedChildId(child.id)}
                                activeOpacity={0.8}
                                style={[styles.childSelector, isSelected && styles.childSelectorActive]}
                            >
                                <View style={[styles.childAvatar, isSelected && styles.childAvatarActive]}>
                                    <Text style={{ fontSize: 28 }}>{child.ageCategory === 'child' ? '👦' : '🧑'}</Text>
                                </View>
                                <Text style={[styles.childName, isSelected && styles.childNameActive]}>{child.name}</Text>
                                <Text style={[styles.childAge, isSelected && styles.childAgeActive]}>{child.age} лет</Text>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity 
                        onPress={() => router.push("/profile/youth/create-profile-child" as any)}
                        style={styles.addChildSelector}
                    >
                         <Feather name="plus" size={24} color={COLORS.mutedForeground} />
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* QR Section */}
            <View style={styles.qrRow}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.smallAvatar}>
                         <Text style={{ fontSize: 20 }}>{selectedChild?.ageCategory === 'child' ? '👦' : '🧑'}</Text>
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.qrTitle}>{selectedChild?.name}</Text>
                        <Text style={styles.qrSubtitle}>QR-код для отметки</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setShowQRModal(true)} style={styles.qrBtn}>
                    <Feather name="maximize" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Assessment & Reports Section */}
            <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Отчеты и аналитика ({selectedChild?.name})</Text>
                <TouchableOpacity 
                   onPress={() => router.push(`/parent/child/${selectedChild?.id}` as any)}
                   style={styles.reportCard}
                >
                    <View style={styles.reportIcon}>
                        <Feather name="bar-chart-2" size={22} color="#6C5CE7" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.reportTitle}>Результаты диагностики</Text>
                        <Text style={styles.reportSubtitle}>Карта талантов и мягких навыков</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={COLORS.mutedForeground} />
                </TouchableOpacity>
            </View>

            {/* Clubs List */}
            <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Кружки и секции</Text>
                {loadingEnrollments ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : enrollments.length > 0 ? (
                    enrollments.map((enr) => (
                        <View key={enr.id} style={styles.clubCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.clubName}>{(enr.organizations as any)?.name || "Клуб"}</Text>
                                <Text style={styles.groupName}>{(enr.groups as any)?.name}</Text>
                                <View style={styles.scheduleRow}>
                                    <Feather name="calendar" size={12} color={COLORS.mutedForeground} />
                                    <Text style={styles.scheduleText}>
                                        { (enr.groups as any)?.schedule ? (enr.groups as any).schedule : "Расписание уточняется" }
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.clubArrow}>
                                <Feather name="chevron-right" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyCard}>
                        <Text style={{ color: COLORS.mutedForeground }}>Пока нет активных записей</Text>
                    </View>
                )}
            </View>

            {/* Logout */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Выйти из аккаунта</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} animationType="slide">
          <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
              <View style={{ padding: 24 }}>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Редактировать профиль</Text>
                      <TouchableOpacity onPress={() => setShowEditModal(false)}>
                          <Feather name="x" size={24} color={COLORS.foreground} />
                      </TouchableOpacity>
                  </View>

                  <View style={{ gap: 20, marginTop: 32 }}>
                      <View>
                          <Text style={styles.inputLabel}>ИМЯ</Text>
                          <TextInput 
                            style={styles.modalInput} 
                            value={editForm.firstName} 
                            onChangeText={v => setEditForm({...editForm, firstName: v})}
                            placeholder="Напр. Иван"
                          />
                      </View>
                      <View>
                          <Text style={styles.inputLabel}>ФАМИЛИЯ</Text>
                          <TextInput 
                            style={styles.modalInput} 
                            value={editForm.lastName} 
                            onChangeText={v => setEditForm({...editForm, lastName: v})}
                            placeholder="Напр. Иванов"
                          />
                      </View>
                      <View>
                          <Text style={styles.inputLabel}>НОМЕР ТЕЛЕФОНА</Text>
                          <TextInput 
                            style={styles.modalInput} 
                            value={editForm.phone} 
                            onChangeText={v => setEditForm({...editForm, phone: v})}
                            keyboardType="phone-pad"
                          />
                      </View>

                      <TouchableOpacity onPress={handleUpdateProfile} style={styles.saveProfileBtn}>
                          <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>СОХРАНИТЬ</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </SafeAreaView>
      </Modal>

      {/* QR Modal */}
      <Modal visible={showQRModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <View style={styles.qrModalContent}>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>QR-код для отметки</Text>
                      <TouchableOpacity onPress={() => setShowQRModal(false)}>
                          <Feather name="x" size={24} color="#999" />
                      </TouchableOpacity>
                  </View>
                  
                  <View style={styles.qrOuterWrapper}>
                      <QRCode 
                        value={selectedChild?.qrToken || `child_auth_${selectedChild?.id}`} 
                        size={220} 
                        color="#1A1A1A"
                      />
                  </View>
                  
                  <Text style={styles.qrModalChildName}>{selectedChild?.name}</Text>
                  <Text style={styles.qrModalHint}>
                      Покажите этот QR-код учителю для отметки посещения или входа ученика
                  </Text>
              </View>
          </View>
      </Modal>
    </View>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.foreground }}>{value}</Text>
            <Text style={{ fontSize: 11, color: COLORS.mutedForeground, marginTop: 2 }}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: 'white'
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    parentCard: {
        backgroundColor: 'white',
        borderRadius: RADIUS.xxl,
        padding: 20,
        ...SHADOWS.md
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center'
    },
    parentName: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.foreground
    },
    parentEmail: {
        fontSize: 13,
        color: COLORS.mutedForeground,
        marginTop: 2
    },
    parentPhone: {
        fontSize: 13,
        color: COLORS.mutedForeground
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.mutedForeground
    },
    statValue: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.foreground
    },
    statusBadge: {
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    statusText: {
        color: '#16A34A',
        fontSize: 12,
        fontWeight: '700'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.foreground,
        marginBottom: 8
    },
    childSelector: {
        width: 100,
        padding: 12,
        borderRadius: RADIUS.xl,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#F3F4F6',
        alignItems: 'center'
    },
    childSelectorActive: {
        backgroundColor: '#6C5CE7',
        borderColor: '#6C5CE7',
        ...SHADOWS.md
    },
    childAvatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    childAvatarActive: {
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    childName: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.foreground
    },
    childNameActive: {
        color: 'white'
    },
    childAge: {
        fontSize: 11,
        color: COLORS.mutedForeground
    },
    childAgeActive: {
        color: 'rgba(255,255,255,0.8)'
    },
    qrRow: {
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: RADIUS.xl,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.sm
    },
    smallAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center'
    },
    qrTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.foreground
    },
    qrSubtitle: {
        fontSize: 11,
        color: COLORS.mutedForeground
    },
    qrBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#6C5CE7',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoCard: {
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: RADIUS.xl,
        padding: 16,
        ...SHADOWS.sm
    },
    infoCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.foreground,
        marginLeft: 8
    },
    clubCard: {
        backgroundColor: 'white',
        borderRadius: RADIUS.xl,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.sm
    },
    clubName: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.foreground
    },
    groupName: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 2
    },
    scheduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6
    },
    scheduleText: {
        fontSize: 12,
        color: COLORS.mutedForeground
    },
    clubArrow: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyCard: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderStyle: 'dashed'
    },
    logoutBtn: {
        marginTop: 40,
        backgroundColor: '#FEF2F2',
        paddingVertical: 16,
        borderRadius: RADIUS.xl,
        alignItems: 'center'
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 16
    },
    editBtnSmall: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tariffBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        ...SHADOWS.sm
    },
    tariffBtnActive: {
        backgroundColor: '#F5F3FF',
        borderWidth: 1,
        borderColor: COLORS.primary
    },
    tariffBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase'
    },
    tariffBtnTextActive: {
        color: COLORS.primary
    },
    addChildSelector: {
        width: 100,
        height: 100,
        borderRadius: RADIUS.xl,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderWidth: 2,
        borderColor: '#F3F4F6',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    reportCard: {
        backgroundColor: 'white',
        borderRadius: RADIUS.xl,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    reportIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F3FF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    reportTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.foreground
    },
    reportSubtitle: {
        fontSize: 12,
        color: COLORS.mutedForeground,
        marginTop: 2
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: COLORS.foreground
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.mutedForeground,
        marginBottom: 8,
        letterSpacing: 1
    },
    modalInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.foreground,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    saveProfileBtn: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        ...SHADOWS.md
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: 24
    },
    qrModalContent: {
        backgroundColor: 'white',
        borderRadius: RADIUS.xxl,
        padding: 24,
        alignItems: 'center'
    },
    qrOuterWrapper: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 24,
        ...SHADOWS.md
    },
    qrModalChildName: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.foreground,
        marginTop: 20
    },
    qrModalHint: {
        fontSize: 13,
        color: COLORS.mutedForeground,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 18
    }
});
