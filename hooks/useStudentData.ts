import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export interface StudentTask {
  id: string;
  student_user_id: string;
  title: string;
  club: string | null;
  xp_reward: number;
  done: boolean;
  created_at: string;
}

function ok<T = any>(res: { data: any; error: any }): T[] {
  if (res.error || !res.data) return [];
  return res.data as T[];
}

export function useStudentTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await supabase
      .from("student_tasks")
      .select("*")
      .eq("student_user_id", user.id)
      .order("created_at", { ascending: true });
    setTasks(ok<StudentTask>(res));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleTask = async (id: string) => {
    if (!supabase) return;
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await supabase
      .from("student_tasks")
      .update({ done: !task.done })
      .eq("id", id);
    refresh();
  };

  return { tasks, loading, refresh, toggleTask };
}
