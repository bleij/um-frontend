import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';

export function ChildAchievements() {
  const navigate = useNavigate();

  const achievements = [
    { id: 1, name: 'Первые шаги', emoji: '👣', description: 'Зарегистрировался в системе', unlocked: true, color: 'from-blue-400 to-blue-600' },
    { id: 2, name: 'Художник', emoji: '🎨', description: 'Посетил 5 занятий по рисованию', unlocked: true, color: 'from-yellow-400 to-yellow-600' },
    { id: 3, name: 'Спортсмен', emoji: '⚽', description: 'Посетил 5 занятий спортом', unlocked: true, color: 'from-green-400 to-green-600' },
    { id: 4, name: 'Программист', emoji: '💻', description: 'Написал первую программу', unlocked: true, color: 'from-purple-400 to-purple-600' },
    { id: 5, name: 'Отличник', emoji: '⭐', description: 'Выполнил 20 заданий', unlocked: true, color: 'from-pink-400 to-pink-600' },
    { id: 6, name: 'Музыкант', emoji: '🎵', description: 'Посетил 5 музыкальных занятий', unlocked: false, color: 'from-indigo-400 to-indigo-600' },
    { id: 7, name: 'Читатель', emoji: '📚', description: 'Прочитай 10 книг', unlocked: false, color: 'from-orange-400 to-orange-600' },
    { id: 8, name: 'Друг', emoji: '👥', description: 'Найди 5 друзей в системе', unlocked: false, color: 'from-teal-400 to-teal-600' },
    { id: 9, name: 'Исследователь', emoji: '🔍', description: 'Попробуй 10 разных кружков', unlocked: false, color: 'from-red-400 to-red-600' },
    { id: 10, name: 'Мастер', emoji: '🏆', description: 'Достигни Level 10', unlocked: false, color: 'from-yellow-500 to-orange-600' },
    { id: 11, name: 'Гений', emoji: '🧠', description: 'Набери 5000 XP', unlocked: false, color: 'from-purple-500 to-pink-600' },
    { id: 12, name: 'Легенда', emoji: '👑', description: 'Получи все достижения', unlocked: false, color: 'from-yellow-600 to-yellow-800' },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('/child')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Достижения</h1>
            <p className="text-sm text-gray-600">
              Открыто {unlockedCount} из {achievements.length}
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white p-5 rounded-3xl shadow-lg mb-5">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-[#6C5CE7]" />
            <span className="font-bold">Твой прогресс</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6C5CE7] to-pink-500 rounded-full transition-all"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            {Math.round((unlockedCount / achievements.length) * 100)}% завершено
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <button
              key={achievement.id}
              className={`p-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color} text-white`
                  : 'bg-white text-gray-400'
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl mb-2 ${achievement.unlocked ? '' : 'opacity-30'}`}>
                  {achievement.unlocked ? achievement.emoji : '🔒'}
                </div>
                <p className={`text-xs font-bold mb-1 ${achievement.unlocked ? '' : 'text-gray-500'}`}>
                  {achievement.name}
                </p>
                <p className={`text-[10px] leading-tight ${achievement.unlocked ? 'opacity-90' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Motivation Card */}
        <div className="mt-5 bg-gradient-to-br from-[#6C5CE7] to-purple-700 p-5 rounded-3xl shadow-lg text-white">
          <p className="text-center font-bold mb-1">💪 Продолжай собирать достижения!</p>
          <p className="text-center text-sm opacity-90">
            Выполняй задания и посещай занятия, чтобы открыть все значки!
          </p>
        </div>
      </div>
    </div>
  );
}
