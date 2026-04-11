import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, BookOpen, TrendingUp, CreditCard, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

export function YoungAdultHome() {
  const navigate = useNavigate();

  const skillsData = [
    { skill: 'Коммуникация', value: 88 },
    { skill: 'Лидерство', value: 82 },
    { skill: 'Креативность', value: 75 },
    { skill: 'Логика', value: 90 },
    { skill: 'Дисциплина', value: 85 },
  ];

  const progressData = [
    { month: 'Дек', value: 180 },
    { month: 'Янв', value: 220 },
    { month: 'Фев', value: 280 },
  ];

  const recommendations = [
    { id: 1, title: 'MBA для молодых предпринимателей', match: 95 },
    { id: 2, title: 'Продвинутый курс по Data Science', match: 90 },
    { id: 3, title: 'Публичные выступления', match: 85 },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Мастер-класс по стартапам', date: '28 фев', time: '18:00' },
    { id: 2, title: 'Machine Learning курс', date: '1 мар', time: '19:00' },
  ];

  const menuItems = [
    { icon: BookOpen, label: 'Мои курсы', count: 5, color: 'bg-purple-100 text-[#6C5CE7]' },
    { icon: CreditCard, label: 'Платежи', count: null, color: 'bg-blue-100 text-blue-600' },
    { icon: TrendingUp, label: 'Навыки', count: null, color: 'bg-green-100 text-green-600' },
    { icon: Target, label: 'Рекомендации', count: 3, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Александр</h1>
            <p className="text-sm opacity-90">Студент, 19 лет</p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
            <img
              src="https://images.unsplash.com/photo-1769650796145-30df10357926?w=200&h=200&fit=crop"
              alt="Александр"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">3280</p>
            <p className="text-xs opacity-90">Total XP</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs opacity-90">Level</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs opacity-90">Курсов</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-5 pb-6">
        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate('/parent/clubs')}
                className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{item.label}</p>
                  {item.count && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">Прогресс за последние месяцы</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={progressData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Bar dataKey="value" fill="#6C5CE7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Radar */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-3">Профиль навыков</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Radar dataKey="value" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="font-semibold text-lg mb-3 px-1">Рекомендации для развития</h3>
          <div className="space-y-2">
            {recommendations.map((rec) => (
              <button
                key={rec.id}
                onClick={() => navigate(`/parent/clubs/${rec.id}`)}
                className="w-full bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{rec.title}</p>
                  <span className="text-sm font-bold text-[#6C5CE7]">{rec.match}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6C5CE7] to-purple-600 rounded-full"
                    style={{ width: `${rec.match}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="font-semibold text-lg mb-3 px-1">Предстоящие события</h3>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#6C5CE7]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date} в {event.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
