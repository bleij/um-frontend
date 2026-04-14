import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, CheckCircle2, Target } from 'lucide-react';

export function TeenGoals() {
  const navigate = useNavigate();

  const goals = [
    {
      id: 1,
      title: 'Стать разработчиком игр',
      progress: 65,
      steps: [
        { id: 1, text: 'Изучить Python', completed: true },
        { id: 2, text: 'Создать первую игру', completed: true },
        { id: 3, text: 'Изучить Unity', completed: false },
        { id: 4, text: 'Опубликовать игру', completed: false },
      ],
    },
    {
      id: 2,
      title: 'Улучшить физическую форму',
      progress: 80,
      steps: [
        { id: 1, text: 'Посещать футбол 3 раза в неделю', completed: true },
        { id: 2, text: 'Пробежать 5 км без остановки', completed: true },
        { id: 3, text: 'Набрать мышечную массу', completed: false },
      ],
    },
    {
      id: 3,
      title: 'Развить лидерские качества',
      progress: 40,
      steps: [
        { id: 1, text: 'Стать капитаном команды', completed: false },
        { id: 2, text: 'Организовать школьное мероприятие', completed: false },
        { id: 3, text: 'Пройти курс по лидерству', completed: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/teen')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Мои цели
          </h1>
        </div>
        <p className="text-sm opacity-90 ml-13">
          Ставь цели и достигай их шаг за шагом
        </p>
      </div>

      <div className="p-4 space-y-5 -mt-4">
        {/* Add Goal Button */}
        <button className="w-full p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-[#6C5CE7] font-semibold">
          <Plus className="w-5 h-5" />
          Добавить новую цель
        </button>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const completedSteps = goal.steps.filter((s) => s.completed).length;
            const totalSteps = goal.steps.length;

            return (
              <div key={goal.id} className="bg-white p-5 rounded-2xl shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{goal.title}</h3>
                    <p className="text-sm text-gray-500">
                      {completedSteps} из {totalSteps} шагов выполнено
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#6C5CE7]">{goal.progress}%</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#6C5CE7] to-purple-600 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  {goal.steps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        step.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.completed ? 'bg-green-500' : 'border-2 border-gray-300 bg-white'
                        }`}
                      >
                        {step.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <p
                        className={`text-sm ${
                          step.completed ? 'line-through text-gray-500' : 'text-gray-700 font-medium'
                        }`}
                      >
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button className="w-full mt-3 py-2 bg-purple-100 text-[#6C5CE7] rounded-xl font-medium hover:bg-purple-200 transition-colors text-sm">
                  Редактировать цель
                </button>
              </div>
            );
          })}
        </div>

        {/* Motivation Card */}
        <div className="bg-gradient-to-br from-[#6C5CE7] to-purple-700 p-5 rounded-2xl text-white">
          <p className="font-bold text-lg mb-1">🎯 Продолжай двигаться вперёд!</p>
          <p className="text-sm opacity-90">
            Ты уже выполнил {goals.reduce((sum, g) => sum + g.steps.filter((s) => s.completed).length, 0)} шагов.
            Каждый шаг приближает тебя к успеху!
          </p>
        </div>
      </div>
    </div>
  );
}
