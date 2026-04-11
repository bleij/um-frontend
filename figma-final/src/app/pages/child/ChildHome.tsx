import image_32394b1c65b1cf4a91a93363ffec0c95997113a6 from 'figma:asset/32394b1c65b1cf4a91a93363ffec0c95997113a6.png'
import { useNavigate } from 'react-router';
import { Home, Trophy, ListChecks, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getChildOwnProfileByUserId } from '../../lib/users';

export function ChildHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const childProfile = await getChildOwnProfileByUserId(user.id);
        setProfile(childProfile);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Загрузка...</p>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Профиль не найден</p>
          <button
            onClick={() => navigate('/create-profile-child')}
            className="mt-4 px-6 py-3 bg-[#6C5CE7] text-white rounded-2xl"
          >
            Создать профиль
          </button>
        </div>
      </div>
    );
  }
  
  const firstName = profile.full_name.split(' ')[0] || 'Друг';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 p-4">
      <div className="max-w-md mx-auto space-y-5">
        {/* Header with Avatar and Level */}
        <div className="bg-white p-5 rounded-3xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/')} className="text-2xl">
              ←
            </button>
            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-4 border-[#6C5CE7]">
                <img
                  src={image_32394b1c65b1cf4a91a93363ffec0c95997113a6}
                  alt="Анна"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">Привет, {firstName}! 👋</h2>
              <p className="text-sm text-gray-600">Level 5</p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[#6C5CE7]">1250 XP</span>
              <span className="text-gray-500">до Level 6: 250 XP</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#6C5CE7] to-pink-500 rounded-full" style={{ width: '83%' }} />
            </div>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/parent/clubs')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white"
          >
            <div className="text-4xl mb-2">🎨</div>
            <p className="font-bold">Мои кружки</p>
          </button>
          <button
            onClick={() => navigate('/parent/calendar')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white"
          >
            <div className="text-4xl mb-2">📅</div>
            <p className="font-bold">Календарь</p>
          </button>
          <button
            onClick={() => navigate('/parent/testing')}
            className="bg-gradient-to-br from-pink-500 to-pink-600 p-5 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white"
          >
            <div className="text-4xl mb-2">🧩</div>
            <p className="font-bold">Тесты</p>
          </button>
          <button
            onClick={() => navigate('/child/achievements')}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 p-5 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white"
          >
            <div className="text-4xl mb-2">🏆</div>
            <p className="font-bold">Достижения</p>
          </button>
        </div>

        {/* Achievements Preview */}
        <div className="bg-white p-5 rounded-3xl shadow-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Последние достижения
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-1">
                🎨
              </div>
              <p className="text-xs font-medium">Художник</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-1">
                ⚽
              </div>
              <p className="text-xs font-medium">Спортсмен</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-1">
                💻
              </div>
              <p className="text-xs font-medium">Программист</p>
            </div>
            <div className="text-center opacity-40">
              <div className="w-14 h-14 bg-gray-300 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-1">
                🔒
              </div>
              <p className="text-xs font-medium">Секрет</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/child/achievements')}
            className="w-full mt-3 py-2 bg-purple-100 text-[#6C5CE7] rounded-xl font-medium hover:bg-purple-200 transition-colors"
          >
            Смотреть все
          </button>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white p-5 rounded-3xl shadow-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#6C5CE7]" />
            Задания на сегодня
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-6 h-6 bg-[#6C5CE7] rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span className="flex-1 text-sm line-through text-gray-500">Нарисовать пейзаж</span>
              <span className="text-xs font-bold text-[#6C5CE7]">+50 XP</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white border-2 border-purple-200 rounded-xl">
              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full" />
              <span className="flex-1 text-sm font-medium">Сделать домашнее задание</span>
              <span className="text-xs font-bold text-gray-400">+40 XP</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/child/tasks')}
            className="w-full mt-3 py-2 bg-purple-100 text-[#6C5CE7] rounded-xl font-medium hover:bg-purple-200 transition-colors"
          >
            Все задания
          </button>
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-br from-[#6C5CE7] to-purple-700 p-5 rounded-3xl shadow-lg text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Отличная работа! 🌟</h3>
              <p className="text-sm opacity-90">
                Ты выполнила уже 15 заданий на этой неделе! Продолжай в том же духе!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}