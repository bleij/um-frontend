import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface MentorApplication {
  id: number;
  name: string;
  specialization: string;
  documents: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  photo: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  rating: number;
  sessions: number;
  bio: string;
}

const mentorApplications: MentorApplication[] = [
  {
    id: 1, name: "Асель Нурбекова", specialization: "Детский психолог", documents: "certificate.pdf", date: "2026-04-05", status: "pending", photo: "👩‍🏫", email: "asel.nurbekova@example.com", phone: "+7 (777) 123-4567", experience: "8 лет", education: "КазНУ им. аль-Фараби", rating: 4.9, sessions: 127, bio: "Помогаю детям раскрыть потенциал и найти свой путь."
  },
  {
    id: 2, name: "Дмитрий Иванов", specialization: "Карьерный консультант", documents: "certificate.pdf", date: "2026-04-07", status: "pending", photo: "👨‍💼", email: "dmitry.ivanov@example.com", phone: "+7 (701) 234-5678", experience: "5 лет", education: "МГУ, Психология", rating: 4.7, sessions: 89, bio: "Помогаю подросткам определиться с выбором профессии и построить карьерный путь."
  },
];

interface FamilyAccount {
  id: number;
  parentName: string;
  children: number;
  plan: "Basic" | "Pro";
  spent: string;
  status: "Active" | "Inactive";
}

const mockFamilies: FamilyAccount[] = [
  { id: 1, parentName: "Сергей Смирнов", children: 2, plan: "Pro", spent: "150,000 ₸", status: "Active" },
  { id: 2, parentName: "Елена Попова", children: 1, plan: "Basic", spent: "10,000 ₸", status: "Inactive" },
  { id: 3, parentName: "Руслан Ким", children: 3, plan: "Pro", spent: "320,000 ₸", status: "Active" },
];

function useFamilies(): { families: FamilyAccount[]; loading: boolean } {
  const [families, setFamilies] = useState<FamilyAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!supabase || !isSupabaseConfigured) {
        if (!cancelled) {
          setFamilies(mockFamilies);
          setLoading(false);
        }
        return;
      }

      const [parentsRes, tariffsRes, childrenRes] = await Promise.all([
        supabase
          .from("um_user_profiles")
          .select("id, first_name, last_name")
          .eq("role", "parent"),
        supabase.from("parent_profiles").select("user_id, tariff"),
        supabase.from("child_profiles").select("parent_id"),
      ]);

      if (cancelled) return;

      const parents = parentsRes.data ?? [];
      const tariffByUserId = new Map<string, string>(
        (tariffsRes.data ?? []).map((t: any) => [t.user_id, t.tariff]),
      );
      const childCountByParentId = new Map<string, number>();
      for (const c of childrenRes.data ?? []) {
        const pid = (c as any).parent_id;
        childCountByParentId.set(pid, (childCountByParentId.get(pid) ?? 0) + 1);
      }

      setFamilies(
        parents.map((p: any, idx: number) => ({
          id: idx + 1,
          parentName: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "—",
          children: childCountByParentId.get(p.id) ?? 0,
          plan: tariffByUserId.get(p.id) === "pro" ? "Pro" : "Basic",
          spent: "—",
          status: "Active",
        })),
      );
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { families, loading };
}

interface OrgAccount {
  id: number;
  name: string;
  category: string;
  status: "Verified" | "Pending" | "Rejected";
  rating: number;
  activeStudents: number;
}

const mockOrgs: OrgAccount[] = [
  { id: 1, name: "Клуб Робототехники Alpha", category: "Технологии", status: "Verified", rating: 4.8, activeStudents: 120 },
  { id: 2, name: "Школа Шахмат 'Белая Ладья'", category: "Интеллект", status: "Pending", rating: 0, activeStudents: 0 },
  { id: 3, name: "Академия Художеств", category: "Творчество", status: "Verified", rating: 4.9, activeStudents: 85 },
];

