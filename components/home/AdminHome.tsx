import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
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
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import {
  MentorApp,
  useAdminCourses,
  useAdminEnrollments,
  useAdminStats,
  useAIRules,
  useAllUsers,
  useFamilies,
  useMentorApps,
  useOrganizations,
  useTags,
  useTestQuestions,
  useTickets,
  useTransactions,
} from "../../hooks/useAdminData";

function formatKZT(n: number): string {
  if (!Number.isFinite(n)) return "0 ₸";
  return `${Math.round(n).toLocaleString("ru-RU")} ₸`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminHome() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const isTablet = width >= 768;
  const paddingX = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : SPACING.xl;

  const router = useRouter();
  const { user, logout } = useAuth();

  const families = useFamilies();
  const mentorApps = useMentorApps();
  const orgs = useOrganizations();
  const txs = useTransactions();
  const tickets = useTickets();
  const tags = useTags();
  const aiRules = useAIRules();
  const questions = useTestQuestions();
  const adminCourses = useAdminCourses();
  const allUsers = useAllUsers();
  const enrollments = useAdminEnrollments();
  const stats = useAdminStats(mentorApps.data, txs.data, families.data);

  const pendingMentors = mentorApps.data.filter((m) => m.status === "pending");
  const pendingCourses = adminCourses.data.filter((c) => c.status === "draft");
  const pendingEnrollments = enrollments.data.filter((e) => e.status === "awaiting_payment");
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const selectedMentor: MentorApp | null =
    mentorApps.data.find((m) => m.id === selectedMentorId) ??
    pendingMentors[0] ??
    null;

  const [searchQuery, setSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [newTagName, setNewTagName] = useState("");
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<{ name: string; condition: string; recommendation_title: string; recommendation_body: string }>({ name: "", condition: "", recommendation_title: "", recommendation_body: "" });
  const [activeTab, setActiveTab] = useState("overview");
  const [crmSubTab, setCrmSubTab] = useState("mentors");
  const [orgsSubTab, setOrgsSubTab] = useState("orgs");
  const [contentSubTab, setContentSubTab] = useState("tests");
  const [billingSubTab, setBillingSubTab] = useState("transactions");
  const [qcSubTab, setQcSubTab] = useState("logs");

  // Start or resume a conversation between admin and an org owner
  const handleStartOrgChat = async (orgId: string, orgName: string, ownerUserId: string | null) => {
    if (!supabase || !isSupabaseConfigured || !user?.id) return;
    if (!ownerUserId) {
      Alert.alert("Нет владельца", "У организации не указан владелец.");
      return;
    }

    // Look for an existing conversation shared by admin + org owner
    const [adminParts, ownerParts] = await Promise.all([
      supabase.from("conversation_participants").select("conversation_id").eq("user_id", user.id),
      supabase.from("conversation_participants").select("conversation_id").eq("user_id", ownerUserId),
    ]);
    const adminIds = new Set((adminParts.data ?? []).map((p: any) => p.conversation_id));
    const shared = (ownerParts.data ?? []).find((p: any) => adminIds.has(p.conversation_id));

    let convId: string | null = shared?.conversation_id ?? null;

    if (!convId) {
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({ name: orgName, icon_name: "briefcase", last_message_at: new Date().toISOString() })
        .select()
        .single();
      if (error || !conv) { Alert.alert("Ошибка", error?.message ?? "Не удалось создать чат"); return; }
      convId = conv.id;
      await supabase.from("conversation_participants").insert([
        { conversation_id: convId, user_id: user.id, unread_count: 0 },
        { conversation_id: convId, user_id: ownerUserId, unread_count: 0 },
      ]);
    }

    router.push({ pathname: "/modal/chat", params: { id: convId, name: orgName } } as any);
  };

  const orgsNeedingAction = orgs.data.filter((o) => o.status === "pending" || o.status === "ready_for_review");
  const totalPendingActions = stats.pendingMentors + pendingCourses.length + orgsNeedingAction.length + pendingEnrollments.length;

  const NAV_ITEMS = [
    { id: "overview", label: "Обзор платформы", icon: "activity" },
    {
      id: "crm",
      label: "Пользователи & CRM",
      icon: "users",
      badge: stats.pendingMentors || undefined,
    },
    { id: "content", label: "ИИ & Контент", icon: "cpu" },
    { id: "billing", label: "Биллинг", icon: "dollar-sign" },
    {
      id: "orgs",
      label: "Организации",
      icon: "briefcase",
      badge: (orgsNeedingAction.length + pendingCourses.length + pendingEnrollments.length) || undefined,
    },
    { id: "qc", label: "Контроль качества", icon: "shield" },
  ];

  const filteredMentors = mentorApps.data.filter((m) =>
    searchQuery.trim() === ""
      ? true
      : m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCRMView = () => {
    const USER_ROLES = ["all", "parent", "youth", "child", "mentor", "org", "admin"];
    const ROLE_LABELS: Record<string, string> = {
      all: "Все",
      parent: "Родители",
      youth: "Молодёжь",
      child: "Дети",
      mentor: "Менторы",
      org: "Организации",
      admin: "Администраторы",
    };
    const filteredUsers = allUsers.data.filter((u) => {
      const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const matchesSearch = searchQuery.trim() === "" ||
        `${u.first_name ?? ""} ${u.last_name ?? ""}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone ?? "").includes(searchQuery);
      return matchesRole && matchesSearch;
    });
    const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
      parent: { bg: "#EDE9FE", color: "#6C5CE7" },
      youth: { bg: "#DBEAFE", color: "#2563EB" },
      child: { bg: "#DCFCE7", color: "#16A34A" },
      mentor: { bg: "#FEF9C3", color: "#CA8A04" },
      org: { bg: "#FEE2E2", color: "#DC2626" },
      admin: { bg: "#F3F4F6", color: "#374151" },
    };
    return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: paddingX,
          borderBottomWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.surface,
        }}
      >
        <Text
          style={{
            fontSize: TYPOGRAPHY.size.xl,
            fontWeight: TYPOGRAPHY.weight.bold,
            color: COLORS.foreground,
            marginBottom: 4,
          }}
        >
          Пользователи & CRM
        </Text>
        <Text
          style={{
            fontSize: TYPOGRAPHY.size.sm,
            color: COLORS.mutedForeground,
            marginBottom: SPACING.lg,
          }}
        >
          Управление аккаунтами и модерация заявок
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.background,
            borderRadius: RADIUS.md,
            paddingHorizontal: SPACING.md,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Feather name="search" size={18} color={COLORS.mutedForeground} />
          <TextInput
            style={{
              flex: 1,
              padding: SPACING.md,
              fontSize: TYPOGRAPHY.size.sm,
              color: COLORS.foreground,
            }}
            placeholder="Поиск по имени или телефону..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: SPACING.sm,
          paddingHorizontal: paddingX,
          marginVertical: SPACING.md,
        }}
      >
        {(["mentors", "active_mentors", "users", "families"] as const).map((t) => {
          const activeMentorCount = mentorApps.data.filter((m) => m.status === "approved").length;
          const labels: Record<string, string> = {
            mentors: `Заявки${stats.pendingMentors > 0 ? ` (${stats.pendingMentors})` : ""}`,
            active_mentors: `Менторы (${activeMentorCount})`,
            users: "Все пользователи",
            families: "Семьи",
          };
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setCrmSubTab(t)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: crmSubTab === t ? COLORS.primary : COLORS.muted,
                borderRadius: RADIUS.full,
              }}
            >
              <Text style={{ color: crmSubTab === t ? "white" : COLORS.foreground, fontWeight: "600", fontSize: 13 }}>
                {labels[t]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {crmSubTab === "users" && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: paddingX, marginBottom: SPACING.sm, flexGrow: 0 }}>
          {USER_ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setUserRoleFilter(r)}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 12,
                marginRight: 6,
                backgroundColor: userRoleFilter === r ? COLORS.foreground : COLORS.muted,
                borderRadius: RADIUS.full,
              }}
            >
              <Text style={{ color: userRoleFilter === r ? "white" : COLORS.mutedForeground, fontWeight: "600", fontSize: 12 }}>
                {ROLE_LABELS[r]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={{ flex: 1, flexDirection: isTablet ? "row" : "column" }}>
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
          {crmSubTab === "mentors" && mentorApps.loading && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
            </View>
          )}
          {crmSubTab === "mentors" && !mentorApps.loading && filteredMentors.length === 0 && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Заявок нет.</Text>
            </View>
          )}
          {crmSubTab === "mentors" && filteredMentors.map((m) => {
            const statusLabel = m.status === "pending" ? "В ожидании" : m.status === "approved" ? "Одобрен" : "Отклонён";
            const statusBg = m.status === "pending" ? "#FEF9C3" : m.status === "approved" ? COLORS.success + "20" : COLORS.destructive + "20";
            const statusColor = m.status === "pending" ? "#854D0E" : m.status === "approved" ? COLORS.success : COLORS.destructive;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => setSelectedMentorId(m.id)}
                style={{
                  padding: SPACING.lg,
                  borderBottomWidth: 1,
                  borderColor: COLORS.border,
                  backgroundColor: selectedMentor?.id === m.id ? COLORS.primary + "05" : COLORS.surface,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: SPACING.md,
                }}
              >
                <View style={{ width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 24 }}>{m.photo_emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{m.name}</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>{m.specialization ?? "—"}</Text>
                </View>
                <View style={{ backgroundColor: statusBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: statusColor, textTransform: "uppercase" }}>{statusLabel}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {crmSubTab === "users" && allUsers.loading && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
            </View>
          )}
          {crmSubTab === "users" && !allUsers.loading && filteredUsers.length === 0 && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Пользователей не найдено.</Text>
            </View>
          )}
          {crmSubTab === "users" && !allUsers.loading && filteredUsers.map((u) => {
            const rc = ROLE_COLORS[u.role] ?? { bg: "#F3F4F6", color: "#374151" };
            const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "—";
            const roleLabel = ROLE_LABELS[u.role] ?? u.role;
            return (
              <View
                key={u.id}
                style={{
                  padding: SPACING.lg,
                  borderBottomWidth: 1,
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.surface,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: SPACING.md,
                }}
              >
                <View style={{ width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: rc.bg, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: rc.color }}>{(u.first_name ?? "?").charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{name}</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 1 }}>
                    {u.phone ?? "—"} • {formatDate(u.updated_at)}
                  </Text>
                </View>
                <View style={{ backgroundColor: rc.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: rc.color, textTransform: "uppercase" }}>{roleLabel}</Text>
                </View>
              </View>
            );
          })}

          {crmSubTab === "active_mentors" && mentorApps.data
            .filter((m) => m.status === "approved" && (searchQuery.trim() === "" || m.name.toLowerCase().includes(searchQuery.toLowerCase())))
            .map((m) => (
              <View
                key={m.id}
                style={{ padding: SPACING.lg, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, flexDirection: "row", alignItems: "center", gap: SPACING.md }}
              >
                <View style={{ width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.success + "15", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 24 }}>{m.photo_emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{m.name}</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>
                    {m.specialization ?? "—"} • {m.sessions} сессий • ★ {m.rating.toFixed(1)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: SPACING.sm, alignItems: "center" }}>
                  <View style={{ backgroundColor: COLORS.success + "20", paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full }}>
                    <Text style={{ fontSize: 10, fontWeight: "bold", color: COLORS.success, textTransform: "uppercase" }}>Активен</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => mentorApps.reject(m.id)}
                    style={{ width: 32, height: 32, borderRadius: RADIUS.md, backgroundColor: COLORS.destructive + "15", alignItems: "center", justifyContent: "center" }}
                  >
                    <Feather name="user-x" size={14} color={COLORS.destructive} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          {crmSubTab === "families" && families.loading && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
            </View>
          )}
          {crmSubTab === "families" && !families.loading && families.data.length === 0 && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Пока нет зарегистрированных семей.</Text>
            </View>
          )}
          {crmSubTab === "families" && !families.loading && families.data.map((f) => (
            <View
              key={f.id}
              style={{
                padding: SPACING.lg,
                borderBottomWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.surface,
                flexDirection: "row",
                alignItems: "center",
                gap: SPACING.md,
              }}
            >
              <View style={{ width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.muted, alignItems: "center", justifyContent: "center" }}>
                <Feather name="users" size={24} color={COLORS.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{f.parentName}</Text>
                <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>Детей: {f.children}</Text>
              </View>
              <View style={{ backgroundColor: f.plan === "Pro" ? COLORS.primary + "20" : COLORS.muted, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full }}>
                <Text style={{ fontSize: 10, fontWeight: "bold", color: f.plan === "Pro" ? COLORS.primary : COLORS.mutedForeground, textTransform: "uppercase" }}>{f.plan}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {crmSubTab === "mentors" && selectedMentor && (
          <View
            style={{
              width: isTablet ? 320 : "100%",
              backgroundColor: COLORS.surface,
              borderLeftWidth: 1,
              borderColor: COLORS.border,
              padding: SPACING.xl,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: "center", marginBottom: SPACING.xl }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: COLORS.primary + "15",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: SPACING.sm,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>
                    {selectedMentor.photo_emoji}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.lg,
                    fontWeight: TYPOGRAPHY.weight.bold,
                    color: COLORS.foreground,
                  }}
                >
                  {selectedMentor.name}
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.sm,
                    color: COLORS.mutedForeground,
                  }}
                >
                  {selectedMentor.specialization ?? "—"}
                </Text>
              </View>

              <View style={{ gap: SPACING.md, marginBottom: SPACING.xl }}>
                {selectedMentor.email && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: SPACING.sm,
                      backgroundColor: COLORS.background,
                      padding: SPACING.md,
                      borderRadius: RADIUS.md,
                    }}
                  >
                    <Feather name="mail" size={16} color={COLORS.primary} />
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.sm,
                        color: COLORS.foreground,
                      }}
                    >
                      {selectedMentor.email}
                    </Text>
                  </View>
                )}
                {selectedMentor.phone && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: SPACING.sm,
                      backgroundColor: COLORS.background,
                      padding: SPACING.md,
                      borderRadius: RADIUS.md,
                    }}
                  >
                    <Feather name="phone" size={16} color={COLORS.primary} />
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.sm,
                        color: COLORS.foreground,
                      }}
                    >
                      {selectedMentor.phone}
                    </Text>
                  </View>
                )}
                {selectedMentor.experience && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: SPACING.sm,
                      backgroundColor: COLORS.background,
                      padding: SPACING.md,
                      borderRadius: RADIUS.md,
                    }}
                  >
                    <Feather name="award" size={16} color={COLORS.primary} />
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.sm,
                        color: COLORS.foreground,
                      }}
                    >
                      {selectedMentor.experience}
                    </Text>
                  </View>
                )}
              </View>

              {selectedMentor.bio && (
                <>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.size.sm,
                      fontWeight: TYPOGRAPHY.weight.semibold,
                      color: COLORS.foreground,
                      marginBottom: SPACING.xs,
                    }}
                  >
                    О себе
                  </Text>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.size.sm,
                      color: COLORS.mutedForeground,
                      lineHeight: 20,
                      marginBottom: SPACING.xl,
                    }}
                  >
                    {selectedMentor.bio}
                  </Text>
                </>
              )}

              {selectedMentor.status === "pending" && (
                <View style={{ gap: SPACING.sm }}>
                  <TouchableOpacity
                    onPress={() => mentorApps.approve(selectedMentor.id)}
                    style={{
                      backgroundColor: COLORS.success,
                      padding: SPACING.md,
                      borderRadius: RADIUS.lg,
                      alignItems: "center",
                      ...SHADOWS.sm,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: TYPOGRAPHY.weight.bold,
                      }}
                    >
                      Одобрить
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => mentorApps.reject(selectedMentor.id)}
                    style={{
                      backgroundColor: COLORS.destructive,
                      padding: SPACING.md,
                      borderRadius: RADIUS.lg,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: TYPOGRAPHY.weight.bold,
                      }}
                    >
                      Отклонить
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
  };

  const renderOrgsView = () => {
    const LEVEL_LABELS: Record<string, string> = { beginner: "Начальный", intermediate: "Средний", advanced: "Продвинутый" };
    return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: paddingX, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
        <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 4 }}>
          Управление Организациями
        </Text>
        <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, marginBottom: SPACING.lg }}>
          Модерация учебных центров, секций и курсов
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View style={{ flexDirection: "row", gap: SPACING.sm }}>
          {([
            { key: "orgs", label: `Организации${orgsNeedingAction.length > 0 ? ` (${orgsNeedingAction.length})` : ""}` },
            { key: "courses", label: `Курсы${pendingCourses.length > 0 ? ` (${pendingCourses.length})` : ""}` },
            { key: "enrollments", label: `Записи${pendingEnrollments.length > 0 ? ` (${pendingEnrollments.length})` : ""}` },
          ] as const).map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setOrgsSubTab(key)}
              style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: orgsSubTab === key ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}
            >
              <Text style={{ color: orgsSubTab === key ? "white" : COLORS.foreground, fontWeight: "600", fontSize: 13 }}>{label}</Text>
            </TouchableOpacity>
          ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* --- Organisations list --- */}
        {orgsSubTab === "orgs" && orgs.loading && (
          <View style={{ padding: SPACING.lg }}><Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text></View>
        )}
        {orgsSubTab === "orgs" && !orgs.loading && orgs.data.length === 0 && (
          <View style={{ padding: SPACING.lg }}><Text style={{ color: COLORS.mutedForeground }}>Организаций пока нет.</Text></View>
        )}
        {orgsSubTab === "orgs" && orgs.data.map((org) => (
          <View
            key={org.id}
            style={{
              padding: SPACING.lg,
              borderBottomWidth: 1,
              borderColor: COLORS.border,
              backgroundColor: COLORS.surface,
              flexDirection: "row",
              alignItems: "center",
              gap: SPACING.md,
            }}
          >
            <View style={{ width: 48, height: 48, borderRadius: RADIUS.lg, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center" }}>
              <Feather name="briefcase" size={24} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{org.name}</Text>
              <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>
                {org.category ?? "—"} • {org.active_students} учеников •{" "}
                {adminCourses.data.filter((c) => c.org_id === org.id && c.status === "active").length} активных курсов
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: SPACING.sm, alignItems: "center" }}>
              {/* Chat button always visible */}
              <TouchableOpacity
                onPress={() => handleStartOrgChat(org.id, org.name, org.owner_user_id)}
                style={{ width: 34, height: 34, borderRadius: RADIUS.md, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center" }}
              >
                <Feather name="message-circle" size={16} color={COLORS.primary} />
              </TouchableOpacity>

              {org.status === "ready_for_review" ? (
                <View style={{ flexDirection: "row", gap: SPACING.sm, alignItems: "center" }}>
                  <View style={{ backgroundColor: "#FEF9C3", paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1, borderColor: "#FDE047" }}>
                    <Text style={{ fontSize: 9, fontWeight: "800", color: "#854D0E", textTransform: "uppercase" }}>На проверке</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => orgs.verify(org.id)}
                    style={{ backgroundColor: COLORS.success, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md }}
                  >
                    <Text style={{ color: "white", fontSize: TYPOGRAPHY.size.xs, fontWeight: "bold" }}>Активировать</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => orgs.reject(org.id)}
                    style={{ backgroundColor: COLORS.destructive, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md }}
                  >
                    <Text style={{ color: "white", fontSize: TYPOGRAPHY.size.xs, fontWeight: "bold" }}>Отклонить</Text>
                  </TouchableOpacity>
                </View>
              ) : org.status === "pending" ? (
                <View style={{ flexDirection: "row", gap: SPACING.sm }}>
                  <TouchableOpacity
                    onPress={() => orgs.verify(org.id)}
                    style={{ backgroundColor: COLORS.success, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md }}
                  >
                    <Text style={{ color: "white", fontSize: TYPOGRAPHY.size.xs, fontWeight: "bold" }}>Активировать</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => orgs.reject(org.id)}
                    style={{ backgroundColor: COLORS.destructive, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md }}
                  >
                    <Text style={{ color: "white", fontSize: TYPOGRAPHY.size.xs, fontWeight: "bold" }}>Отклонить</Text>
                  </TouchableOpacity>
                </View>
              ) : org.status === "new" ? (
                <View style={{ backgroundColor: "#EDE9FE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: "#6C5CE7", textTransform: "uppercase" }}>Новая</Text>
                </View>
              ) : (
                <View style={{ backgroundColor: (org.status === "verified" ? COLORS.success : COLORS.destructive) + "20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: org.status === "verified" ? COLORS.success : COLORS.destructive, textTransform: "uppercase" }}>
                    {org.status === "verified" ? "✓ Активна" : "Отклонена"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* --- Course moderation queue --- */}
        {orgsSubTab === "courses" && adminCourses.loading && (
          <View style={{ padding: SPACING.lg }}><Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text></View>
        )}
        {orgsSubTab === "courses" && !adminCourses.loading && adminCourses.data.length === 0 && (
          <View style={{ padding: SPACING.lg, alignItems: "center", paddingTop: 48 }}>
            <Feather name="check-circle" size={48} color="#D1D5DB" />
            <Text style={{ marginTop: 12, color: COLORS.mutedForeground, fontWeight: "700" }}>Нет курсов на модерации</Text>
          </View>
        )}
        {orgsSubTab === "courses" && adminCourses.data.map((course) => {
          const isPending = course.status === "draft";
          const isActive = course.status === "active";
          const statusBg = isPending ? "#FEF9C3" : isActive ? COLORS.success + "20" : COLORS.destructive + "20";
          const statusColor = isPending ? "#854D0E" : isActive ? COLORS.success : COLORS.destructive;
          const statusLabel = isPending ? "На модерации" : isActive ? "Активен" : "Отклонён";
          return (
            <View
              key={course.id}
              style={{
                padding: SPACING.lg,
                borderBottomWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.surface,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: SPACING.md, marginBottom: SPACING.sm }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{course.title}</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>
                    {course.org_name} • {LEVEL_LABELS[course.level] ?? course.level} • {course.price.toLocaleString()} ₸/мес
                    {(course.age_min || course.age_max) ? ` • ${course.age_min ?? ""}–${course.age_max ?? ""} лет` : ""}
                  </Text>
                  {course.description ? (
                    <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 4, lineHeight: 18 }} numberOfLines={2}>{course.description}</Text>
                  ) : null}
                  {course.skills.length > 0 && (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                      {course.skills.slice(0, 4).map((s) => (
                        <View key={s} style={{ backgroundColor: COLORS.primary + "15", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ fontSize: 10, color: COLORS.primary, fontWeight: "700" }}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View style={{ backgroundColor: statusBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: statusColor, textTransform: "uppercase" }}>{statusLabel}</Text>
                </View>
              </View>
              {isPending && (
                <View style={{ flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.sm }}>
                  <TouchableOpacity
                    onPress={() => adminCourses.approveCourse(course.id)}
                    style={{ flex: 1, backgroundColor: COLORS.success, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, alignItems: "center" }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: TYPOGRAPHY.size.sm }}>✓ Опубликовать</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => adminCourses.rejectCourse(course.id)}
                    style={{ flex: 1, backgroundColor: COLORS.destructive, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, alignItems: "center" }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: TYPOGRAPHY.size.sm }}>✗ Отклонить</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* --- Enrollment pipeline --- */}
        {orgsSubTab === "enrollments" && enrollments.loading && (
          <View style={{ padding: SPACING.lg }}><Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text></View>
        )}
        {orgsSubTab === "enrollments" && !enrollments.loading && enrollments.data.length === 0 && (
          <View style={{ padding: SPACING.lg, alignItems: "center", paddingTop: 48 }}>
            <Feather name="inbox" size={48} color="#D1D5DB" />
            <Text style={{ marginTop: 12, color: COLORS.mutedForeground, fontWeight: "700" }}>Заявок нет</Text>
          </View>
        )}
        {orgsSubTab === "enrollments" && enrollments.data.map((enr) => {
          const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
            awaiting_payment: { label: "Ждёт оплаты", bg: "#FEF9C3", color: "#854D0E" },
            paid:             { label: "Оплачено",    bg: COLORS.success + "20", color: COLORS.success },
            activated:        { label: "Активирован", bg: COLORS.primary + "20", color: COLORS.primary },
            completed:        { label: "Завершён",    bg: "#F3F4F6", color: "#6B7280" },
            rejected:         { label: "Отклонён",    bg: COLORS.destructive + "20", color: COLORS.destructive },
          };
          const st = STATUS_MAP[enr.status] ?? STATUS_MAP.awaiting_payment;
          return (
            <View key={enr.id} style={{ padding: SPACING.lg, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: SPACING.md }}>
                <View style={{ width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center" }}>
                  <Feather name="user" size={18} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>
                    {enr.child_name}{enr.child_age ? `, ${enr.child_age} лет` : ""}
                  </Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 1 }}>
                    {enr.parent_name ? `Родитель: ${enr.parent_name} • ` : ""}{enr.club ?? "—"} • {enr.org_name}
                  </Text>
                  {enr.applied_date && (
                    <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 1 }}>
                      Подал: {enr.applied_date}
                    </Text>
                  )}
                </View>
                <View style={{ backgroundColor: st.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: st.color, textTransform: "uppercase" }}>{st.label}</Text>
                </View>
              </View>
              {(enr.status === "awaiting_payment" || enr.status === "paid") && (
                <View style={{ flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.sm }}>
                  {enr.status === "awaiting_payment" && (
                    <TouchableOpacity
                      onPress={() => enrollments.markPaid(enr.id)}
                      style={{ flex: 1, backgroundColor: COLORS.success, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, alignItems: "center" }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold", fontSize: TYPOGRAPHY.size.sm }}>✓ Отметить оплаченным</Text>
                    </TouchableOpacity>
                  )}
                  {enr.status === "paid" && (
                    <TouchableOpacity
                      onPress={() => enrollments.activate(enr.id)}
                      style={{ flex: 1, backgroundColor: COLORS.primary, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, alignItems: "center" }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold", fontSize: TYPOGRAPHY.size.sm }}>▶ Активировать</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => enrollments.reject(enr.id)}
                    style={{ flex: 1, backgroundColor: COLORS.destructive, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, alignItems: "center" }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: TYPOGRAPHY.size.sm }}>✗ Отклонить</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
  };

  const renderContentView = () => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: paddingX,
          borderBottomWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.surface,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.size.xl,
              fontWeight: TYPOGRAPHY.weight.bold,
              color: COLORS.foreground,
              marginBottom: 4,
            }}
          >
            ИИ & Контент
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.size.sm,
              color: COLORS.mutedForeground,
            }}
          >
            Конструктор тестирования и настройка ИИ
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: SPACING.md,
          paddingHorizontal: paddingX,
          marginVertical: SPACING.md,
        }}
      >
        {(["tests", "tags", "logic"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setContentSubTab(t)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor:
                contentSubTab === t ? COLORS.primary : COLORS.muted,
              borderRadius: RADIUS.full,
            }}
          >
            <Text
              style={{
                color: contentSubTab === t ? "white" : COLORS.foreground,
                fontWeight: "600",
              }}
            >
              {t === "tests"
                ? "Вопросы (Тест)"
                : t === "tags"
                  ? "Справочник Тегов"
                  : "AI Логика"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {contentSubTab === "tests" && (
          <View style={{ paddingHorizontal: paddingX }}>
            {questions.loading && (
              <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
            )}
            {!questions.loading && questions.data.length === 0 && (
              <Text style={{ color: COLORS.mutedForeground }}>
                Вопросов нет.
              </Text>
            )}
            {questions.data.map((q) => (
              <View
                key={q.id}
                style={{
                  padding: SPACING.lg,
                  borderRadius: RADIUS.lg,
                  backgroundColor: COLORS.surface,
                  marginBottom: SPACING.md,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.size.md,
                      fontWeight: "500",
                      color: COLORS.foreground,
                    }}
                  >
                    {q.question}
                  </Text>
                  {q.tag && (
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.sm,
                        color: COLORS.primary,
                        marginTop: 4,
                      }}
                    >
                      Привязка: {q.tag}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => questions.remove(q.id)}>
                  <Feather
                    name="trash-2"
                    size={18}
                    color={COLORS.destructive}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {contentSubTab === "tags" && (
          <View style={{ padding: paddingX }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: SPACING.md,
                marginBottom: SPACING.lg,
              }}
            >
              {tags.data.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  onLongPress={() => tags.remove(tag.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: RADIUS.full,
                    backgroundColor: COLORS.primary + "15",
                    borderWidth: 1,
                    borderColor: COLORS.primary + "30",
                  }}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
                    {tag.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: SPACING.sm,
                alignItems: "center",
              }}
            >
              <TextInput
                value={newTagName}
                onChangeText={setNewTagName}
                placeholder="новый тег"
                style={{
                  flex: 1,
                  padding: SPACING.md,
                  borderRadius: RADIUS.md,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.surface,
                  color: COLORS.foreground,
                }}
              />
              <TouchableOpacity
                onPress={async () => {
                  await tags.add(newTagName);
                  setNewTagName("");
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: RADIUS.md,
                  backgroundColor: COLORS.primary,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  + Добавить
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.xs,
                color: COLORS.mutedForeground,
                marginTop: SPACING.sm,
              }}
            >
              Долгое нажатие на тег — удалить.
            </Text>
          </View>
        )}

        {contentSubTab === "logic" && (
          <View style={{ paddingHorizontal: paddingX, paddingBottom: SPACING.xl }}>
            {aiRules.loading && <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>}
            {!aiRules.loading && aiRules.data.length === 0 && <Text style={{ color: COLORS.mutedForeground }}>Правил нет.</Text>}
            {aiRules.data.map((r) => {
              const isEditing = editingRuleId === r.id;
              return (
                <View
                  key={r.id}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: RADIUS.lg,
                    borderWidth: 1,
                    borderColor: isEditing ? COLORS.primary + "60" : COLORS.border,
                    marginBottom: SPACING.md,
                    overflow: "hidden",
                  }}
                >
                  {/* Header row */}
                  <View style={{ flexDirection: "row", alignItems: "center", padding: SPACING.lg, gap: SPACING.md }}>
                    {/* Toggle */}
                    <TouchableOpacity
                      onPress={() => aiRules.toggle(r.id, !r.enabled)}
                      style={{
                        width: 44, height: 24, borderRadius: 12,
                        backgroundColor: r.enabled ? COLORS.success : COLORS.muted,
                        justifyContent: "center",
                        paddingHorizontal: 2,
                      }}
                    >
                      <View style={{
                        width: 20, height: 20, borderRadius: 10, backgroundColor: "white",
                        alignSelf: r.enabled ? "flex-end" : "flex-start",
                        ...SHADOWS.sm,
                      }} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "bold", fontSize: TYPOGRAPHY.size.md, color: r.enabled ? COLORS.foreground : COLORS.mutedForeground }}>
                        {r.name}
                      </Text>
                      {!isEditing && (
                        <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }} numberOfLines={1}>
                          {r.condition} → {r.recommendation_title}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        if (isEditing) {
                          setEditingRuleId(null);
                        } else {
                          setEditingRuleId(r.id);
                          setEditingRule({
                            name: r.name,
                            condition: r.condition,
                            recommendation_title: r.recommendation_title,
                            recommendation_body: r.recommendation_body ?? "",
                          });
                        }
                      }}
                      style={{ width: 32, height: 32, borderRadius: RADIUS.md, backgroundColor: isEditing ? COLORS.primary + "15" : COLORS.muted, alignItems: "center", justifyContent: "center" }}
                    >
                      <Feather name={isEditing ? "x" : "edit-2"} size={14} color={isEditing ? COLORS.primary : COLORS.mutedForeground} />
                    </TouchableOpacity>
                  </View>

                  {/* Edit form */}
                  {isEditing && (
                    <View style={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, gap: SPACING.sm }}>
                      {([
                        { field: "name" as const, label: "Название правила" },
                        { field: "condition" as const, label: "Условие (если...)" },
                        { field: "recommendation_title" as const, label: "Рекомендация (заголовок)" },
                        { field: "recommendation_body" as const, label: "Рекомендация (описание)" },
                      ]).map(({ field, label }) => (
                        <View key={field}>
                          <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, fontWeight: "600", marginBottom: 4 }}>{label}</Text>
                          <TextInput
                            value={editingRule[field]}
                            onChangeText={(v) => setEditingRule((prev) => ({ ...prev, [field]: v }))}
                            style={{
                              borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
                              padding: SPACING.md, fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground,
                              backgroundColor: COLORS.background,
                              minHeight: field === "recommendation_body" ? 60 : undefined,
                            }}
                            multiline={field === "recommendation_body"}
                          />
                        </View>
                      ))}
                      <TouchableOpacity
                        onPress={async () => {
                          await aiRules.updateRule(r.id, editingRule);
                          setEditingRuleId(null);
                        }}
                        style={{ backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: RADIUS.md, alignItems: "center", marginTop: SPACING.sm }}
                      >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: TYPOGRAPHY.size.sm }}>Сохранить</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderBillingView = () => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: paddingX,
          borderBottomWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.surface,
        }}
      >
        <View style={{ marginBottom: SPACING.md }}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.size.xl,
              fontWeight: TYPOGRAPHY.weight.bold,
              color: COLORS.foreground,
              marginBottom: 4,
            }}
          >
            Финансы & Биллинг
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.size.sm,
              color: COLORS.mutedForeground,
            }}
          >
            Мониторинг транзакций и сплит-платежей
          </Text>
        </View>

        <View
          style={{
            flexDirection: isTablet ? "row" : "column",
            gap: SPACING.md,
            paddingBottom: SPACING.lg,
          }}
        >
          <View
            style={{
              flex: 1,
              padding: SPACING.lg,
              borderRadius: RADIUS.lg,
              backgroundColor: COLORS.primary + "10",
              borderWidth: 1,
              borderColor: COLORS.primary + "30",
            }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.sm,
                color: COLORS.mutedForeground,
              }}
            >
              Общий оборот (GMV)
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.xxl,
                fontWeight: "bold",
                color: COLORS.foreground,
                marginTop: 8,
              }}
            >
              {formatKZT(stats.gmv)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: SPACING.lg,
              borderRadius: RADIUS.lg,
              backgroundColor: COLORS.success + "10",
              borderWidth: 1,
              borderColor: COLORS.success + "30",
            }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.sm,
                color: COLORS.mutedForeground,
              }}
            >
              Доход платформы
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.xxl,
                fontWeight: "bold",
                color: COLORS.success,
                marginTop: 8,
              }}
            >
              {formatKZT(stats.revenue)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: SPACING.lg,
              borderRadius: RADIUS.lg,
              backgroundColor: COLORS.background,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.sm,
                color: COLORS.mutedForeground,
              }}
            >
              Платные подписчики (Pro)
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.xxl,
                fontWeight: "bold",
                color: COLORS.foreground,
                marginTop: 8,
              }}
            >
              {stats.proSubscribers} / {stats.totalSubscribers}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: SPACING.md,
          paddingHorizontal: paddingX,
          marginVertical: SPACING.md,
        }}
      >
        {(["transactions", "fees"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setBillingSubTab(t)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor:
                billingSubTab === t ? COLORS.primary : COLORS.muted,
              borderRadius: RADIUS.full,
            }}
          >
            <Text
              style={{
                color: billingSubTab === t ? "white" : COLORS.foreground,
                fontWeight: "600",
              }}
            >
              {t === "transactions"
                ? "Сплит-Транзакции"
                : "Управление комиссией"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {billingSubTab === "transactions" && txs.loading && (
          <View style={{ padding: SPACING.lg }}>
            <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
          </View>
        )}
        {billingSubTab === "transactions" &&
          !txs.loading &&
          txs.data.length === 0 && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>
                Транзакций нет.
              </Text>
            </View>
          )}
        {billingSubTab === "transactions" &&
          txs.data.map((t) => (
            <View
              key={t.id}
              style={{
                padding: SPACING.lg,
                borderBottomWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.surface,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: RADIUS.full,
                  backgroundColor: COLORS.success + "15",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name="arrow-up-right"
                  size={24}
                  color={COLORS.success}
                />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.md,
                    fontWeight: "bold",
                    color: COLORS.foreground,
                  }}
                >
                  {t.parent_name} → {t.org_name}
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.xs,
                    color: COLORS.mutedForeground,
                    marginTop: 2,
                  }}
                >
                  {formatDate(t.created_at)}{" "}
                  {t.external_ref ? `• ${t.external_ref}` : ""}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.md,
                    fontWeight: "bold",
                    color: COLORS.foreground,
                  }}
                >
                  {formatKZT(t.amount)}
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.xs,
                    color: COLORS.mutedForeground,
                    marginTop: 2,
                  }}
                >
                  <Text style={{ color: COLORS.success }}>
                    +{formatKZT(t.org_amount)} партнёру
                  </Text>{" "}
                  |{" "}
                  <Text style={{ color: COLORS.primary }}>
                    +{formatKZT(t.platform_amount)} платформе
                  </Text>
                </Text>
              </View>
            </View>
          ))}

        {billingSubTab === "fees" &&
          orgs.data.map((org) => (
            <View
              key={org.id}
              style={{
                padding: SPACING.lg,
                borderBottomWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.surface,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.md,
                    fontWeight: "bold",
                    color: COLORS.foreground,
                  }}
                >
                  {org.name}
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.xs,
                    color: COLORS.mutedForeground,
                    marginTop: 2,
                  }}
                >
                  Категория: {org.category ?? "—"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.background,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.sm,
                    fontWeight: "bold",
                    color: COLORS.foreground,
                  }}
                >
                  Комиссия:{" "}
                </Text>
                <TextInput
                  defaultValue={String(org.commission_pct)}
                  keyboardType="numeric"
                  onEndEditing={(e) => {
                    const val = parseFloat(e.nativeEvent.text);
                    if (Number.isFinite(val) && val !== org.commission_pct)
                      orgs.setCommission(org.id, val);
                  }}
                  style={{
                    fontSize: TYPOGRAPHY.size.sm,
                    fontWeight: "bold",
                    color: COLORS.primary,
                    width: 40,
                    textAlign: "center",
                  }}
                />
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.sm,
                    fontWeight: "bold",
                    color: COLORS.foreground,
                  }}
                >
                  %
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );

  const renderQCView = () => {
    const filtered = tickets.data.filter((t) =>
      qcSubTab === "tickets" ? t.kind === "complaint" : true,
    );
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            padding: paddingX,
            borderBottomWidth: 1,
            borderColor: COLORS.border,
            backgroundColor: COLORS.surface,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.xl,
                fontWeight: TYPOGRAPHY.weight.bold,
                color: COLORS.foreground,
                marginBottom: 4,
              }}
            >
              Контроль Качества
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.sm,
                color: COLORS.mutedForeground,
              }}
            >
              Логи активности и система жалоб
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: SPACING.md,
            paddingHorizontal: paddingX,
            marginVertical: SPACING.md,
          }}
        >
          {(["logs", "tickets"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setQcSubTab(t)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: qcSubTab === t ? COLORS.primary : COLORS.muted,
                borderRadius: RADIUS.full,
              }}
            >
              <Text
                style={{
                  color: qcSubTab === t ? "white" : COLORS.foreground,
                  fontWeight: "600",
                }}
              >
                {t === "logs" ? "Лог фидбеков" : "Тикеты и Жалобы"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
          {tickets.loading && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
            </View>
          )}
          {!tickets.loading && filtered.length === 0 && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>
                Записей нет.
              </Text>
            </View>
          )}
          {filtered.map((tick) => {
            const kindLabel = tick.kind === "complaint" ? "Жалоба" : "Отзыв";
            const statusLabel =
              tick.status === "open"
                ? "Открыт"
                : tick.status === "in_progress"
                  ? "В работе"
                  : "Решен";
            const statusBg =
              tick.status === "open"
                ? "#FEF9C3"
                : tick.status === "in_progress"
                  ? COLORS.primary + "20"
                  : COLORS.success + "20";
            const statusColor =
              tick.status === "open"
                ? "#854D0E"
                : tick.status === "in_progress"
                  ? COLORS.primary
                  : COLORS.success;
            return (
              <View
                key={tick.id}
                style={{
                  padding: SPACING.lg,
                  borderRadius: RADIUS.lg,
                  marginHorizontal: paddingX,
                  marginBottom: SPACING.md,
                  backgroundColor: COLORS.surface,
                  borderWidth: 1,
                  borderColor:
                    tick.kind === "complaint"
                      ? COLORS.destructive + "30"
                      : COLORS.border,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: SPACING.sm,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: SPACING.sm }}>
                    <View
                      style={{
                        backgroundColor:
                          tick.kind === "complaint"
                            ? COLORS.destructive + "15"
                            : COLORS.primary + "15",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: RADIUS.sm,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            tick.kind === "complaint"
                              ? COLORS.destructive
                              : COLORS.primary,
                          fontSize: 10,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {kindLabel}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.xs,
                        color: COLORS.mutedForeground,
                      }}
                    >
                      {formatDate(tick.created_at)}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: statusBg,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: RADIUS.full,
                    }}
                  >
                    <Text
                      style={{
                        color: statusColor,
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {statusLabel}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.md,
                    fontWeight: "bold",
                    color: COLORS.foreground,
                    marginBottom: 4,
                  }}
                >
                  От: {tick.reporter_name}
                </Text>
                {tick.target && (
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.size.xs,
                      color: COLORS.mutedForeground,
                      marginBottom: SPACING.md,
                    }}
                  >
                    Цель: {tick.target}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.sm,
                    color: COLORS.foreground,
                    lineHeight: 20,
                  }}
                >
                  {tick.body}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: SPACING.sm,
                    marginTop: SPACING.md,
                  }}
                >
                  {tick.status === "open" && (
                    <TouchableOpacity
                      onPress={() => tickets.takeInProgress(tick.id)}
                      style={{
                        paddingVertical: SPACING.sm,
                        paddingHorizontal: SPACING.md,
                        backgroundColor: COLORS.primary,
                        borderRadius: RADIUS.md,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: TYPOGRAPHY.size.sm,
                        }}
                      >
                        Взять в работу
                      </Text>
                    </TouchableOpacity>
                  )}
                  {tick.status !== "resolved" && (
                    <TouchableOpacity
                      onPress={() => tickets.resolve(tick.id)}
                      style={{
                        paddingVertical: SPACING.sm,
                        paddingHorizontal: SPACING.md,
                        backgroundColor: COLORS.success,
                        borderRadius: RADIUS.md,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: TYPOGRAPHY.size.sm,
                        }}
                      >
                        Отметить решённым
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderOverviewView = () => {
    const roleGroups = allUsers.data.reduce<Record<string, number>>((acc, u) => {
      acc[u.role] = (acc[u.role] ?? 0) + 1;
      return acc;
    }, {});
    const ROLE_LABELS_OV: Record<string, string> = { parent: "Родители", youth: "Молодёжь", child: "Дети", mentor: "Менторы", org: "Организации", admin: "Администраторы" };
    const ROLE_COLORS_OV: Record<string, { bg: string; color: string }> = {
      parent: { bg: "#EDE9FE", color: "#6C5CE7" },
      youth: { bg: "#DBEAFE", color: "#2563EB" },
      child: { bg: "#DCFCE7", color: "#16A34A" },
      mentor: { bg: "#FEF9C3", color: "#CA8A04" },
      org: { bg: "#FEE2E2", color: "#DC2626" },
      admin: { bg: "#F3F4F6", color: "#374151" },
    };
    const activeCourses = adminCourses.data.filter((c) => c.status === "active").length;
    const draftCourses = adminCourses.data.filter((c) => c.status === "draft").length;
    const verifiedOrgs = orgs.data.filter((o) => o.status === "verified").length;
    const pendingOrgsCount = orgsNeedingAction.length;
    const activeEnrollments = enrollments.data.filter((e) => e.status === "activated").length;
    const pendingEnrollmentsCount = enrollments.data.filter((e) => e.status === "awaiting_payment").length;

    return (
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ padding: paddingX }}>
          <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 4, marginTop: SPACING.md }}>
            Обзор платформы
          </Text>
          <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, marginBottom: SPACING.xl }}>
            Состояние платформы в реальном времени
          </Text>

          {/* Pending actions banner */}
          {totalPendingActions > 0 && (
            <View style={{ backgroundColor: "#FEF9C3", borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, flexDirection: "row", alignItems: "center", gap: SPACING.md, borderWidth: 1, borderColor: "#FEF08A" }}>
              <Feather name="alert-circle" size={20} color="#CA8A04" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold", color: "#854D0E", fontSize: TYPOGRAPHY.size.sm }}>Требуют вашего внимания</Text>
                <Text style={{ color: "#92400E", fontSize: TYPOGRAPHY.size.xs, marginTop: 2 }}>
                  {pendingOrgsCount > 0 ? `${pendingOrgsCount} орг. на проверке  ` : ""}
                  {stats.pendingMentors > 0 ? `${stats.pendingMentors} заявок менторов  ` : ""}
                  {draftCourses > 0 ? `${draftCourses} курсов на модерации  ` : ""}
                  {pendingEnrollmentsCount > 0 ? `${pendingEnrollmentsCount} записей ждут оплаты` : ""}
                </Text>
              </View>
            </View>
          )}

          {/* Quick stats grid */}
          <View style={{ flexDirection: isTablet ? "row" : "column", gap: SPACING.md, marginBottom: SPACING.xl }}>
            {[
              { label: "Всего пользователей", value: allUsers.data.length, icon: "users", bg: COLORS.primary + "15", color: COLORS.primary },
              { label: "Активных курсов", value: activeCourses, icon: "book-open", bg: "#DCFCE7", color: "#16A34A" },
              { label: "Верифицированных орг.", value: verifiedOrgs, icon: "briefcase", bg: "#DBEAFE", color: "#2563EB" },
              { label: "Доход платформы", value: formatKZT(stats.revenue), icon: "dollar-sign", bg: "#FEF9C3", color: "#CA8A04" },
            ].map((card, i) => (
              <View key={i} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: SPACING.md, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm }}>
                <View style={{ width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: card.bg, alignItems: "center", justifyContent: "center" }}>
                  <Feather name={card.icon as any} size={20} color={card.color} />
                </View>
                <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>{String(card.value)}</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground }}>{card.label}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Users by role */}
          <Text style={{ fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: SPACING.md, fontSize: TYPOGRAPHY.size.md }}>
            Пользователи по ролям
          </Text>
          <View style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl, overflow: "hidden" }}>
            {Object.entries(ROLE_LABELS_OV).map(([role, label], i) => {
              const count = roleGroups[role] ?? 0;
              const rc = ROLE_COLORS_OV[role] ?? { bg: "#F3F4F6", color: "#374151" };
              const total = allUsers.data.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <View key={role} style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md, padding: SPACING.lg, borderTopWidth: i > 0 ? 1 : 0, borderColor: COLORS.border }}>
                  <View style={{ width: 32, height: 32, borderRadius: RADIUS.md, backgroundColor: rc.bg, alignItems: "center", justifyContent: "center" }}>
                    <Feather name="user" size={14} color={rc.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: "600", color: COLORS.foreground }}>{label}</Text>
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: "bold", color: COLORS.foreground }}>{count}</Text>
                    </View>
                    <View style={{ height: 4, borderRadius: 2, backgroundColor: COLORS.muted }}>
                      <View style={{ height: 4, borderRadius: 2, width: `${pct}%` as any, backgroundColor: rc.color }} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Courses & Enrollments summary */}
          <Text style={{ fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: SPACING.md, fontSize: TYPOGRAPHY.size.md }}>
            Курсы & Записи
          </Text>
          <View style={{ flexDirection: isTablet ? "row" : "column", gap: SPACING.md, marginBottom: SPACING.xl }}>
            {[
              { label: "Активных курсов", value: activeCourses, color: COLORS.success, bg: COLORS.success + "15" },
              { label: "На модерации", value: draftCourses, color: "#CA8A04", bg: "#FEF9C3" },
              { label: "Активных записей", value: activeEnrollments, color: COLORS.primary, bg: COLORS.primary + "15" },
              { label: "Ждут оплаты", value: pendingEnrollmentsCount, color: "#DC2626", bg: "#FEE2E2" },
            ].map((item, i) => (
              <View key={i} style={{ flex: 1, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: item.bg, alignItems: "center" }}>
                <Text style={{ fontSize: 28, fontWeight: "900", color: item.color }}>{item.value}</Text>
                <Text style={{ fontSize: TYPOGRAPHY.size.xs, fontWeight: "600", color: item.color, marginTop: 2, textAlign: "center" }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewView();
      case "crm":
        return renderCRMView();
      case "orgs":
        return renderOrgsView();
      case "content":
        return renderContentView();
      case "billing":
        return renderBillingView();
      case "qc":
        return renderQCView();
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={{ flex: 1, flexDirection: isTablet ? "row" : "column" }}>
          <View
            style={{
              width: isTablet ? 260 : "100%",
              backgroundColor: COLORS.surface,
              borderRightWidth: isTablet ? 1 : 0,
              borderBottomWidth: isTablet ? 0 : 1,
              borderColor: COLORS.border,
              padding: SPACING.lg,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: SPACING.xl,
              }}
            >
              <LinearGradient
                colors={COLORS.gradients.primary as any}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: RADIUS.lg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                >
                  UM
                </Text>
              </LinearGradient>
              <View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.lg,
                    fontWeight: TYPOGRAPHY.weight.bold,
                    color: COLORS.foreground,
                  }}
                >
                  UM Admin
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.xs,
                    color: COLORS.mutedForeground,
                  }}
                >
                  Панель управления
                </Text>
              </View>
            </View>

            <View
              style={{
                gap: SPACING.sm,
                flex: isTablet ? 1 : undefined,
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              {NAV_ITEMS.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    padding: SPACING.md,
                    borderRadius: RADIUS.lg,
                    backgroundColor:
                      activeTab === tab.id ? COLORS.primary : "transparent",
                    flex: isTablet ? undefined : 1,
                    justifyContent: isTablet ? "flex-start" : "center",
                  }}
                >
                  <Feather
                    name={tab.icon as any}
                    size={18}
                    color={
                      activeTab === tab.id ? "white" : COLORS.mutedForeground
                    }
                  />
                  {isTablet && (
                    <Text
                      style={{
                        flex: 1,
                        fontSize: TYPOGRAPHY.size.sm,
                        fontWeight: TYPOGRAPHY.weight.medium,
                        color:
                          activeTab === tab.id
                            ? "white"
                            : COLORS.mutedForeground,
                      }}
                    >
                      {tab.label}
                    </Text>
                  )}
                  {isTablet && tab.badge !== undefined && (
                    <View
                      style={{
                        backgroundColor:
                          activeTab === tab.id
                            ? "rgba(255,255,255,0.2)"
                            : COLORS.primary,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: RADIUS.md,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {tab.badge}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              onPress={async () => {
                await logout();
                router.replace("/intro" as any);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: SPACING.md,
                borderRadius: RADIUS.lg,
                marginTop: isTablet ? 'auto' : 0,
              }}
            >
              <Feather name="log-out" size={18} color={COLORS.destructive} />
              {isTablet && (
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.sm,
                    fontWeight: TYPOGRAPHY.weight.medium,
                    color: COLORS.destructive,
                  }}
                >
                  Выйти
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {renderContent()}
        </View>
      </SafeAreaView>
    </View>
  );
}
