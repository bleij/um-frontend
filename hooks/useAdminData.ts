import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export interface AdminFamily {
  id: string;
  parentName: string;
  children: number;
  plan: "Basic" | "Pro";
  status: "Active" | "Inactive";
}

export interface MentorApp {
  id: string;
  name: string;
  specialization: string | null;
  email: string | null;
  phone: string | null;
  experience: string | null;
  education: string | null;
  bio: string | null;
  photo_emoji: string;
  status: "pending" | "approved" | "rejected";
  rating: number;
  sessions: number;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  category: string | null;
  status: "pending" | "verified" | "rejected";
  rating: number;
  active_students: number;
  commission_pct: number;
}

export interface Transaction {
  id: string;
  external_ref: string | null;
  parent_name: string;
  org_name: string;
  amount: number;
  org_amount: number;
  platform_amount: number;
  status: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  kind: "complaint" | "feedback";
  reporter_name: string;
  target: string | null;
  body: string;
  status: "open" | "in_progress" | "resolved";
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface AIRule {
  id: string;
  name: string;
  condition: string;
  recommendation_title: string;
  recommendation_body: string | null;
  enabled: boolean;
}

export interface TestQuestion {
  id: string;
  question: string;
  tag_id: string | null;
  order: number;
}

export interface AdminStats {
  pendingMentors: number;
  totalMentors: number;
  activeSessions: number;
  revenue: number;
  gmv: number;
  proSubscribers: number;
  totalSubscribers: number;
}

function ok<T = any>(res: { data: any; error: any }): T[] {
  if (res.error || !res.data) return [];
  return res.data as T[];
}

export function useFamilies() {
  const [data, setData] = useState<AdminFamily[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const [parents, tariffs, children] = await Promise.all([
      supabase.from("um_user_profiles").select("id, first_name, last_name").eq("role", "parent"),
      supabase.from("parent_profiles").select("user_id, tariff"),
      supabase.from("child_profiles").select("parent_user_id"),
    ]);
    const tariffMap = new Map<string, string>(
      ok<any>(tariffs).map((t) => [t.user_id, t.tariff]),
    );
    const childCount = new Map<string, number>();
    for (const c of ok<any>(children)) {
      childCount.set(c.parent_user_id, (childCount.get(c.parent_user_id) ?? 0) + 1);
    }
    setData(
      ok<any>(parents).map((p) => ({
        id: p.id,
        parentName: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "—",
        children: childCount.get(p.id) ?? 0,
        plan: tariffMap.get(p.id) === "pro" ? "Pro" : "Basic",
        status: "Active" as const,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { data, loading, refresh };
}

export function useMentorApps() {
  const [data, setData] = useState<MentorApp[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const res = await supabase
      .from("mentor_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setData(ok<MentorApp>(res));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const approve = async (id: string) => {
    if (!supabase) return;
    await supabase.from("mentor_applications").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", id);
    refresh();
  };
  const reject = async (id: string, reason?: string) => {
    if (!supabase) return;
    await supabase.from("mentor_applications").update({ status: "rejected", rejection_reason: reason ?? null, reviewed_at: new Date().toISOString() }).eq("id", id);
    refresh();
  };

  return { data, loading, refresh, approve, reject };
}

export function useOrganizations() {
  const [data, setData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const res = await supabase.from("organizations").select("*").order("created_at", { ascending: false });
    setData(ok<Organization>(res));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const verify = async (id: string) => {
    if (!supabase) return;
    await supabase.from("organizations").update({ status: "verified" }).eq("id", id);
    refresh();
  };
  const reject = async (id: string) => {
    if (!supabase) return;
    await supabase.from("organizations").update({ status: "rejected" }).eq("id", id);
    refresh();
  };
  const setCommission = async (id: string, pct: number) => {
    if (!supabase) return;
    await supabase.from("organizations").update({ commission_pct: pct }).eq("id", id);
    refresh();
  };

  return { data, loading, refresh, verify, reject, setCommission };
}

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const [txRes, parentsRes, orgsRes] = await Promise.all([
      supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("um_user_profiles").select("id, first_name, last_name"),
      supabase.from("organizations").select("id, name"),
    ]);
    const parentMap = new Map<string, string>(
      ok<any>(parentsRes).map((p) => [p.id, `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "—"]),
    );
    const orgMap = new Map<string, string>(ok<any>(orgsRes).map((o) => [o.id, o.name]));
    setData(
      ok<any>(txRes).map((t) => ({
        id: t.id,
        external_ref: t.external_ref,
        parent_name: parentMap.get(t.parent_user_id) ?? "—",
        org_name: orgMap.get(t.org_id) ?? "—",
        amount: Number(t.amount),
        org_amount: Number(t.org_amount),
        platform_amount: Number(t.platform_amount),
        status: t.status,
        created_at: t.created_at,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { data, loading, refresh };
}

export function useTickets() {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const [ticketRes, usersRes] = await Promise.all([
      supabase.from("tickets").select("*").order("created_at", { ascending: false }),
      supabase.from("um_user_profiles").select("id, first_name, last_name"),
    ]);
    const userMap = new Map<string, string>(
      ok<any>(usersRes).map((u) => [u.id, `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "—"]),
    );
    setData(
      ok<any>(ticketRes).map((t) => ({
        id: t.id,
        kind: t.kind,
        reporter_name: userMap.get(t.reporter_user_id) ?? "Аноним",
        target: t.target,
        body: t.body,
        status: t.status,
        created_at: t.created_at,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const takeInProgress = async (id: string) => {
    if (!supabase) return;
    await supabase.from("tickets").update({ status: "in_progress" }).eq("id", id);
    refresh();
  };
  const resolve = async (id: string) => {
    if (!supabase) return;
    await supabase.from("tickets").update({ status: "resolved", resolved_at: new Date().toISOString() }).eq("id", id);
    refresh();
  };

  return { data, loading, refresh, takeInProgress, resolve };
}

export function useTags() {
  const [data, setData] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const res = await supabase.from("tags").select("*").order("name");
    setData(ok<Tag>(res));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async (name: string) => {
    if (!supabase) return;
    const cleaned = name.trim();
    if (!cleaned) return;
    await supabase.from("tags").insert({ name: cleaned.startsWith("#") ? cleaned : `#${cleaned}` });
    refresh();
  };
  const remove = async (id: string) => {
    if (!supabase) return;
    await supabase.from("tags").delete().eq("id", id);
    refresh();
  };

  return { data, loading, refresh, add, remove };
}

export function useAIRules() {
  const [data, setData] = useState<AIRule[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const res = await supabase.from("ai_rules").select("*").order("created_at");
    setData(ok<AIRule>(res));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { data, loading, refresh };
}

export function useTestQuestions() {
  const [data, setData] = useState<(TestQuestion & { tag?: string | null })[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const [qRes, tagRes] = await Promise.all([
      supabase.from("test_questions").select("*").order("order"),
      supabase.from("tags").select("id, name"),
    ]);
    const tagMap = new Map<string, string>(ok<any>(tagRes).map((t) => [t.id, t.name]));
    setData(
      ok<any>(qRes).map((q) => ({
        id: q.id,
        question: q.question,
        tag_id: q.tag_id,
        order: q.order,
        tag: q.tag_id ? tagMap.get(q.tag_id) ?? null : null,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const remove = async (id: string) => {
    if (!supabase) return;
    await supabase.from("test_questions").delete().eq("id", id);
    refresh();
  };

  return { data, loading, refresh, remove };
}

export function useAdminStats(
  mentorApps: MentorApp[],
  transactions: Transaction[],
  families: AdminFamily[],
): AdminStats {
  const pendingMentors = mentorApps.filter((m) => m.status === "pending").length;
  const totalMentors = mentorApps.filter((m) => m.status === "approved").length;
  const activeSessions = mentorApps.reduce((sum, m) => sum + (m.sessions ?? 0), 0);
  const completedTx = transactions.filter((t) => t.status === "completed");
  const gmv = completedTx.reduce((sum, t) => sum + t.amount, 0);
  const revenue = completedTx.reduce((sum, t) => sum + t.platform_amount, 0);
  const proSubscribers = families.filter((f) => f.plan === "Pro").length;
  return {
    pendingMentors,
    totalMentors,
    activeSessions,
    revenue,
    gmv,
    proSubscribers,
    totalSubscribers: families.length,
  };
}
