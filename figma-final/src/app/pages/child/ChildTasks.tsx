import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Star } from 'lucide-react';

export function ChildTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Нарисовать пейзаж', club: 'Художественная студия', xp: 50, completed: true, emoji: '🎨' },
    { id: 2, title: 'Сделать домашнее задание', club: 'Программирование', xp: 40, completed: false, emoji: '💻' },
    { id: 3, title: 'Выучить 10 новых слов', club: 'Английский язык', xp: 30, completed: false, emoji: '📚' },
    { id: 4, title: 'Пробежать 1 км', club: 'Футбол', xp: 45, completed: false, emoji: '⚽' },
    { id: 5, title: 'Слепить фигурку', club: 'Художественная студия', xp: 35, completed: false, emoji: '🎨' },
    { id: 6, title: 'Решить 5 задач по логике', club: 'Программирование', xp: 50, completed: false, emoji: '🧩' },
  ]);

  const handleToggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalXP = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.xp, 0);

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
            <h1 className="text-2xl font-bold">Задания</h1>
            <p className="text-sm text-gray-600">
              Выполнено: {completedCount} из {tasks.length}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-[#6C5CE7] to-purple-700 p-5 rounded-3xl shadow-lg mb-5 text-white">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span className="text-2xl font-bold">{totalXP}</span>
              </div>
              <p className="text-sm opacity-90">Заработано XP</p>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Check className="w-5 h-5" />
                <span className="text-2xl font-bold">{completedCount}</span>
              </div>
              <p className="text-sm opacity-90">Выполнено</p>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg px-1">Твои задания</h3>
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`w-full p-4 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] ${
                task.completed
                  ? 'bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{task.emoji}</div>
                <div className="flex-1 text-left">
                  <p className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">{task.club}</p>
                </div>
                <div className="text-right">
                  {task.completed ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full" />
                  )}
                  <p className={`text-xs font-bold mt-1 ${task.completed ? 'text-green-600' : 'text-[#6C5CE7]'}`}>
                    +{task.xp} XP
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Motivation */}
        {completedCount < tasks.length && (
          <div className="mt-5 bg-white p-5 rounded-3xl shadow-lg text-center">
            <p className="text-2xl mb-2">🎯</p>
            <p className="font-bold text-[#6C5CE7]">
              Ещё {tasks.length - completedCount} заданий до успеха!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Выполни все задания и получи бонусные 100 XP!
            </p>
          </div>
        )}

        {completedCount === tasks.length && (
          <div className="mt-5 bg-gradient-to-r from-yellow-400 to-orange-500 p-5 rounded-3xl shadow-lg text-white text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="font-bold text-xl">Все задания выполнены!</p>
            <p className="text-sm opacity-90 mt-1">Ты молодец! Получаешь бонус +100 XP!</p>
          </div>
        )}
      </div>
    </div>
  );
}
