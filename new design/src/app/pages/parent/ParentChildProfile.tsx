import image_32394b1c65b1cf4a91a93363ffec0c95997113a6 from 'figma:asset/32394b1c65b1cf4a91a93363ffec0c95997113a6.png'
import { useNavigate, useParams } from 'react-router';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Home, Calendar, BookOpen, BarChart3, User, Target, TrendingUp, Award } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getParentProfileByUserId, getChildProfilesByParentId, ChildProfile } from '../../lib/users';

export function ParentChildProfile() {
  const navigate = useNavigate();
  const { childId } = useParams();
  const { user } = useAuth();
  const [childData, setChildData] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChild = async () => {
      if (!user || !childId) return;
      
      try {
        // Получаем профиль родителя
        const parentProfile = await getParentProfileByUserId(user.id);
        if (!parentProfile) {
          console.error('Профиль родителя не найден');
          setLoading(false);
          return;
        }
        
        // Получаем всех детей родителя
        const childProfiles = await getChildProfilesByParentId(parentProfile.id);
        
        // Находим нужного ребенка
        const child = childProfiles.find(c => c.id === childId);
        if (child) {
          setChildData(child);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных ребенка:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChild();
  }, [user, childId]);
  
  // Убрали полноэкранную загрузку
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }
  
  if (!childData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Ребенок не найден</p>
          <button
            onClick={() => navigate('/parent')}
            className="mt-4 px-6 py-3 bg-[#6C5CE7] text-white rounded-2xl"
          >
            Вернуться
          </button>
        </div>
      </div>
    );
  }
  
  // Временные данные для графика, пока нет реальных данных в БД
  const skillsData = [
    { skill: 'Коммуникация', value: 75 },
    { skill: 'Лидерство', value: 65 },
    { skill: 'Креативность', value: 80 },
    { skill: 'Логика', value: 70 },
    { skill: 'Дисциплина', value: 75 },
  ];

  const navItems = [
    { icon: Home, label: 'Главная', path: '/parent' },
    { icon: Calendar, label: 'Календарь', path: '/parent/calendar' },
    { icon: BookOpen, label: 'Кружки', path: '/parent/clubs' },
    { icon: BarChart3, label: 'Отчеты', path: '/parent/reports' },
    { icon: User, label: 'Профиль', path: '/parent/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Профиль ребенка" showBack={true} dark={true} backPath="/parent/children" />

      <div className="p-4 space-y-6">
        {/* Child Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 bg-gradient-to-br from-[#6C5CE7] to-purple-500 flex items-center justify-center text-white font-bold text-4xl">
            {childData.full_name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold mb-1">{childData.full_name}</h2>
          <p className="text-gray-500 mb-2">{childData.age} лет</p>
          <p className="text-sm text-gray-600 mb-4">
            {childData.age_category === 'child' ? 'Ребенок (6-11 лет)' : 
             childData.age_category === 'teen' ? 'Подросток (12-17 лет)' : 
             'Молодой взрослый (18-20 лет)'}
          </p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6C5CE7]">0</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6C5CE7]">Level 1</p>
              <p className="text-xs text-gray-500">Уровень</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6C5CE7]">0</p>
              <p className="text-xs text-gray-500">Достижений</p>
            </div>
          </div>
          {childData.interests && (
            <div className="mt-4 p-3 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600 font-medium mb-1">Интересы</p>
              <p className="text-sm text-[#6C5CE7]">{childData.interests}</p>
            </div>
          )}
        </div>

        {/* Soft Skills */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#6C5CE7]" />
            Гибкие навыки
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsData}>
                <PolarGrid stroke="#e5e7eb" key="polar-grid" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  key="polar-angle-axis"
                />
                <Radar
                  dataKey="value"
                  stroke="#6C5CE7"
                  fill="#6C5CE7"
                  fillOpacity={0.5}
                  key="radar-data"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">График будет обновляться на основе результатов тестов</p>
        </div>

        {/* Test Status */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#6C5CE7]" />
            Статус тестирования
          </h3>
          {childData.has_completed_test ? (
            <div className="p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div>
                  <p className="font-medium text-sm text-green-900">Тест пройден</p>
                  <p className="text-xs text-green-700">Рекомендации готовы</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <p className="font-medium text-sm text-yellow-900">Тест не пройден</p>
                <p className="text-xs text-yellow-700 mt-1">Пройдите тест для получения персональных рекомендаций</p>
              </div>
              <button
                onClick={() => navigate('/parent/testing')}
                className="w-full py-3 bg-[#6C5CE7] text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                Пройти тест
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 p-4 rounded-2xl">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Подсказка:</span> После прохождения теста здесь появятся рекомендации AI по кружкам и активностям для ребенка.
          </p>
        </div>
      </div>

      <BottomNav items={navItems} />
    </div>
  );
}