export default function AdminHome() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const isTablet = width >= 768;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const { families, loading: familiesLoading } = useFamilies();
  const [selectedMentor, setSelectedMentor] = useState<MentorApplication | null>(mentorApplications[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("crm");
  const [crmSubTab, setCrmSubTab] = useState("mentors");
  const [contentSubTab, setContentSubTab] = useState("tests");
  const [billingSubTab, setBillingSubTab] = useState("transactions");
  const [qcSubTab, setQcSubTab] = useState("logs");

  const mockTransactions = [
    { id: "TRX-1029", user: "Сергей Смирнов", amount: 30000, org: "Клуб Робототехники Alpha", orgAmount: 25500, platformAmount: 4500, status: "completed", date: "Сегодня, 14:30" },
    { id: "TRX-1028", user: "Руслан Ким", amount: 30000, org: "Академия Художеств", orgAmount: 25500, platformAmount: 4500, status: "completed", date: "Сегодня, 10:15" },
  ];

  const mockTickets = [
    { id: "TIC-842", type: "Жалоба", user: "Елена Попова", target: "Школа Шахмат 'Белая Ладья'", status: "Open", text: "Преподаватель опоздал на 20 минут." },
    { id: "TIC-841", type: "Отзыв", user: "Асель Нурбекова (Ментор)", target: "Максим (Подопечный)", status: "Resolved", text: "Прогресс отличный, но нужно больше практики." },
  ];

  const stats = [
    { label: "Ожидают проверки", value: "4", icon: "file-text", color: "#CA8A04", bg: "#FEF9C3" },
    { label: "Всего менторов", value: "127", icon: "users", color: COLORS.primary, bg: COLORS.primary + "15" },
    { label: "Активных сессий", value: "89", icon: "clock", color: "#16A34A", bg: "#DCFCE7" },
    { label: "Доход", value: "₸2.4М", icon: "dollar-sign", color: "#2563EB", bg: "#DBEAFE" },
  ];

  const NAV_ITEMS = [
    { id: "crm", label: "Пользователи & CRM", icon: "users", badge: 4 },
    { id: "content", label: "ИИ & Контент", icon: "cpu" },
    { id: "billing", label: "Биллинг", icon: "dollar-sign" },
    { id: "orgs", label: "Организации", icon: "briefcase" },
    { id: "qc", label: "Контроль качества", icon: "shield" },
  ];

  const renderCRMView = () => (
      <View style={{ flex: 1 }}>
         {/* Header Stats */}
         <View style={{ padding: paddingX, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.lg }}>
               <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 4 }}>Управление пользователями</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>Модерация заявок и контроль доступа</Text>
               </View>
            </View>

            {/* Grid */}
            <View style={{ flexDirection: isTablet ? "row" : "column", gap: SPACING.md, marginBottom: SPACING.lg }}>
               {stats.map((st, i) => (
                  <View key={i} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: SPACING.md, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border }}>
                     <View style={{ width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: st.bg, alignItems: "center", justifyContent: "center" }}>
                        <Feather name={st.icon as any} size={20} color={st.color} />
                     </View>
                     <View>
                        <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>{st.value}</Text>
                        <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground }}>{st.label}</Text>
                     </View>
                  </View>
               ))}
            </View>

            {/* Search */}
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border }}>
               <Feather name="search" size={18} color={COLORS.mutedForeground} />
               <TextInput
                  style={{ flex: 1, padding: SPACING.md, fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground }}
                  placeholder="Поиск менторов..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
               />
            </View>
         </View>

         {/* Sub-navigation within CRM */}
         <View style={{ flexDirection: "row", gap: SPACING.md, paddingHorizontal: paddingX, marginBottom: SPACING.md }}>
            <TouchableOpacity onPress={() => setCrmSubTab("mentors")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: crmSubTab === "mentors" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: crmSubTab === "mentors" ? "white" : COLORS.foreground, fontWeight: "600" }}>Менторы (Заявки)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCrmSubTab("users")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: crmSubTab === "users" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: crmSubTab === "users" ? "white" : COLORS.foreground, fontWeight: "600" }}>Семьи (Родители/Дети)</Text>
            </TouchableOpacity>
         </View>

         <View style={{ flex: 1, flexDirection: isTablet ? "row" : "column" }}>
            {/* Table List */}
            <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
               {crmSubTab === "mentors" && mentorApplications.map(m => (
                  <TouchableOpacity 
                     key={m.id}
                     onPress={() => setSelectedMentor(m)}
                     style={{
                        padding: SPACING.lg,
                        borderBottomWidth: 1,
                        borderColor: COLORS.border,
                        backgroundColor: selectedMentor?.id === m.id ? COLORS.primary + "05" : COLORS.surface,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: SPACING.md
                     }}
                  >
                     <View style={{ width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 24 }}>{m.photo}</Text>
                     </View>
                     <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{m.name}</Text>
                        <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>{m.specialization}</Text>
                     </View>
                     <View style={{ backgroundColor: "#FEF9C3", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full }}>
                        <Text style={{ fontSize: 10, fontWeight: "bold", color: "#854D0E", textTransform: "uppercase" }}>В ожидании</Text>
                     </View>
                  </TouchableOpacity>
               ))}

               {crmSubTab === "users" && familiesLoading && (
                  <View style={{ padding: SPACING.lg }}>
                     <Text style={{ color: COLORS.mutedForeground }}>Загрузка...</Text>
                  </View>
               )}
               {crmSubTab === "users" && !familiesLoading && families.length === 0 && (
                  <View style={{ padding: SPACING.lg }}>
                     <Text style={{ color: COLORS.mutedForeground }}>Пока нет зарегистрированных родителей.</Text>
                  </View>
               )}
               {crmSubTab === "users" && !familiesLoading && families.map(f => (
                  <View 
                     key={f.id}
                     style={{
                        padding: SPACING.lg,
                        borderBottomWidth: 1,
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.surface,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: SPACING.md
                     }}
                  >
                     <View style={{ width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.muted, alignItems: "center", justifyContent: "center" }}>
                        <Feather name="users" size={24} color={COLORS.mutedForeground} />
                     </View>
                     <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{f.parentName}</Text>
                        <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>Детей: {f.children} • Всего потрачено: {f.spent}</Text>
                     </View>
                     <View style={{ backgroundColor: f.plan === 'Pro' ? COLORS.primary + "20" : COLORS.muted, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full }}>
                        <Text style={{ fontSize: 10, fontWeight: "bold", color: f.plan === 'Pro' ? COLORS.primary : COLORS.mutedForeground, textTransform: "uppercase" }}>{f.plan}</Text>
                     </View>
                  </View>
               ))}
            </ScrollView>

            {/* Right Panel Details (if any selected) */}
            {crmSubTab === "mentors" && selectedMentor && (
              <View style={{ width: isTablet ? 320 : '100%', backgroundColor: COLORS.surface, borderLeftWidth: 1, borderColor: COLORS.border, padding: SPACING.xl }}>
                 <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: "center", marginBottom: SPACING.xl }}>
                       <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center", marginBottom: SPACING.sm }}>
                          <Text style={{ fontSize: 40 }}>{selectedMentor.photo}</Text>
                       </View>
                       <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>{selectedMentor.name}</Text>
                       <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>{selectedMentor.specialization}</Text>
                    </View>
                    
                    <View style={{ gap: SPACING.md, marginBottom: SPACING.xl }}>
                       <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm, backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: RADIUS.md }}>
                          <Feather name="mail" size={16} color={COLORS.primary} />
                          <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground }}>{selectedMentor.email}</Text>
                       </View>
                       <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm, backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: RADIUS.md }}>
                          <Feather name="phone" size={16} color={COLORS.primary} />
                          <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground }}>{selectedMentor.phone}</Text>
                       </View>
                       <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm, backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: RADIUS.md }}>
                          <Feather name="award" size={16} color={COLORS.primary} />
                          <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground }}>{selectedMentor.experience}</Text>
                       </View>
                    </View>

                    <Text style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: SPACING.xs }}>О себе</Text>
                    <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, lineHeight: 20, marginBottom: SPACING.xl }}>{selectedMentor.bio}</Text>

                    <View style={{ gap: SPACING.sm }}>
                       <TouchableOpacity style={{ backgroundColor: COLORS.success, padding: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", ...SHADOWS.sm }}>
                          <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold }}>Одобрить</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={{ backgroundColor: COLORS.destructive, padding: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center" }}>
                          <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold }}>Отклонить</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={{ backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", borderWidth: 1, borderColor: COLORS.primary }}>
                          <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.bold }}>На доработку (комментарий)</Text>
                       </TouchableOpacity>
                    </View>
                 </ScrollView>
              </View>
            )}
         </View>
      </View>
  );

  const renderOrgsView = () => (
      <View style={{ flex: 1 }}>
         <View style={{ padding: paddingX, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.lg }}>
               <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 4 }}>Управление Организациями</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>Модерация учебных центров и секций</Text>
               </View>
            </View>
         </View>

         <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {mockOrgs.map(org => (
               <View 
                  key={org.id}
                  style={{
                     padding: SPACING.lg,
                     borderBottomWidth: 1,
                     borderColor: COLORS.border,
                     backgroundColor: COLORS.surface,
                     flexDirection: "row",
                     alignItems: "center",
                     gap: SPACING.md
                  }}
               >
                  <View style={{ width: 48, height: 48, borderRadius: RADIUS.lg, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center" }}>
                     <Feather name="briefcase" size={24} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                     <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{org.name}</Text>
                     <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>Категория: {org.category} • Учеников: {org.activeStudents}</Text>
                  </View>
                  
                  {org.status === 'Pending' ? (
                     <View style={{ flexDirection: "row", gap: SPACING.sm }}>
                        <TouchableOpacity style={{ backgroundColor: COLORS.success, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md }}>
                           <Text style={{ color: "white", fontSize: TYPOGRAPHY.size.xs, fontWeight: "bold" }}>Верифицировать</Text>
                        </TouchableOpacity>
                     </View>
                  ) : (
                     <View style={{ backgroundColor: COLORS.success + "20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full }}>
                        <Text style={{ fontSize: 10, fontWeight: "bold", color: COLORS.success, textTransform: "uppercase" }}>Проверено</Text>
                     </View>
                  )}
               </View>
            ))}
         </ScrollView>
      </View>
  );

  const renderContentView = () => (
      <View style={{ flex: 1 }}>
         <View style={{ padding: paddingX, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md }}>
               <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 4 }}>ИИ & Контент</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>Конструктор тестирования и настройка ИИ</Text>
               </View>
            </View>
         </View>

         {/* Sub-navigation within Content */}
         <View style={{ flexDirection: "row", gap: SPACING.md, paddingHorizontal: paddingX, marginVertical: SPACING.md }}>
            <TouchableOpacity onPress={() => setContentSubTab("tests")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: contentSubTab === "tests" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: contentSubTab === "tests" ? "white" : COLORS.foreground, fontWeight: "600" }}>Вопросы (Тест)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setContentSubTab("tags")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: contentSubTab === "tags" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: contentSubTab === "tags" ? "white" : COLORS.foreground, fontWeight: "600" }}>Справочник Тегов</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setContentSubTab("logic")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: contentSubTab === "logic" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: contentSubTab === "logic" ? "white" : COLORS.foreground, fontWeight: "600" }}>AI Логика</Text>
            </TouchableOpacity>
         </View>

         <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {contentSubTab === "tests" && (
                <View style={{ paddingHorizontal: paddingX }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-start', padding: SPACING.md, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, marginBottom: SPACING.md }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Добавить вопрос</Text>
                    </TouchableOpacity>
                    {[
                        { id: 1, q: "Тебе нравится разбирать игрушки, чтобы узнать, как они работают?", tag: "#логика" },
                        { id: 2, q: "Часто ли ты рисуешь на полях тетради?", tag: "#арт" },
                        { id: 3, q: "Трудно ли тебе усидеть на месте больше 20 минут?", tag: "#спорт" },
                    ].map(test => (
                        <View key={test.id} style={{ padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: '500', color: COLORS.foreground }}>{test.q}</Text>
                                <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.primary, marginTop: 4 }}>Привязка: {test.tag}</Text>
                            </View>
                            <Feather name="edit-2" size={18} color={COLORS.mutedForeground} style={{ marginHorizontal: 10 }} />
                            <Feather name="trash-2" size={18} color={COLORS.destructive} />
                        </View>
                    ))}
                </View>
            )}

            {contentSubTab === "tags" && (
                <View style={{ padding: paddingX, flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
                    {['#коммуникация', '#лидерство', '#логика', '#робототехника', '#спорт', '#арт', '#музыка'].map(tag => (
                        <View key={tag} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.primary + "15", borderWidth: 1, borderColor: COLORS.primary + "30" }}>
                            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{tag}</Text>
                        </View>
                    ))}
                    <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.muted, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed' }}>
                        <Text style={{ color: COLORS.foreground, fontWeight: 'bold' }}>+ Добавить тег</Text>
                    </TouchableOpacity>
                </View>
            )}

            {contentSubTab === "logic" && (
                <View style={{ paddingHorizontal: paddingX }}>
                    <View style={{ padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: COLORS.foreground }}>Правило: Инженерный потенциал</Text>
                            <Text style={{ color: COLORS.mutedForeground, marginTop: 4 }}>[Ответ: Да] на Вопрос #1 AND [Тег: #логика {">"} 50%]</Text>
                        </View>
                        <Feather name="arrow-right" size={24} color={COLORS.mutedForeground} style={{ marginHorizontal: 16 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: COLORS.primary }}>Рекомендовать категорию</Text>
                            <Text style={{ color: COLORS.mutedForeground, marginTop: 4 }}>Робототехника / Программирование</Text>
                        </View>
                    </View>
                </View>
            )}
         </ScrollView>
      </View>
  );

  const renderBillingView = () => (
      <View style={{ flex: 1 }}>
         <View style={{ padding: paddingX, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md }}>
               <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 4 }}>Финансы & Биллинг</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>Мониторинг транзакций и сплит-платежей</Text>
               </View>
            </View>

            <View style={{ flexDirection: isTablet ? "row" : "column", gap: SPACING.md, paddingBottom: SPACING.lg }}>
               <View style={{ flex: 1, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.primary + "10", borderWidth: 1, borderColor: COLORS.primary + "30" }}>
                   <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>Общий оборот (GMV)</Text>
                   <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: 'bold', color: COLORS.foreground, marginTop: 8 }}>1,250,000 ₸</Text>
               </View>
               <View style={{ flex: 1, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.success + "10", borderWidth: 1, borderColor: COLORS.success + "30" }}>
                   <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>Доход платформы (15%)</Text>
                   <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: 'bold', color: COLORS.success, marginTop: 8 }}>187,500 ₸</Text>
               </View>
               <View style={{ flex: 1, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border }}>
                   <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>Платные подписчики (Pro)</Text>
                   <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: 'bold', color: COLORS.foreground, marginTop: 8 }}>145 / 450</Text>
               </View>
            </View>
         </View>

         <View style={{ flexDirection: "row", gap: SPACING.md, paddingHorizontal: paddingX, marginVertical: SPACING.md }}>
            <TouchableOpacity onPress={() => setBillingSubTab("transactions")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: billingSubTab === "transactions" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: billingSubTab === "transactions" ? "white" : COLORS.foreground, fontWeight: "600" }}>Сплит-Транзакции</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setBillingSubTab("fees")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: billingSubTab === "fees" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: billingSubTab === "fees" ? "white" : COLORS.foreground, fontWeight: "600" }}>Управление комиссией</Text>
            </TouchableOpacity>
         </View>

         <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {billingSubTab === "transactions" && mockTransactions.map(t => (
               <View key={t.id} style={{ padding: SPACING.lg, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center' }}>
                   <View style={{ width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.success + "15", alignItems: "center", justifyContent: "center" }}>
                      <Feather name="arrow-up-right" size={24} color={COLORS.success} />
                   </View>
                   <View style={{ flex: 1, marginLeft: SPACING.md }}>
                      <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: 'bold', color: COLORS.foreground }}>{t.user} → {t.org}</Text>
                      <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>{t.date} • {t.id}</Text>
                   </View>
                   <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: 'bold', color: COLORS.foreground }}>{t.amount} ₸</Text>
                      <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>
                         <Text style={{ color: COLORS.success }}>+{t.orgAmount} ₸ партнёру</Text> | <Text style={{ color: COLORS.primary }}>+{t.platformAmount} ₸ платформе</Text>
                      </Text>
                   </View>
               </View>
            ))}

            {billingSubTab === "fees" && mockOrgs.map(org => (
               <View key={org.id} style={{ padding: SPACING.lg, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center' }}>
                   <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: 'bold', color: COLORS.foreground }}>{org.name}</Text>
                      <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginTop: 2 }}>Категория: {org.category}</Text>
                   </View>
                   <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm }}>
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: 'bold', color: COLORS.foreground }}>Комиссия: </Text>
                      <TextInput defaultValue="15" keyboardType="numeric" style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: 'bold', color: COLORS.primary, width: 30, textAlign: 'center' }} />
                      <Text style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: 'bold', color: COLORS.foreground }}>%</Text>
                   </View>
               </View>
            ))}
         </ScrollView>
      </View>
  );

  const renderQCView = () => (
      <View style={{ flex: 1 }}>
         <View style={{ padding: paddingX, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md }}>
               <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, marginBottom: 4 }}>Контроль Качества</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground }}>Логи активности и система жалоб</Text>
               </View>
            </View>
         </View>

         <View style={{ flexDirection: "row", gap: SPACING.md, paddingHorizontal: paddingX, marginVertical: SPACING.md }}>
            <TouchableOpacity onPress={() => setQcSubTab("logs")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: qcSubTab === "logs" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: qcSubTab === "logs" ? "white" : COLORS.foreground, fontWeight: "600" }}>Лог фидбеков</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setQcSubTab("tickets")} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: qcSubTab === "tickets" ? COLORS.primary : COLORS.muted, borderRadius: RADIUS.full }}>
               <Text style={{ color: qcSubTab === "tickets" ? "white" : COLORS.foreground, fontWeight: "600" }}>Тикеты и Жалобы</Text>
            </TouchableOpacity>
         </View>

         <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {mockTickets.filter(t => qcSubTab === "tickets" ? t.type === "Жалоба" : true).map(tick => (
               <View key={tick.id} style={{ padding: SPACING.lg, borderRadius: RADIUS.lg, marginHorizontal: paddingX, marginBottom: SPACING.md, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: tick.type === "Жалоба" ? COLORS.destructive + "30" : COLORS.border }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                     <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                        <View style={{ backgroundColor: tick.type === "Жалоба" ? COLORS.destructive + "15" : COLORS.primary + "15", paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm }}>
                           <Text style={{ color: tick.type === "Жалоба" ? COLORS.destructive : COLORS.primary, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>{tick.type}</Text>
                        </View>
                        <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground }}>{tick.id}</Text>
                     </View>
                     <View style={{ backgroundColor: tick.status === "Open" ? "#FEF9C3" : COLORS.success + "20", paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full }}>
                        <Text style={{ color: tick.status === "Open" ? "#854D0E" : COLORS.success, fontSize: 10, fontWeight: 'bold' }}>{tick.status === "Open" ? "Открыт" : "Решен"}</Text>
                     </View>
                  </View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: 'bold', color: COLORS.foreground, marginBottom: 4 }}>От: {tick.user}</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground, marginBottom: SPACING.md }}>Цель: {tick.target}</Text>
                  <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.foreground, lineHeight: 20 }}>{tick.text}</Text>
                  
                  {tick.status === "Open" && (
                     <TouchableOpacity style={{ alignSelf: 'flex-start', marginTop: SPACING.md, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, backgroundColor: COLORS.primary, borderRadius: RADIUS.md }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: TYPOGRAPHY.size.sm }}>Взять в работу</Text>
                     </TouchableOpacity>
                  )}
               </View>
            ))}
         </ScrollView>
      </View>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'crm':
        return renderCRMView();
      case 'orgs':
        return renderOrgsView();
      case 'content':
        return renderContentView();
      case 'billing':
        return renderBillingView();
      case 'qc':
        return renderQCView();
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Desktop Admin layout vs Mobile layout */}
        <View style={{ flex: 1, flexDirection: isTablet ? "row" : "column" }}>
          
          {/* Sidebar / Top Nav */}
          <View style={{ 
              width: isTablet ? 260 : '100%', 
              backgroundColor: COLORS.surface, 
              borderRightWidth: isTablet ? 1 : 0, 
              borderBottomWidth: isTablet ? 0 : 1, 
              borderColor: COLORS.border,
              padding: SPACING.lg
          }}>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: SPACING.xl }}>
               <LinearGradient colors={COLORS.gradients.primary as any} style={{ width: 48, height: 48, borderRadius: RADIUS.lg, alignItems: "center", justifyContent: "center" }}>
                 <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>UM</Text>
               </LinearGradient>
               <View>
                 <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>UM Admin</Text>
                 <Text style={{ fontSize: TYPOGRAPHY.size.xs, color: COLORS.mutedForeground }}>Панель управления</Text>
               </View>
             </View>

             <View style={{ gap: SPACING.sm, flex: isTablet ? 1 : undefined, flexDirection: isTablet ? "column" : "row" }}>
               {NAV_ITEMS.map(tab => (
                 <TouchableOpacity 
                   key={tab.id}
                   onPress={() => setActiveTab(tab.id)}
                   style={{
                     flexDirection: "row", alignItems: "center", gap: 12, padding: SPACING.md, borderRadius: RADIUS.lg,
                     backgroundColor: activeTab === tab.id ? COLORS.primary : 'transparent',
                     flex: isTablet ? undefined : 1, justifyContent: isTablet ? "flex-start" : "center"
                   }}
                 >
                   <Feather name={tab.icon as any} size={18} color={activeTab === tab.id ? 'white' : COLORS.mutedForeground} />
                   {isTablet && <Text style={{ flex: 1, fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium, color: activeTab === tab.id ? 'white' : COLORS.mutedForeground }}>{tab.label}</Text>}
                   {isTablet && tab.badge && (
                       <View style={{ backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.md }}>
                          <Text style={{ color: 'white', fontSize: 10, fontWeight: "bold" }}>{tab.badge}</Text>
                       </View>
                   )}
                 </TouchableOpacity>
               ))}
             </View>
          </View>

          {/* Main Content Area */}
          {renderContent()}

        </View>
      </SafeAreaView>
    </View>
  );
}
