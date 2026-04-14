import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Home, Calendar, BookOpen, BarChart3, User, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useParentData } from '../../contexts/ParentDataContext';

export function ParentReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const { children } = useParentData();

  useEffect(() => {
    if (children.length > 0 && selectedChild === 'all') {
      setSelectedChild(children[0].id);
    }
  }, [children]);

  const attendanceData = [
    { month: 'Сен', attendance: 90 },
    { month: 'Окт', attendance: 85 },
    { month: 'Ноя', attendance: 95 },
    { month: 'Дек', attendance: 88 },
    { month: 'Янв', attendance: 92 },
    { month: 'Фев', attendance: 87 },
  ];

  const xpData = [
    { month: 'Сен', xp: 150 },
    { month: 'Окт', xp: 220 },
    { month: 'Ноя', xp: 180 },
    { month: 'Дек', xp: 250 },
    { month: 'Янв', xp: 300 },
    { month: 'Фев', xp: 280 },
  ];

  const skillsData = [
    { skill: 'Коммуникация', current: 85, previous: 75 },
    { skill: 'Лидерство', current: 65, previous: 55 },
    { skill: 'Креативность', current: 90, previous: 85 },
    { skill: 'Логика', current: 75, previous: 70 },
    { skill: 'Дисциплина', current: 70, previous: 65 },
  ];

  const completedTasks: any[] = [];
  const comments: any[] = [];

  const navItems = [
    { icon: Home, label: 'Главная', path: '/parent' },
    { icon: Calendar, label: 'Календарь', path: '/parent/calendar' },
    { icon: BookOpen, label: 'Кружки', path: '/parent/clubs' },
    { icon: BarChart3, label: 'Отчеты', path: '/parent/reports' },
    { icon: User, label: 'Профиль', path: '/parent/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Отчеты и аналитика" showBack={true} dark={true} backPath="/parent" />

      <div className="p-4 space-y-5">
        {/* Child Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {children.map((child) => (
            <button
              key={child.id}
              className={`px-4 py-2 ${
                selectedChild === child.id ? 'bg-[#6C5CE7] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } rounded-xl font-medium text-sm whitespace-nowrap`}
              onClick={() => setSelectedChild(child.id)}
            >
              {child.full_name}
            </button>
          ))}
          <button
            className={`px-4 py-2 ${
              selectedChild === 'all' ? 'bg-[#6C5CE7] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            } rounded-xl font-medium text-sm whitespace-nowrap`}
            onClick={() => setSelectedChild('all')}
          >
            Все дети
          </button>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-4">Посещаемость (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#6C5CE7" strokeWidth={2} dot={{ fill: '#6C5CE7' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* XP/Level Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-4">Прогресс XP</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="xp" fill="#6C5CE7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Trend */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#6C5CE7]" />
            <h3 className="font-semibold">Динамика навыков</h3>
          </div>
          <div className="space-y-3">
            {skillsData.map((skill) => (
              <div key={skill.skill}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{skill.previous}%</span>
                    <span className="text-sm font-semibold text-[#6C5CE7]">{skill.current}%</span>
                    {skill.current > skill.previous && (
                      <span className="text-xs text-green-600 font-medium">
                        +{skill.current - skill.previous}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6C5CE7] rounded-full transition-all"
                    style={{ width: `${skill.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3">Выполненные задания</h3>
          <div className="space-y-2">
            {completedTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.task}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {task.child} • {task.date}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#6C5CE7]">+{task.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3">Комментарии</h3>
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-[#6C5CE7]">{comment.from}</span>
                  <span className="text-xs text-gray-500">{comment.date}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-2xl border border-purple-100">
          <h3 className="font-semibold mb-2 text-[#6C5CE7]">Рекомендации AI</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            На основе анализа данных, рекомендуем добавить занятя по развитию лидерских качеств.
            Анна показывает высокую креативность, предлагаем театральную студию для комплексного развития.
          </p>
        </div>
      </div>

      <BottomNav items={navItems} />
    </div>
  );
}