import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';

export function OrgTasks() {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState('all');

  const clubs = [
    { id: 'all', name: 'Все кружки' },
    { id: 'art', name: 'Художественная студия' },
    { id: 'football', name: 'Футбол' },
    { id: 'coding', name: 'Программирование' },
  ];

  const tasks = [
    {
      id: 1,
      title: 'Нарисовать пейзаж',
      club: 'Художественная студия',
      clubId: 'art',
      assignedTo: 'Все ученики',
      dueDate: '28 фев 2026',
      xp: 50,
      completed: 12,
      total: 18,
    },
    {
      id: 2,
      title: 'Техника ведения мяча',
      club: 'Футбол',
      clubId: 'football',
      assignedTo: 'Все ученики',
      dueDate: '1 мар 2026',
      xp: 45,
      completed: 18,
      total: 24,
    },
    {
      id: 3,
      title: 'Создать простую программу',
      club: 'Программирование',
      clubId: 'coding',
      assignedTo: 'Все ученики',
      dueDate: '2 мар 2026',
      xp: 60,
      completed: 8,
      total: 15,
    },
    {
      id: 4,
      title: 'Слепить фигурку животного',
      club: 'Художественная студия',
      clubId: 'art',
      assignedTo: 'Все ученики',
      dueDate: '3 мар 2026',
      xp: 40,
      completed: 5,
      total: 18,
    },
  ];

  const filteredTasks = selectedClub === 'all'
    ? tasks
    : tasks.filter((task) => task.clubId === selectedClub);

  const getCompletionRate = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/organization')} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold flex-1">Задания</h1>
          <button className="px-4 py-2 bg-[#6C5CE7] text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Создать
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Club Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {clubs.map((club) => (
            <button
              key={club.id}
              onClick={() => setSelectedClub(club.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                selectedClub === club.id
                  ? 'bg-[#6C5CE7] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {club.name}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const completionRate = getCompletionRate(task.completed, task.total);
            return (
              <div key={task.id} className="bg-white p-5 rounded-2xl shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.club}</p>
                  </div>
                  <span className="text-sm font-bold text-[#6C5CE7] bg-purple-100 px-3 py-1 rounded-full">
                    +{task.xp} XP
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl mb-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Назначено:</span>
                    <span className="font-medium">{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Срок:</span>
                    <span className="font-medium">{task.dueDate}</span>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Выполнено: {task.completed} из {task.total}
                    </span>
                    <span className="text-sm font-bold text-[#6C5CE7]">{completionRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        completionRate === 100 ? 'bg-green-500' : 'bg-[#6C5CE7]'
                      }`}
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  {completionRate === 100 && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium mt-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Задание завершено!
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-purple-100 text-[#6C5CE7] rounded-xl text-sm font-medium hover:bg-purple-200 transition-colors">
                    Редактировать
                  </button>
                  <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет заданий</p>
          </div>
        )}
      </div>
    </div>
  );
}
