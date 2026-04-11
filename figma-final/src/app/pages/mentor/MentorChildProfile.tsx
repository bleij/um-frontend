import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Award, TrendingUp, Target, MessageCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function MentorChildProfile() {
  const navigate = useNavigate();
  const { childId } = useParams();

  const skillsData = [
    { skill: 'Коммуникация', value: 85 },
    { skill: 'Лидерство', value: 65 },
    { skill: 'Креативность', value: 90 },
    { skill: 'Логика', value: 75 },
    { skill: 'Дисциплина', value: 70 },
  ];

  const progressData = [
    { month: 'Сен', xp: 800 },
    { month: 'Окт', xp: 950 },
    { month: 'Ноя', xp: 1050 },
    { month: 'Дек', xp: 1150 },
    { month: 'Янв', xp: 1200 },
    { month: 'Фев', xp: 1250 },
  ];

  const tests = [
    { name: 'Креативность', score: 92, date: '15 янв' },
    { name: 'Логическое мышление', score: 78, date: '20 янв' },
    { name: 'Эмоциональный интеллект', score: 85, date: '1 фев' },
  ];

  const clubs = [
    { name: 'Художественная студия', attendance: 95 },
    { name: 'Программирование', attendance: 88 },
    { name: 'Английский язык', attendance: 92 },
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Театральная студия',
      reason: 'Развитие коммуникативных навыков и уверенности',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Шахматный клуб',
      reason: 'Улучшение стратегического мышления',
      priority: 'medium',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-green-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/mentor')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Профиль ученика</h1>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-5 pb-6">
        {/* Student Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 bg-gray-200 border-4 border-white shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=200&h=200&fit=crop"
              alt="Анна"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-1">Анна Петрова</h2>
          <p className="text-gray-600 mb-4">8 лет • Level 5</p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6C5CE7]">1250</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6C5CE7]">85%</p>
              <p className="text-xs text-gray-500">Прогресс</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6C5CE7]">12</p>
              <p className="text-xs text-gray-500">Достижений</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate(`/mentor/learning-path/${childId}`)}
              className="flex-1 py-3 bg-[#6C5CE7] text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              План развития
            </button>
            <button
              onClick={() => navigate('/teen/mentor-chat')}
              className="px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Soft Skills Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#6C5CE7]" />
            Профиль навыков
          </h3>
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

        {/* Progress Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">Динамика развития (XP)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="xp" stroke="#6C5CE7" strokeWidth={2} dot={{ fill: '#6C5CE7' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tests Results */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#6C5CE7]" />
            Результаты тестов
          </h3>
          <div className="space-y-2">
            {tests.map((test, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{test.name}</p>
                    <p className="text-xs text-gray-500">{test.date}</p>
                  </div>
                  <span className="text-lg font-bold text-[#6C5CE7]">{test.score}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6C5CE7] rounded-full"
                    style={{ width: `${test.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-3">Посещаемость кружков</h3>
          <div className="space-y-3">
            {clubs.map((club, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{club.name}</span>
                  <span className="text-sm font-bold text-green-600">{club.attendance}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${club.attendance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-3">Мои рекомендации</h3>
          <div className="space-y-2">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-3 rounded-xl border-2 ${
                  rec.priority === 'high'
                    ? 'bg-purple-50 border-[#6C5CE7]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm text-[#6C5CE7]">{rec.title}</p>
                  {rec.priority === 'high' && (
                    <span className="text-xs bg-[#6C5CE7] text-white px-2 py-0.5 rounded-full">
                      Приоритет
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600">{rec.reason}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 bg-purple-100 text-[#6C5CE7] rounded-xl font-medium hover:bg-purple-200 transition-colors text-sm">
            Добавить рекомендацию
          </button>
        </div>
      </div>
    </div>
  );
}
