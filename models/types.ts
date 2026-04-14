export interface User {
  uid: string;
  email?: string;
  phone?: string;
  displayName: string;
  createdAt?: string;
}

export interface Diagnostic {
  childId: string;
  scores: {
    logical: number;
    creative: number;
    social: number;
    physical: number;
    linguistic: number;
  };
  summary: string;
  recommendedConstellation: string;
  timestamp?: string;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  age: number;
  ageCategory?: "child" | "teen" | "young-adult";
  interests: string[];
  talentProfile?: Diagnostic;
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
