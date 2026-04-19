import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export interface OrgStaffMember {
  id: string;
  org_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  specialization: string | null;
  rating: number;
  status: "active" | "invited" | "inactive";
  created_at: string;
}

export interface OrgGroup {
  id: string;
  org_id: string;
  name: string;
  course: string | null;
  schedule: string | null;
  capacity: number;
  enrolled: number;
  active: boolean;
  created_at: string;
}

export interface OrgApplication {
  id: string;
  org_id: string;
  child_name: string;
  child_age: number | null;
  parent_name: string | null;
  club: string | null;
  applied_date: string | null;
  status: "paid" | "awaiting_payment" | "activated" | "completed" | "rejected";
  created_at: string;
}

export interface OrgTask {
  id: string;
  org_id: string;
  title: string;
  club: string | null;
  due_date: string | null;
  total_students: number;
  completed_students: number;
  xp_reward: number;
  created_at: string;
}

function ok<T = any>(res: { data: any; error: any }): T[] {
  if (res.error || !res.data) return [];
  return res.data as T[];
}

async function resolveOrgId(userId: string): Promise<string | null> {
  if (!supabase) return null;
  const res = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_user_id", userId)
    .limit(1)
    .single();
  return res.data?.id ?? null;
}

// ─── useOrgStaff ──────────────────────────────────────────────
export function useOrgStaff() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<OrgStaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !user?.id) {
      setStaff([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const orgId = await resolveOrgId(user.id);
    if (!orgId) {
      setStaff([]);
      setLoading(false);
      return;
    }
    const res = await supabase
      .from("org_staff")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: true });
    setStaff(ok<OrgStaffMember>(res));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { staff, loading, refresh };
}

// ─── useOrgGroups ─────────────────────────────────────────────
export function useOrgGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<OrgGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !user?.id) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const orgId = await resolveOrgId(user.id);
    if (!orgId) {
      setGroups([]);
      setLoading(false);
      return;
    }
    const res = await supabase
      .from("org_groups")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: true });
    setGroups(ok<OrgGroup>(res));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { groups, loading, refresh };
}

// ─── useOrgApplications ───────────────────────────────────────
export function useOrgApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState<OrgApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !user?.id) {
      setApps([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const orgId = await resolveOrgId(user.id);
    if (!orgId) {
      setApps([]);
      setLoading(false);
      return;
    }
    const res = await supabase
      .from("org_applications")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });
    setApps(ok<OrgApplication>(res));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const approve = async (id: string) => {
    if (!supabase) return;
    await supabase
      .from("org_applications")
      .update({ status: "activated" })
      .eq("id", id);
    refresh();
  };

  const reject = async (id: string) => {
    if (!supabase) return;
    await supabase
      .from("org_applications")
      .update({ status: "rejected" })
      .eq("id", id);
    refresh();
  };

  return { apps, loading, refresh, approve, reject };
}

// ─── useOrgTasks ──────────────────────────────────────────────
export function useOrgTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<OrgTask[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const orgId = await resolveOrgId(user.id);
    if (!orgId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    const res = await supabase
      .from("org_tasks")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });
    setTasks(ok<OrgTask>(res));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tasks, loading, refresh };
}

// ─── useOrgProfile ────────────────────────────────────────────
export function useOrgProfile() {
  const { user } = useAuth();
  const [orgName, setOrgName] = useState<string>("");
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured || !user?.id) { setLoading(false); return; }
    supabase
      .from("organizations")
      .select("id, name")
      .eq("owner_user_id", user.id)
      .limit(1)
      .maybeSingle()
      .then((res) => {
        setOrgName(res.data?.name ?? "");
        setOrgId(res.data?.id ?? null);
        setLoading(false);
      });
  }, [user?.id]);

  return { orgName, orgId, loading };
}

// ─── useOrgStats ──────────────────────────────────────────────
export interface OrgStats {
  groupCount: number;
  studentCount: number;
  pendingCount: number;
  staffCount: number;
}

export function useOrgStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OrgStats>({ groupCount: 0, studentCount: 0, pendingCount: 0, staffCount: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !user?.id) { setLoading(false); return; }
    setLoading(true);
    const orgId = await resolveOrgId(user.id);
    if (!orgId) { setLoading(false); return; }
    const [groups, apps, staff] = await Promise.all([
      supabase.from("org_groups").select("id", { count: "exact", head: true }).eq("org_id", orgId).eq("active", true),
      supabase.from("org_applications").select("id, status").eq("org_id", orgId),
      supabase.from("org_staff").select("id", { count: "exact", head: true }).eq("org_id", orgId).eq("status", "active"),
    ]);
    const allApps = ok<any>(apps);
    setStats({
      groupCount: groups.count ?? 0,
      studentCount: allApps.filter((a: any) => ["paid", "activated"].includes(a.status)).length,
      pendingCount: allApps.filter((a: any) => a.status === "awaiting_payment").length,
      staffCount: staff.count ?? 0,
    });
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  return { stats, loading, refresh };
}

// ─── useOrgGroupById ─────────────────────────────────────────
export function useOrgGroupById(id: string | undefined) {
  const [group, setGroup] = useState<OrgGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured || !id) { setLoading(false); return; }
    supabase.from("org_groups").select("*").eq("id", id).maybeSingle().then((res) => {
      setGroup(res.data ?? null);
      setLoading(false);
    });
  }, [id]);

  return { group, loading };
}

// ─── useOrgStaffById ─────────────────────────────────────────
export function useOrgStaffById(id: string | undefined) {
  const [member, setMember] = useState<OrgStaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured || !id) { setLoading(false); return; }
    supabase.from("org_staff").select("*").eq("id", id).maybeSingle().then((res) => {
      setMember(res.data ?? null);
      setLoading(false);
    });
  }, [id]);

  return { member, loading };
}

// ─── useOrgSchedule ───────────────────────────────────────────
export interface OrgScheduleItem {
  id: string;
  org_id: string;
  time_label: string;
  subject: string;
  group_name: string;
  teacher_name: string;
  room: string;
  color: string;
  day_of_week: number;
}

export function useOrgSchedule(dayOfWeek?: number) {
  const { user } = useAuth();
  const [items, setItems] = useState<OrgScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const orgId = await resolveOrgId(user.id);
    if (!orgId) {
      setItems([]);
      setLoading(false);
      return;
    }
    let q = supabase
      .from("org_schedule_items")
      .select("*")
      .eq("org_id", orgId)
      .order("time_label", { ascending: true });
    if (dayOfWeek !== undefined) q = q.eq("day_of_week", dayOfWeek);
    const res = await q;
    setItems(ok<OrgScheduleItem>(res));
    setLoading(false);
  }, [user?.id, dayOfWeek]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
}
