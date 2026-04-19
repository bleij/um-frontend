import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
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
import {
  MentorApp,
  useAdminStats,
  useAIRules,
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

  const families = useFamilies();
  const mentorApps = useMentorApps();
  const orgs = useOrganizations();
  const txs = useTransactions();
  const tickets = useTickets();
  const tags = useTags();
  const aiRules = useAIRules();
  const questions = useTestQuestions();
  const stats = useAdminStats(mentorApps.data, txs.data, families.data);

  const pendingMentors = mentorApps.data.filter((m) => m.status === "pending");
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const selectedMentor: MentorApp | null =
    mentorApps.data.find((m) => m.id === selectedMentorId) ??
    pendingMentors[0] ??
    null;

  const [searchQuery, setSearchQuery] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [activeTab, setActiveTab] = useState("crm");
  const [crmSubTab, setCrmSubTab] = useState("mentors");
  const [contentSubTab, setContentSubTab] = useState("tests");
  const [billingSubTab, setBillingSubTab] = useState("transactions");
  const [qcSubTab, setQcSubTab] = useState("logs");

  const statCards = [
    {
      label: "Ожидают проверки",
      value: String(stats.pendingMentors),
      icon: "file-text",
      color: "#CA8A04",
      bg: "#FEF9C3",
    },
    {
      label: "Всего менторов",
      value: String(stats.totalMentors),
      icon: "users",
      color: COLORS.primary,
      bg: COLORS.primary + "15",
    },
    {
      label: "Активных сессий",
      value: String(stats.activeSessions),
      icon: "clock",
      color: "#16A34A",
      bg: "#DCFCE7",
    },
    {
      label: "Доход",
      value: formatKZT(stats.revenue),
      icon: "dollar-sign",
      color: "#2563EB",
      bg: "#DBEAFE",
    },
  ];

  const NAV_ITEMS = [
    {
      id: "crm",
      label: "Пользователи & CRM",
      icon: "users",
      badge: stats.pendingMentors || undefined,
    },
    { id: "content", label: "ИИ & Контент", icon: "cpu" },
    { id: "billing", label: "Биллинг", icon: "dollar-sign" },
    { id: "orgs", label: "Организации", icon: "briefcase" },
    { id: "qc", label: "Контроль качества", icon: "shield" },
  ];

  const filteredMentors = mentorApps.data.filter((m) =>
    searchQuery.trim() === ""
      ? true
      : m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCRMView = () => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: paddingX,
          borderBottomWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.surface,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: SPACING.lg,
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
              Управление пользователями
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.size.sm,
                color: COLORS.mutedForeground,
              }}
            >
              Модерация заявок и контроль доступа
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: isTablet ? "row" : "column",
            gap: SPACING.md,
            marginBottom: SPACING.lg,
          }}
        >
          {statCards.map((st, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: SPACING.md,
                padding: SPACING.lg,
                borderRadius: RADIUS.lg,
                backgroundColor: COLORS.background,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: RADIUS.md,
                  backgroundColor: st.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name={st.icon as any} size={20} color={st.color} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.xl,
                    fontWeight: TYPOGRAPHY.weight.bold,
                    color: COLORS.foreground,
                  }}
                >
                  {st.value}
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.size.xs,
                    color: COLORS.mutedForeground,
                  }}
                >
                  {st.label}
                </Text>
              </View>
            </View>
          ))}
        </View>

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
            placeholder="Поиск менторов..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
        <TouchableOpacity
          onPress={() => setCrmSubTab("mentors")}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor:
              crmSubTab === "mentors" ? COLORS.primary : COLORS.muted,
            borderRadius: RADIUS.full,
          }}
        >
          <Text
            style={{
              color: crmSubTab === "mentors" ? "white" : COLORS.foreground,
              fontWeight: "600",
            }}
          >
            Менторы (Заявки)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCrmSubTab("users")}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor:
              crmSubTab === "users" ? COLORS.primary : COLORS.muted,
            borderRadius: RADIUS.full,
          }}
        >
          <Text
            style={{
              color: crmSubTab === "users" ? "white" : COLORS.foreground,
              fontWeight: "600",
            }}
          >
            Семьи (Родители/Дети)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, flexDirection: isTablet ? "row" : "column" }}>
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
          {crmSubTab === "mentors" && mentorApps.loading && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
            </View>
          )}
          {crmSubTab === "mentors" &&
            !mentorApps.loading &&
            filteredMentors.length === 0 && (
              <View style={{ padding: SPACING.lg }}>
                <Text style={{ color: COLORS.mutedForeground }}>
                  Заявок нет.
                </Text>
              </View>
            )}
          {crmSubTab === "mentors" &&
            filteredMentors.map((m) => {
              const statusLabel =
                m.status === "pending"
                  ? "В ожидании"
                  : m.status === "approved"
                    ? "Одобрен"
                    : "Отклонён";
              const statusBg =
                m.status === "pending"
                  ? "#FEF9C3"
                  : m.status === "approved"
                    ? COLORS.success + "20"
                    : COLORS.destructive + "20";
              const statusColor =
                m.status === "pending"
                  ? "#854D0E"
                  : m.status === "approved"
                    ? COLORS.success
                    : COLORS.destructive;
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setSelectedMentorId(m.id)}
                  style={{
                    padding: SPACING.lg,
                    borderBottomWidth: 1,
                    borderColor: COLORS.border,
                    backgroundColor:
                      selectedMentor?.id === m.id
                        ? COLORS.primary + "05"
                        : COLORS.surface,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: SPACING.md,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: RADIUS.full,
                      backgroundColor: COLORS.primary + "15",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{m.photo_emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.md,
                        fontWeight: TYPOGRAPHY.weight.semibold,
                        color: COLORS.foreground,
                      }}
                    >
                      {m.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.size.xs,
                        color: COLORS.mutedForeground,
                        marginTop: 2,
                      }}
                    >
                      {m.specialization ?? "—"}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: statusBg,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: RADIUS.full,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: statusColor,
                        textTransform: "uppercase",
                      }}
                    >
                      {statusLabel}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

          {crmSubTab === "users" && families.loading && (
            <View style={{ padding: SPACING.lg }}>
              <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
            </View>
          )}
          {crmSubTab === "users" &&
            !families.loading &&
            families.data.length === 0 && (
              <View style={{ padding: SPACING.lg }}>
                <Text style={{ color: COLORS.mutedForeground }}>
                  Пока нет зарегистрированных родителей.
                </Text>
              </View>
            )}
          {crmSubTab === "users" &&
            !families.loading &&
            families.data.map((f) => (
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
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: RADIUS.full,
                    backgroundColor: COLORS.muted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather
                    name="users"
                    size={24}
                    color={COLORS.mutedForeground}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.size.md,
                      fontWeight: TYPOGRAPHY.weight.semibold,
                      color: COLORS.foreground,
                    }}
                  >
                    {f.parentName}
                  </Text>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.size.xs,
                      color: COLORS.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    Детей: {f.children}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor:
                      f.plan === "Pro" ? COLORS.primary + "20" : COLORS.muted,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: RADIUS.full,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color:
                        f.plan === "Pro"
                          ? COLORS.primary
                          : COLORS.mutedForeground,
                      textTransform: "uppercase",
                    }}
                  >
                    {f.plan}
                  </Text>
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

  const renderOrgsView = () => (
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
            Управление Организациями
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.size.sm,
              color: COLORS.mutedForeground,
            }}
          >
            Модерация учебных центров и секций
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {orgs.loading && (
          <View style={{ padding: SPACING.lg }}>
            <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
          </View>
        )}
        {!orgs.loading && orgs.data.length === 0 && (
          <View style={{ padding: SPACING.lg }}>
            <Text style={{ color: COLORS.mutedForeground }}>
              Организаций пока нет.
            </Text>
          </View>
        )}
        {orgs.data.map((org) => (
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
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: RADIUS.lg,
                backgroundColor: COLORS.primary + "15",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="briefcase" size={24} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.size.md,
                  fontWeight: TYPOGRAPHY.weight.semibold,
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
                Категория: {org.category ?? "—"} • Учеников:{" "}
                {org.active_students}
              </Text>
            </View>

            {org.status === "pending" ? (
              <View style={{ flexDirection: "row", gap: SPACING.sm }}>
                <TouchableOpacity
                  onPress={() => orgs.verify(org.id)}
                  style={{
                    backgroundColor: COLORS.success,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    borderRadius: RADIUS.md,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: TYPOGRAPHY.size.xs,
                      fontWeight: "bold",
                    }}
                  >
                    Верифицировать
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => orgs.reject(org.id)}
                  style={{
                    backgroundColor: COLORS.destructive,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    borderRadius: RADIUS.md,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: TYPOGRAPHY.size.xs,
                      fontWeight: "bold",
                    }}
                  >
                    Отклонить
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor:
                    (org.status === "verified"
                      ? COLORS.success
                      : COLORS.destructive) + "20",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: RADIUS.full,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color:
                      org.status === "verified"
                        ? COLORS.success
                        : COLORS.destructive,
                    textTransform: "uppercase",
                  }}
                >
                  {org.status === "verified" ? "Проверено" : "Отклонено"}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

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
          <View style={{ paddingHorizontal: paddingX }}>
            {aiRules.loading && (
              <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
            )}
            {!aiRules.loading && aiRules.data.length === 0 && (
              <Text style={{ color: COLORS.mutedForeground }}>Правил нет.</Text>
            )}
            {aiRules.data.map((r) => (
              <View
                key={r.id}
                style={{
                  padding: SPACING.lg,
                  backgroundColor: COLORS.surface,
                  borderRadius: RADIUS.lg,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: SPACING.md,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: COLORS.foreground,
                    }}
                  >
                    {r.name}
                  </Text>
                  <Text style={{ color: COLORS.mutedForeground, marginTop: 4 }}>
                    {r.condition}
                  </Text>
                </View>
                <Feather
                  name="arrow-right"
                  size={24}
                  color={COLORS.mutedForeground}
                  style={{ marginHorizontal: 16 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: COLORS.primary,
                    }}
                  >
                    {r.recommendation_title}
                  </Text>
                  {r.recommendation_body && (
                    <Text
                      style={{ color: COLORS.mutedForeground, marginTop: 4 }}
                    >
                      {r.recommendation_body}
                    </Text>
                  )}
                </View>
              </View>
            ))}
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

  const renderContent = () => {
    switch (activeTab) {
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
          </View>

          {renderContent()}
        </View>
      </SafeAreaView>
    </View>
  );
}
