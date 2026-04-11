import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getParentProfileByUserId, getChildrenByParentId } from '../lib/users';
import { getAllCourses } from '../lib/courses';

interface ParentDataContextType {
  parentProfile: any | null;
  children: any[];
  courses: any[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const ParentDataContext = createContext<ParentDataContextType | undefined>(undefined);

export function ParentDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [parentProfile, setParentProfile] = useState<any>(null);
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user || user.role !== 'parent') {
      setLoading(false);
      return;
    }

    try {
      // Загружаем данные параллельно
      const [profile, allCourses] = await Promise.all([
        getParentProfileByUserId(user.id),
        getAllCourses()
      ]);
      
      setParentProfile(profile);
      setCourses(allCourses);

      if (profile) {
        const kids = await getChildrenByParentId(profile.id);
        setChildrenList(kids);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <ParentDataContext.Provider value={{ parentProfile, children: childrenList, courses, loading, refetch: fetchData }}>
      {children}
    </ParentDataContext.Provider>
  );
}

export function useParentData() {
  const context = useContext(ParentDataContext);
  if (context === undefined) {
    throw new Error('useParentData must be used within ParentDataProvider');
  }
  return context;
}