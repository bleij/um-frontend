import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, Users, Calendar, CheckSquare, BarChart3, ClipboardList, GraduationCap, UsersRound, Scan } from 'lucide-react';
import { OrgTabBar } from '../../components/OrgTabBar';
import { QRScanner } from '../../components/QRScanner';
import { getOrgStats } from '../../lib/organization';
import { getOrganizationProfileByUserId } from '../../lib/users';
import { useAuth } from '../../contexts/AuthContext';

export function OrgDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orgProfile, setOrgProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    teachers: 0,
    groups: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;
    
    try {
      const profile = await getOrganizationProfileByUserId(user.id);
      setOrgProfile(profile);
      
      if (profile) {
        const statsData = await getOrgStats(profile.id);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [
    { label: 'Курсов', value: stats.courses, icon: BookOpen, color: 'bg-purple-100 text-[#6C5CE7]' },
    { label: 'Групп', value: stats.groups, icon: UsersRound, color: 'bg-orange-100 text-orange-600' },
    { label: 'Учеников', value: stats.students, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Учителей', value: stats.teachers, icon: GraduationCap, color: 'bg-green-100 text-green-600' },
  ];

  const menuItems = [
    { icon: BookOpen, label: 'Курсы', path: '/organization/courses' },
    { icon: UsersRound, label: 'Группы', path: '/organization/groups' },
    { icon: GraduationCap, label: 'Учителя', path: '/organization/staff' },
    { icon: Users, label: 'Ученики', path: '/organization/students' },
    { icon: CheckSquare, label: 'Посещаемость', path: '/organization/attendance' },
    { icon: ClipboardList, label: 'Заявки', path: '/organization/applications' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Панель управления</h1>
            <p className="text-sm opacity-90">{orgProfile?.organization_name || 'Организация'}</p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
            {orgProfile?.organization_name?.charAt(0) || 'O'}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-5 pb-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statsDisplay.map((stat, index) => {
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Кнопка создания группы */}
        <div>
          <button
            onClick={() => navigate('/organization/groups/create')}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <UsersRound className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Создать группу</p>
                <p className="text-sm opacity-90">Добавить новую учебную группу</p>
              </div>
            </div>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Recent Activity */}
        {stats.courses > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-semibold text-lg">Последняя активность</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <p className="text-gray-600 text-center py-4">
                Здесь будет отображаться последняя активность
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowScanner(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-orange-600 to-red-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="Сканировать QR-код"
      >
        <Scan className="w-7 h-7 text-white" />
      </button>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onSuccess={(data) => {
            console.log('✅ Курс успешно активирован:', data);
            // Перезагружаем статистику после успешной активации
            loadDashboard();
          }}
        />
      )}

      <OrgTabBar />
    </div>
  );
}