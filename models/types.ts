export interface User {
  uid: string;
  email?: string;
  phone?: string;
  displayName: string;
  createdAt?: string;
}

export interface Diagnostic {
  childId: string;
  scores: Record<string, number>;
  summary: string;
  recommendedConstellation: string;
  timestamp?: string;

  // ── Extended PRO report fields (6-8 "Explorers" group) ──────────────
  // These are populated when `tier === "pro"`. The backend report
  // generator fills them; the frontend treats them as optional.
  tier?: "basic" | "pro";
  ageGroup?: string;
  intellectType?: string;
  personalityBehavior?: string;
  careerArchetypes?: string[];
  parentAdvice?: string;
  topStrengths?: string[];
  developmentAreas?: string[];
  rawMetadata?: Record<string, any>;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  phone?: string;
  age: number;
  ageCategory?: "child" | "teen" | "young-adult";
  interests: string[];
  goals?: string;
  talentProfile?: Diagnostic;
  qrPin?: string;
  qrPinExpiresAt?: string | Date;
  qrPinOneTimeUse?: boolean;
  createdAt?: string;
}

export interface RoadmapItem {
  id: string;
  childId: string;
  title: string;
  description: string;
  status: "locked" | "available" | "completed";
  type: "skill" | "activity" | "milestone";
  order: number;
}

export interface Course {
  id: string | number;
  organizationId?: string;
  title: string;
  tag?: string;
  icon?: string;
  gradient?: string[];
  shortDescription?: string;
  description: string;
  age?: string;
  level: string;
  format?: string;
  duration?: string;
  price: number | string;
  skills?: string | Array<{ name: string; value: number }>;
  status?: "active" | "draft" | "archived" | string;
}
