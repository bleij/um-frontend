import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    COLORS,
    LAYOUT,
    RADIUS,
    SHADOWS,
    SPACING,
    TYPOGRAPHY,
} from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { useMentorStudents, useMentorRequests } from "../../hooks/useMentorData";

export default function MentorHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? 40 : 24;

  const { user } = useAuth();
  const { students } = useMentorStudents();
  const { requests, respond } = useMentorRequests();
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  const displayName = user?.firstName || "Арман";
  
  const todayTasks = [
    { id: 1, time: '14:00', child: 'Алишер Н.', status: 'paid', subject: 'Креативность' },
    { id: 2, time: '16:00', child: 'Мирас К.', status: 'paid', subject: 'Лидерство' },
    { id: 3, time: '18:00', child: 'София П.', status: 'awaiting_report', subject: 'Коммуникация' },
  ];

  const mentorshipRequests = requests.filter((r) => r.request_type === "mentorship" && r.status === "pending");

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F7FF' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        
        {/* Violet Header Section */}
        <LinearGradient
            colors={COLORS.gradients.header as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
        >
            <SafeAreaView edges={["top"]}>
                <View style={[styles.headerContent, { paddingHorizontal: paddingX }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.avatarContainer}>
                           <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
                        </View>
                        <View>
                            <Text style={styles.greeting}>Добрый день, {displayName}!</Text>
                            <Text style={styles.roleLabel}>Ментор • Психолог</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.bellBtn}>
                        <Feather name="bell" size={20} color="white" />
                        <View style={styles.bellDot} />
                    </TouchableOpacity>
                </View>

                {/* Status Toggle Card */}
                <View style={[styles.statusToggle, { marginHorizontal: paddingX }]}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                             <View style={[styles.statusDot, { backgroundColor: isAcceptingOrders ? '#4ADE80' : '#9CA3AF' }]} />
                             <Text style={styles.statusTitle}>Принимаю заказы</Text>
                        </View>
                        <Text style={styles.statusSub}>
                            {isAcceptingOrders ? 'Вы видны в поиске' : 'Режим отпуска'}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => setIsAcceptingOrders(!isAcceptingOrders)}
                        style={[styles.switch, isAcceptingOrders && styles.switchActive]}
                    >
                        <MotiView 
                          animate={{ translateX: isAcceptingOrders ? 20 : 0 }}
                          style={styles.switchThumb} 
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>

        <View style={{ paddingHorizontal: paddingX, marginTop: 24 }}>
            
            {/* Today's Tasks */}
            <View style={{ marginBottom: 32 }}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Задачи на сегодня</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllBtn}>См. все</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 12 }}>
                    {todayTasks.map((task) => (
                        <TouchableOpacity 
                            key={task.id} 
                            style={styles.taskCard}
                            onPress={() => {
                                // Find student by name (mock logic) or use first available
                                const targetStudent = students.find(s => s.student_name.includes(task.child.split(' ')[0])) || students[0];
                                if (targetStudent) {
                                    router.push(`/(tabs)/mentor/student/${targetStudent.id}` as any);
                                }
                            }}
                        >
                            <View style={styles.taskTimeBox}>
                                <Text style={styles.taskTimeHour}>{task.time.split(':')[0]}</Text>
                                <Text style={styles.taskTimeMin}>{task.time.split(':')[1]}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.taskChild}>{task.child}</Text>
                                <Text style={styles.taskSubject}>{task.subject}</Text>
                            </View>
                            <View style={[styles.statusBadge, task.status === 'paid' ? styles.statusPaid : styles.statusWait]}>
                                <Text style={[styles.statusText, task.status === 'paid' ? styles.statusPaidText : styles.statusWaitText]}>
                                    {task.status === 'paid' ? 'Оплачено' : 'Ждет отчета'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Mentorship Requests */}
            {mentorshipRequests.length > 0 && (
                <View style={{ marginBottom: 32 }}>
                    <Text style={styles.sectionTitle}>Заявки на сопровождение</Text>
                    <View style={{ gap: 12, marginTop: 16 }}>
                        {mentorshipRequests.map((req) => (
                            <View key={req.id} style={styles.requestCard}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                                    <View style={styles.reqIconBox}>
                                        <Feather name="user-plus" size={18} color={COLORS.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.reqName}>{req.child_name || "Новый ученик"}</Text>
                                        <Text style={styles.reqSub}>{req.interest_text || "Хочет на пробный период"}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <TouchableOpacity onPress={() => respond(req.id, "rejected")} style={styles.actionBtnReject}>
                                        <Feather name="x" size={16} color="#EF4444" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => respond(req.id, "accepted")} style={styles.actionBtnAccept}>
                                        <Feather name="check" size={16} color="#10B981" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Quick Stats Widget */}
            <View style={styles.statsRow}>
                <TouchableOpacity 
                   onPress={() => router.push("/(tabs)/mentor/wallet")}
                   style={styles.statInfoCard}
                >
                   <View style={[styles.statIconBox, { backgroundColor: '#F0FDF4' }]}>
                        <Feather name="trending-up" size={18} color="#16A34A" />
                   </View>
                   <View>
                        <Text style={styles.statInfoVal}>87 000 ₸</Text>
                        <Text style={styles.statInfoLabel}>Доход (мес)</Text>
                   </View>
                </TouchableOpacity>
                <View style={styles.statInfoCard}>
                   <View style={[styles.statIconBox, { backgroundColor: '#EEF2FF' }]}>
                        <Feather name="users" size={18} color="#4F46E5" />
                   </View>
                   <View>
                        <Text style={styles.statInfoVal}>{students.length}</Text>
                        <Text style={styles.statInfoLabel}>Учеников</Text>
                   </View>
                </View>
            </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    headerGradient: {
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        ...(SHADOWS.md as any)
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        marginBottom: 24
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white'
    },
    avatarText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800'
    },
    greeting: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700'
    },
    roleLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '500'
    },
    bellBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bellDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#6C5CE7'
    },
    statusToggle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4
    },
    statusTitle: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15
    },
    statusSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        marginTop: 2
    },
    switch: {
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: 3
    },
    switchActive: {
        backgroundColor: '#4ADE80'
    },
    switchThumb: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'white'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.foreground
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16
    },
    viewAllBtn: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '700'
    },
    taskCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        ...SHADOWS.sm
    },
    taskTimeBox: {
        alignItems: 'center',
        minWidth: 40
    },
    taskTimeHour: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary
    },
    taskTimeMin: {
        fontSize: 11,
        color: COLORS.mutedForeground,
        marginTop: -2
    },
    taskChild: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.foreground
    },
    taskSubject: {
        fontSize: 13,
        color: COLORS.mutedForeground,
        marginTop: 2
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10
    },
    statusPaid: { backgroundColor: '#F0FDF4' },
    statusWait: { backgroundColor: '#FFFBEB' },
    statusText: { fontSize: 10, fontWeight: '700' },
    statusPaidText: { color: '#16A34A' },
    statusWaitText: { color: '#D97706' },
    requestCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.sm,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary
    },
    reqIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F3FF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    reqName: { fontSize: 15, fontWeight: '700', color: COLORS.foreground },
    reqSub: { fontSize: 12, color: COLORS.mutedForeground, marginTop: 1 },
    actionBtnAccept: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DCFCE7' },
    actionBtnReject: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
    statsRow: { flexDirection: 'row', gap: 16 },
    statInfoCard: { flex: 1, backgroundColor: 'white', borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOWS.sm },
    statIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    statInfoVal: { fontSize: 16, fontWeight: '800', color: COLORS.foreground },
    statInfoLabel: { fontSize: 11, color: COLORS.mutedForeground }
});
