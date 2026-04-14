import { useNavigate } from 'react-router';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Home, Calendar, BookOpen, BarChart3, User, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getParentProfileByUserId, getChildProfilesByParentId, ChildProfile } from '../../lib/users';

export function ParentChildren() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChildren = async () => {
      if (!user) return;
      
      try {
        // Получаем профиль родителя
        const parentProfile = await getParentProfileByUserId(user.id);
        if (!parentProfile) {
          console.error('Профиль родителя не найден');
          setLoading(false);
          return;
        }
        
        // Получаем детей родителя
        const childProfiles = await getChildProfilesByParentId(parentProfile.id);
        setChildren(childProfiles);
      } catch (error) {
        console.error('Ошибка загрузки детей:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChildren();
  }, [user]);

  const navItems = [
    { icon: Home, label: 'Главная', path: '/parent' },
    { icon: Calendar, label: 'Календарь', path: '/parent/calendar' },
    { icon: BookOpen, label: 'Кружки', path: '/parent/clubs' },
    { icon: BarChart3, label: 'Отчеты', path: '/parent/reports' },
    { icon: User, label: 'Профиль', path: '/parent/profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] pb-24">
      <Header title="Мои дети" showBack={true} backPath="/parent" />

      <div className="p-6 space-y-5">
        <button 
          onClick={() => navigate('/create-profile-parent')}
          className="w-full p-5 bg-white/95 backdrop-blur-sm text-[#6C5CE7] rounded-3xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-3 font-semibold text-lg"
        >
          <Plus className="w-6 h-6" />
          Добавить ребенка
        </button>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-white text-lg">Загрузка...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-10 bg-white/95 rounded-3xl p-6">
            <p className="text-gray-600 text-lg">Дети пока не добавлены</p>
            <p className="text-gray-500 text-sm mt-2">Нажмите "Добавить ребенка" чтобы начать</p>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => navigate(`/parent/children/${child.id}`)}
                className="w-full p-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-left"
              >
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#6C5CE7] to-purple-500 flex-shrink-0 ring-4 ring-white/50 flex items-center justify-center text-white font-bold text-2xl">
                    {child.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800">{child.full_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{child.age} лет</p>
                    <div className="mt-2 inline-flex items-center gap-2 bg-[#6C5CE7]/10 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-[#6C5CE7] rounded-full"></div>
                      <span className="text-sm text-[#6C5CE7] font-medium">
                        {child.age_category === 'child' ? 'Ребенок (6-11)' : 
                         child.age_category === 'teen' ? 'Подросток (12-17)' : 
                         'Молодой взрослый (18-20)'}
                      </span>
                    </div>
                  </div>
                  <div className="text-[#6C5CE7]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav items={navItems} />
    </div>
  );
}