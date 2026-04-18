import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Child, Diagnostic } from "../models/types";
import { useAuth } from "./AuthContext";

type AgeGroup = "6-11" | "12-17" | "18-20";

interface ParentProfileData {
  firstName: string;
  lastName?: string;
  phone?: string;
}

interface ChildDraft {
  id: string;
  name: string;
  ageGroup: AgeGroup | null;
  phone?: string;
  qrToken?: string;
}

interface ParentDataContextType {
  parentProfile: ParentProfileData | null;
  childrenProfile: Child[];
  activeChildId: string | null;
  isLoading: boolean;
  setActiveChildId: (id: string | null) => void;
  addChild: (child: Child) => Promise<void>;
  saveParentProfile: (
    profile: ParentProfileData,
    draftChildren: ChildDraft[],
  ) => Promise<void>;
  updateChildDiagnostic: (
    childId: string,
    diagnostic: Diagnostic,
  ) => Promise<void>;
}

const ParentDataContext = createContext<ParentDataContextType | undefined>(
  undefined,
);

function getParentProfileKey(userId: string) {
  return `um_parent_profile_${userId}`;
}

function getChildrenKey(userId: string) {
  return `um_children_${userId}`;
}

function ageGroupToCategory(ageGroup: AgeGroup | null): Child["ageCategory"] {
  if (ageGroup === "6-11") return "child";
  if (ageGroup === "12-17") return "teen";
  if (ageGroup === "18-20") return "young-adult";
  return "child";
}

function ageGroupToAge(ageGroup: AgeGroup | null) {
  if (ageGroup === "6-11") return 9;
  if (ageGroup === "12-17") return 14;
  if (ageGroup === "18-20") return 19;
  return 10;
}

function normalizeChild(child: Child): Child {
  return {
    ...child,
    interests: Array.isArray(child.interests) ? child.interests : [],
    ageCategory: child.ageCategory || "child",
  };
}

