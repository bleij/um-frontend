import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export interface Chat {
  id: string;
  name: string;
  icon_name: string;
  last_message: string | null;
  last_message_at: string;
  unread_count: number;
  archived: boolean;
}

function ok<T = any>(res: { data: any; error: any }): T[] {
  if (res.error || !res.data) return [];
  return res.data as T[];
}

export function useChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setChats([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Fetch all conversations (RLS is permissive in dev; in prod participants join)
    const convRes = await supabase
      .from("conversations")
      .select("id, name, icon_name, last_message, last_message_at, archived")
      .order("last_message_at", { ascending: false });
    const convRows = ok<any>(convRes);

    // Fetch unread counts for current user if available
    const unreadMap = new Map<string, number>();
    if (user?.id) {
      const partRes = await supabase
        .from("conversation_participants")
        .select("conversation_id, unread_count")
        .eq("user_id", user.id);
      for (const row of ok<any>(partRes)) {
        unreadMap.set(row.conversation_id, row.unread_count ?? 0);
      }
    }

    setChats(
      convRows.map((c: any) => ({
        id: c.id,
        name: c.name,
        icon_name: c.icon_name ?? "message-circle",
        last_message: c.last_message,
        last_message_at: c.last_message_at,
        unread_count: unreadMap.get(c.id) ?? 0,
        archived: c.archived ?? false,
      }))
    );
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const archiveChat = async (id: string) => {
    if (!supabase) return;
    await supabase.from("conversations").update({ archived: true }).eq("id", id);
    refresh();
  };

  const markRead = async (id: string) => {
    if (!supabase || !user?.id) return;
    await supabase
      .from("conversation_participants")
      .update({ unread_count: 0 })
      .eq("conversation_id", id)
      .eq("user_id", user.id);
    refresh();
  };

  return { chats, loading, refresh, archiveChat, markRead };
}
