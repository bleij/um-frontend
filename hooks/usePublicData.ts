/**
 * usePublicData — hooks for the parent/youth-facing course catalog.
 *
 * These queries hit org_courses joined with organizations without requiring
 * an authenticated session (public-read RLS policy on both tables).
 * Run COURSES_MIGRATION.sql first to enable those policies.
 */
import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { OrgCourse, OrgGroup } from "./useOrgData";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PublicCourse extends OrgCourse {
  /** Organisation display name, resolved from the join */
  org_name: string;
}

// Gradient palette indexed by position so cards look varied but consistent
const GRADIENTS: [string, string][] = [
  ["#6C5CE7", "#8B7FE8"],
  ["#00B4DB", "#0083B0"],
  ["#11998e", "#38ef7d"],
  ["#f7971e", "#ffd200"],
  ["#f953c6", "#b91d73"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
];

export function courseGradient(index: number): [string, string] {
  return GRADIENTS[index % GRADIENTS.length];
}

// Maps talent-score dimensions → skills stored in org_courses.skills[]
export const SCORE_TO_SKILLS: Record<string, string[]> = {
  logical:   ["Логика", "Код", "Математика", "Крит. мышление"],
  creative:  ["Креативность", "Дизайн"],
  social:    ["Команда", "Коммуникация", "Лидерство"],
  physical:  ["Команда"],
  linguistic:["Языки", "Коммуникация"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function mapRow(row: any): PublicCourse {
  return {
    ...row,
    org_name: row.organizations?.name ?? "",
    // Remove the nested object Supabase injects from the join
    organizations: undefined,
  };
}

// ── usePublicCourses ──────────────────────────────────────────────────────────

export function usePublicCourses() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setCourses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await supabase
      .from("org_courses")
      .select("*, organizations(name)")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (res.error || !res.data) {
      setCourses([]);
      setLoading(false);
      return;
    }
    setCourses((res.data as any[]).map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { courses, loading, refresh };
}

// ── usePublicCourseById ───────────────────────────────────────────────────────

export function usePublicCourseById(id: string | undefined) {
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [groups, setGroups] = useState<OrgGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured || !id) {
      setLoading(false);
      return;
    }

    Promise.all([
      supabase
        .from("org_courses")
        .select("*, organizations(name)")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("org_groups")
        .select("*")
        .eq("course_id", id)
        .eq("active", true),
    ]).then(([courseRes, groupsRes]) => {
      setCourse(courseRes.data ? mapRow(courseRes.data) : null);
      setGroups((groupsRes.data ?? []) as OrgGroup[]);
      setLoading(false);
    });
  }, [id]);

  return { course, groups, loading };
}

// ── applyToCourse ─────────────────────────────────────────────────────────────

export async function applyToCourse(params: {
  orgId: string;
  courseTitle: string;
  childName: string;
  childAge?: number | null;
  parentName?: string;
}): Promise<{ error: string | null }> {
  if (!supabase || !isSupabaseConfigured) return { error: "Not configured" };
  const res = await supabase.from("org_applications").insert({
    org_id: params.orgId,
    club: params.courseTitle,
    child_name: params.childName,
    child_age: params.childAge ?? null,
    parent_name: params.parentName ?? null,
    applied_date: new Date().toISOString().split("T")[0],
    status: "awaiting_payment",
  });
  return { error: res.error?.message ?? null };
}
