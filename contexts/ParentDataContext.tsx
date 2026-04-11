import React, { createContext, useContext, useState, ReactNode } from "react";
import { Child, Diagnostic } from "../models/types";

interface ParentDataContextType {
    parentProfile: { firstName: string } | null;
    childrenProfile: Child[];
    activeChildId: string | null;
    setActiveChildId: (id: string) => void;
    addChild: (child: Child) => void;
    updateChildDiagnostic: (childId: string, diagnostic: Diagnostic) => void;
}

const ParentDataContext = createContext<ParentDataContextType | undefined>(undefined);

export function ParentDataProvider({ children }: { children: ReactNode }) {
    const [parentProfile, setParentProfile] = useState({ firstName: "Константин" });
    const [childrenProfile, setChildrenProfile] = useState<Child[]>([
        { 
            id: "1", parentId: "1", name: "Алиса", age: 10, interests: ["Рисование"], 
            // no talent profile initially, to trigger diagnostic
        },
        { 
            id: "2", parentId: "1", name: "Михаил", age: 14, interests: ["Код"], 
            talentProfile: { childId: "2", scores: { creative: 40, logical: 90, social: 40, physical: 20, linguistic: 60 }, summary: "Аналитическое мышление развито сильно", recommendedConstellation: "Инженер" } 
        }
    ]);
    const [activeChildId, setActiveChildId] = useState<string | null>("1");

    const addChild = (child: Child) => {
        setChildrenProfile(prev => [...prev, child]);
        setActiveChildId(child.id);
    };

    const updateChildDiagnostic = (childId: string, diagnostic: Diagnostic) => {
        setChildrenProfile(prev => prev.map(child => {
            if (child.id === childId) {
                return { ...child, talentProfile: diagnostic };
            }
            return child;
        }));
    };

    return (
        <ParentDataContext.Provider value={{
            parentProfile,
            childrenProfile,
            activeChildId,
            setActiveChildId,
            addChild,
            updateChildDiagnostic
        }}>
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
