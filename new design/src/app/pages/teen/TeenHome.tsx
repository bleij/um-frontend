import { useNavigate } from 'react-router';
import { ArrowLeft, MessageCircle, Target, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

export function TeenHome() {
  const navigate = useNavigate();

  const skillsData = [
    { skill: 'Коммуникация', value: 78 },
    { skill: 'Лидерство', value: 65 },
    { skill: 'Креативность', value: 85 },
    { skill: 'Логика', value: 80 },
    { skill: 'Дисциплина', value: 72 },
  ];

  const recommendations = [
    { id: 1, title: 'Дебаты и ораторское искусство', match: 92, image: 'https://images.unsplash.com/photo-1610357285982-a5352a783962?w=400&h=300&fit=crop' },
    { id: 2, title: 'Разработка игр', match: 88, image: 'https://images.unsplash.com/photo-1565229284535-2cbbe3049123?w=400&h=300&fit=crop' },
  ];

  const upcomingClasses = [
    { id: 1, title: 'Футбол', time: 'Сегодня, 17:00', color: 'bg-blue-500' },
    { id: 2, title: 'Программирование', time: 'Завтра, 16:00', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 pb-20 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Привет, Максим! 👋</h1>
            <p className="text-sm opacity-90">Level 8 • 2450 XP</p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
            <img
              src="https://images.unsplash.com/photo-1510340842445-b6b8a6c0762e?w=200&h=200&fit=crop"
              alt="Максим"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* XP Bar */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span>До следующего уровня</span>
            <span className="font-bold">550 XP</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 space-y-5 pb-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          
          <button
            onClick={() => navigate('/parent/calendar')}
            className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              📅
            </div>
            <p className="text-xs font-semibold text-center">Календарь</p>
          </button>
          <button
            onClick={() => navigate('/teen/mentor-chat')}
            className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all relative"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs font-semibold text-center">Ментор</p>
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>

        {/* Soft Skills Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#6C5CE7]" />
            <h3 className="font-semibold">Мои навыки</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsData}>
                <PolarGrid stroke="#e5e7eb" key="polar-grid" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
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
          <button
            onClick={() => navigate('/parent/reports')}
            className="w-full mt-3 py-2 bg-purple-100 text-[#6C5CE7] rounded-xl font-medium hover:bg-purple-200 transition-colors text-sm"
          >
            Подробная статистика
          </button>
        </div>

        {/* AI Recommendations */}
        <div>
          <h3 className="font-semibold text-lg mb-3 px-1">Рекомендации для тебя</h3>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <button
                key={rec.id}
                onClick={() => navigate(`/parent/clubs/${rec.id}`)}
                className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4">
                  <img src={rec.image} alt={rec.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#6C5CE7] to-purple-600 rounded-full"
                          style={{ width: `${rec.match}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-[#6C5CE7]">{rec.match}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Совпадение с твоими интересами</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div>
          <h3 className="font-semibold text-lg mb-3 px-1">Ближайшие занятия</h3>
          <div className="space-y-2">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
                <div className={`w-12 h-12 ${cls.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                  {cls.title.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{cls.title}</p>
                  <p className="text-sm text-gray-500">{cls.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