export function ParentDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [parentProfile, setParentProfile] = useState<ParentProfileData | null>(
    null,
  );
  const [childrenProfile, setChildrenProfile] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadParentData = async () => {
      if (!user) {
        setParentProfile(null);
        setChildrenProfile([]);
        setActiveChildId(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const profileKey = getParentProfileKey(user.id);
      const childrenKey = getChildrenKey(user.id);

      let nextProfile: ParentProfileData | null = null;
      let nextChildren: Child[] = [];

      const [cachedProfileRaw, cachedChildrenRaw] = await Promise.all([
        AsyncStorage.getItem(profileKey),
        AsyncStorage.getItem(childrenKey),
      ]);

      if (cachedProfileRaw) {
        try {
          nextProfile = JSON.parse(cachedProfileRaw) as ParentProfileData;
        } catch {
          nextProfile = null;
        }
      }

      if (cachedChildrenRaw) {
        try {
          const parsed = JSON.parse(cachedChildrenRaw) as Child[];
          nextChildren = parsed.map(normalizeChild);
        } catch {
          nextChildren = [];
        }
      }

      if (supabase && isSupabaseConfigured) {
        const [remoteParentResponse, remoteChildrenResponse] =
          await Promise.all([
            supabase
              .from("parent_profiles")
              .select("first_name, last_name, phone")
              .eq("user_id", user.id)
              .maybeSingle(),
            supabase
              .from("child_profiles")
              .select("id, name, age, interests, age_category, talent_profile")
              .eq("parent_user_id", user.id)
              .order("created_at", { ascending: true }),
          ]);

        if (!remoteParentResponse.error && remoteParentResponse.data) {
          nextProfile = {
            firstName: remoteParentResponse.data.first_name || user.firstName,
            lastName: remoteParentResponse.data.last_name || user.lastName,
            phone: remoteParentResponse.data.phone || user.phone,
          };
        }

        if (!remoteChildrenResponse.error && remoteChildrenResponse.data) {
          nextChildren = remoteChildrenResponse.data.map((item: any) => {
            const parsedInterests =
              typeof item.interests === "string"
                ? item.interests
                    .split(",")
                    .map((value: string) => value.trim())
                    .filter(Boolean)
                : Array.isArray(item.interests)
                  ? item.interests
                  : [];

            return normalizeChild({
              id: String(item.id),
              parentId: user.id,
              name: item.name || "Ребенок",
              age: Number(item.age || 10),
              ageCategory: item.age_category || "child",
              interests: parsedInterests,
              talentProfile:
                item.talent_profile && typeof item.talent_profile === "object"
                  ? (item.talent_profile as Diagnostic)
                  : undefined,
            });
          });
        }
      }

      if (!nextProfile) {
        nextProfile = {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        };
      }

      setParentProfile(nextProfile);
      setChildrenProfile(nextChildren);
      setActiveChildId((current) => {
        if (current && nextChildren.some((child) => child.id === current)) {
          return current;
        }
        return nextChildren[0]?.id || null;
      });

      await Promise.all([
        AsyncStorage.setItem(profileKey, JSON.stringify(nextProfile)),
        AsyncStorage.setItem(childrenKey, JSON.stringify(nextChildren)),
      ]);

      setIsLoading(false);
    };

    loadParentData();
  }, [user]);

  const persistChildren = async (nextChildren: Child[]) => {
    if (!user) return;
    await AsyncStorage.setItem(
      getChildrenKey(user.id),
      JSON.stringify(nextChildren.map(normalizeChild)),
    );
  };

  const persistProfile = async (profile: ParentProfileData) => {
    if (!user) return;
    await AsyncStorage.setItem(
      getParentProfileKey(user.id),
      JSON.stringify(profile),
    );
  };

  const saveParentProfile = async (
    profile: ParentProfileData,
    draftChildren: ChildDraft[],
  ) => {
    if (!user) return;

    const normalizedProfile: ParentProfileData = {
      firstName: profile.firstName.trim() || user.firstName,
      lastName: profile.lastName?.trim() || user.lastName,
      phone: profile.phone?.trim() || user.phone,
    };

    const mappedChildren = draftChildren
      .filter((entry) => entry.name.trim() && entry.ageGroup)
      .map((entry) =>
        normalizeChild({
          id: entry.id,
          parentId: user.id,
          name: entry.name.trim(),
          age: ageGroupToAge(entry.ageGroup),
          ageCategory: ageGroupToCategory(entry.ageGroup),
          interests: [],
          phone: entry.phone?.trim() || undefined,
          qrToken: entry.qrToken || undefined,
        }),
      );

    setParentProfile(normalizedProfile);
    setChildrenProfile(mappedChildren);
    setActiveChildId(mappedChildren[0]?.id || null);

    await Promise.all([
      persistProfile(normalizedProfile),
      persistChildren(mappedChildren),
    ]);

    if (supabase && isSupabaseConfigured) {
      await supabase.from("parent_profiles").upsert(
        {
          user_id: user.id,
          first_name: normalizedProfile.firstName,
          last_name: normalizedProfile.lastName || null,
          phone: normalizedProfile.phone || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      for (const child of mappedChildren) {
        await supabase.from("child_profiles").upsert(
          {
            id: child.id,
            parent_user_id: user.id,
            name: child.name,
            age: child.age,
            age_category: child.ageCategory,
            interests: child.interests,
            talent_profile: child.talentProfile || null,
            phone: child.phone || null,
            qr_token: child.qrToken || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );
      }
    }
  };

  const addChild = async (child: Child) => {
    if (!user) return;

    const normalizedChild = normalizeChild({
      ...child,
      parentId: user.id,
    });

    const nextChildren = [...childrenProfile, normalizedChild];
    setChildrenProfile(nextChildren);
    setActiveChildId(normalizedChild.id);

    await persistChildren(nextChildren);

    if (supabase && isSupabaseConfigured) {
      await supabase.from("child_profiles").upsert(
        {
          id: normalizedChild.id,
          parent_user_id: user.id,
          name: normalizedChild.name,
          age: normalizedChild.age,
          age_category: normalizedChild.ageCategory,
          interests: normalizedChild.interests,
          talent_profile: normalizedChild.talentProfile || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    }
  };

  const updateChildDiagnostic = async (
    childId: string,
    diagnostic: Diagnostic,
  ) => {
    const nextChildren = childrenProfile.map((child) => {
      if (child.id === childId) {
        return normalizeChild({ ...child, talentProfile: diagnostic });
      }
      return child;
    });

    setChildrenProfile(nextChildren);
    await persistChildren(nextChildren);

    if (supabase && isSupabaseConfigured) {
      await supabase
        .from("child_profiles")
        .update({
          talent_profile: diagnostic,
          updated_at: new Date().toISOString(),
        })
        .eq("id", childId);
    }
  };

  return (
    <ParentDataContext.Provider
      value={{
        parentProfile,
        childrenProfile,
        activeChildId,
        isLoading,
        setActiveChildId,
        addChild,
        saveParentProfile,
        updateChildDiagnostic,
      }}
    >
      {children}
    </ParentDataContext.Provider>
  );
}

export function useParentData() {
  const context = useContext(ParentDataContext);
  if (context === undefined) {
    throw new Error("useParentData must be used within a ParentDataProvider");
  }
  return context;
}
