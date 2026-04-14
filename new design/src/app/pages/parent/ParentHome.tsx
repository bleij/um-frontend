import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Home, Calendar, BookOpen, BarChart3, User, Plus, Bell, TrendingUp, Target, Star, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useParentData } from '../../contexts/ParentDataContext';

export function ParentHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { parentProfile, children, courses, loading } = useParentData();
  const [showNotifications, setShowNotifications] = useState(false);

  // Фильтруем курсы по возрастным группам детей и берем первые 3
  const getRecommendations = () => {
    if (children.length === 0) return [];
    
    // Определяем возрастные группы детей
    const childAgeGroups = children.map(child => {
      const age = child.age;
      if (age >= 6 && age <= 11) return '6-11';
      if (age >= 12 && age <= 17) return '12-17';
      if (age >= 18 && age <= 20) return '18-20';
      return '6-11';
    });

    // Фильтруем курсы по возрастным группам
    const relevantCourses = courses.filter(course => 
      childAgeGroups.includes(course.age_group)
    );

    // Берем первые 3 или все доступные
    const recommendedCourses = relevantCourses.slice(0, 3);
    
    // Форматируем для отображения
    return recommendedCourses.map((course, index) => ({
      id: course.id,
      title: course.title,
      age: course.age_group,
      image: course.image_url || 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=400&h=300&fit=crop',
      rating: course.rating || 4.5,
      for: children[index % children.length]?.full_name || 'Ваш ребенок',
    }));
  };

  const recommendations = getRecommendations();

  const upcomingClasses = [
    // Временные данные - будут заменены на реальные из БД
    // TODO: добавить таблицу для календарных событий
  ];

  const navItems = [
    { icon: Home, label: 'Главная', path: '/parent' },
    { icon: Calendar, label: 'Календарь', path: '/parent/calendar' },
    { icon: BookOpen, label: 'Кружки', path: '/parent/clubs' },
    { icon: BarChart3, label: 'Отчеты', path: '/parent/reports' },
    { icon: User, label: 'Профиль', path: '/parent/profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] pb-24">
      <Header
        title="UM"
        showNotifications={true}
        onNotificationClick={() => setShowNotifications(true)}
        avatar="https://images.unsplash.com/photo-1758687126864-96b61e1b3af0?w=100&h=100&fit=crop"
      />

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowNotifications(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Уведомления</h2>
              <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-3">
              {children.length > 0 ? (
                <>
                  <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-[#6C5CE7]">
                    <p className="font-semibold text-gray-800">Новая рекомендация для {children[0]?.full_name || 'ребенка'}</p>
                    <p className="text-sm text-gray-500 mt-1">AI рекомендует попробовать художественную студию</p>
                    <p className="text-xs text-gray-400 mt-2">2 часа назад</p>
                  </div>
                  {children.length > 1 && (
                    <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                      <p className="font-semibold text-gray-800">Пройдите тестирование</p>
                      <p className="text-sm text-gray-500 mt-1">Узнайте предрасположенности {children[1]?.full_name || 'ребенка'}</p>
                      <p className="text-xs text-gray-400 mt-2">5 часов назад</p>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-800">Обновление платформы</p>
                    <p className="text-sm text-gray-500 mt-1">Добавлены новые функции в личный кабинет</p>
                    <p className="text-xs text-gray-400 mt-2">1 день назад</p>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Пока нет уведомлений
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Children Cards */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-white">Мои дети</h2>
            <button
              onClick={() => navigate('/parent/children')}
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              Все
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => navigate(`/parent/children/${child.id}`)}
                className="flex-shrink-0 w-36 p-5 bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 bg-gradient-to-br from-[#6C5CE7] to-purple-500 ring-4 ring-[#6C5CE7]/20 flex items-center justify-center text-white font-bold text-2xl">
                  {child.full_name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-sm text-center text-gray-800">{child.full_name}</p>
                <p className="text-xs text-gray-500 text-center mt-1">{child.age} лет</p>
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-xl text-white">Рекомендации AI</h2>
              <p className="text-sm text-white/70 mt-1">На основе тестирований</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recommendations.map((rec) => (
              <button
                key={rec.id}
                onClick={() => navigate(`/parent/clubs/${rec.id}`)}
                className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative h-40">
                  <img src={rec.image} alt={rec.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium">{rec.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{rec.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{rec.age}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6C5CE7] bg-purple-50 px-2 py-1 rounded-full">
                      Для: {rec.for}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-white">Ближайшие занятия</h2>
            <button
              onClick={() => navigate('/parent/calendar')}
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              Календарь
            </button>
          </div>
          {upcomingClasses.length > 0 ? (
            <div className="space-y-3">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-2xl flex items-center justify-center shadow-md">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{cls.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{cls.child}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{cls.date}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{cls.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl text-center">
              <p className="text-gray-500">Пока нет запланированных занятий</p>
              <button
                onClick={() => navigate('/parent/clubs')}
                className="mt-3 text-[#6C5CE7] font-medium hover:underline"
              >
                Выбрать кружок
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav items={navItems} />
    </div>
  );
}