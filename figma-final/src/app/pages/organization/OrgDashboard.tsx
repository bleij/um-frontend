import { useNavigate } from 'react-router';
import { ArrowLeft, BookOpen, Users, Calendar, CheckSquare, BarChart3, ClipboardList } from 'lucide-react';

export function OrgDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Кружков', value: 8, icon: BookOpen, color: 'bg-purple-100 text-[#6C5CE7]' },
    { label: 'Учеников', value: 124, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Заявок', value: 15, icon: ClipboardList, color: 'bg-orange-100 text-orange-600' },
    { label: 'Посещаемость', value: '92%', icon: BarChart3, color: 'bg-green-100 text-green-600' },
  ];

  const clubs = [
    { id: 1, name: 'Художественная студия', students: 18, status: 'active' },
    { id: 2, name: 'Футбольная школа', students: 24, status: 'active' },
    { id: 3, name: 'Программирование', students: 15, status: 'active' },
    { id: 4, name: 'Музыкальная школа', students: 20, status: 'active' },
  ];

  const menuItems = [
    { icon: ClipboardList, label: 'Заявки', path: '/organization/applications', badge: 15 },
    { icon: Calendar, label: 'Расписание', path: '/organization' },
    { icon: CheckSquare, label: 'Посещаемость', path: '/organization/attendance' },
    { icon: ClipboardList, label: 'Задания', path: '/organization/tasks' },
    { icon: BarChart3, label: 'Отчеты', path: '/organization' },
    { icon: Users, label: 'Ученики', path: '/organization' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Панель управления</h1>
            <p className="text-sm opacity-90">Центр детского развития "Звездочка"</p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white">
            <img
              src="https://images.unsplash.com/photo-1664382951771-40432ecc81bd?w=200&h=200&fit=crop"
              alt="Организация"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-5 pb-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-5 rounded-2xl shadow-lg">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold text-lg mb-3 px-1">Быстрые действия</h3>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all relative"
                >
                  <Icon className="w-6 h-6 text-[#6C5CE7] mb-2" />
                  <p className="font-semibold text-sm">{item.label}</p>
                  {item.badge && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* My Clubs */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-semibold text-lg">Мои кружки</h3>
            <button className="text-[#6C5CE7] text-sm font-medium">+ Добавить</button>
          </div>
          <div className="space-y-2">
            {clubs.map((club) => (
              <div key={club.id} className="bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{club.name}</h4>
                    <p className="text-sm text-gray-500">{club.students} учеников</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Активен
                    </span>
                    <button className="text-[#6C5CE7] font-medium text-sm">
                      Изменить
                    </button>
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
