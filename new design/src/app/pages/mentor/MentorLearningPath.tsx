import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Target, BookOpen, CheckCircle2, Plus } from 'lucide-react';

export function MentorLearningPath() {
  const navigate = useNavigate();
  const { childId } = useParams();

  const pathSteps = [
    {
      id: 1,
      phase: 'Текущие навыки',
      status: 'completed',
      items: [
        { text: 'Креативность: высокий уровень', completed: true },
        { text: 'Коммуникация: средний уровень', completed: true },
        { text: 'Лидерство: требует развития', completed: true },
      ],
    },
    {
      id: 2,
      phase: 'Цели развития',
      status: 'active',
      items: [
        { text: 'Развить навыки публичных выступлений', completed: true },
        { text: 'Улучшить командную работу', completed: false },
        { text: 'Повысить уверенность в себе', completed: false },
      ],
    },
    {
      id: 3,
      phase: 'Рекомендованные кружки',
      status: 'active',
      items: [
        { text: 'Театральная студия', completed: false, icon: '🎭' },
        { text: 'Ораторское искусство', completed: false, icon: '🎤' },
        { text: 'Командные виды спорта', completed: false, icon: '⚽' },
      ],
    },
    {
      id: 4,
      phase: 'Задания и активности',
      status: 'pending',
      items: [
        { text: 'Участие в школьном спектакле', completed: false },
        { text: 'Выступление перед классом', completed: false },
        { text: 'Организация группового проекта', completed: false },
      ],
    },
    {
      id: 5,
      phase: 'Контрольные точки',
      status: 'pending',
      items: [
        { text: 'Оценка прогресса через 1 месяц', completed: false, date: '28 мар' },
        { text: 'Промежуточная оценка через 3 месяца', completed: false, date: '28 май' },
        { text: 'Финальная оценка через 6 месяцев', completed: false, date: '28 авг' },
      ],
    },
  ];

  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-[#6C5CE7]';
      default:
        return 'bg-gray-300';
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-white" />;
      case 'active':
        return <Target className="w-6 h-6 text-white" />;
      default:
        return <div className="w-3 h-3 bg-white rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-green-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(`/mentor/child/${childId}`)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              План развития
            </h1>
            <p className="text-sm opacity-90">Анна Петрова</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Overview Card */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-2">Общий прогресс</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#6C5CE7] to-purple-600 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
            <span className="text-xl font-bold text-[#6C5CE7]">40%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            2 из 5 этапов завершено
          </p>
        </div>

        {/* Learning Path */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />

          <div className="space-y-6">
            {pathSteps.map((step, index) => {
              const completedItems = step.items.filter((item) => item.completed).length;
              const progress = (completedItems / step.items.length) * 100;

              return (
                <div key={step.id} className="relative">
                  {/* Phase Indicator */}
                  <div className={`absolute left-5 w-8 h-8 rounded-full ${getPhaseColor(step.status)} flex items-center justify-center z-10`}>
                    {getPhaseIcon(step.status)}
                  </div>

                  {/* Phase Card */}
                  <div className="ml-16 bg-white p-5 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{step.phase}</h4>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        step.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : step.status === 'active'
                          ? 'bg-purple-100 text-[#6C5CE7]'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? 'Завершено' : step.status === 'active' ? 'В процессе' : 'Ожидает'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {step.status !== 'pending' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Прогресс</span>
                          <span className="text-sm font-semibold text-[#6C5CE7]">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              step.status === 'completed' ? 'bg-green-500' : 'bg-[#6C5CE7]'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2">
                      {step.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            item.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.completed ? 'bg-green-500' : 'border-2 border-gray-300 bg-white'
                            }`}
                          >
                            {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          {'icon' in item && <span className="text-xl">{item.icon}</span>}
                          <p
                            className={`text-sm flex-1 ${
                              item.completed ? 'line-through text-gray-500' : 'font-medium'
                            }`}
                          >
                            {item.text}
                          </p>
                          {'date' in item && (
                            <span className="text-xs text-gray-500">{item.date}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    {step.status === 'active' && (
                      <button className="w-full mt-3 py-2 bg-purple-100 text-[#6C5CE7] rounded-xl font-medium hover:bg-purple-200 transition-colors text-sm flex items-center justify-center gap-1">
                        <Plus className="w-4 h-4" />
                        Добавить элемент
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-[#6C5CE7] text-white rounded-2xl font-semibold hover:bg-purple-700 transition-colors">
            Сохранить изменения
          </button>
          <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
