import { useNavigate, useLocation } from 'react-router';
import { Home, Users, User } from 'lucide-react';

export function TeacherTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      icon: Home,
      label: 'Расписание',
      path: '/teacher',
      active: location.pathname === '/teacher'
    },
    {
      icon: Users,
      label: 'Группы',
      path: '/teacher/groups',
      active: location.pathname.startsWith('/teacher/groups')
    },
    {
      icon: User,
      label: 'Профиль',
      path: '/teacher/profile',
      active: location.pathname === '/teacher/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-[480px] mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                tab.active
                  ? 'text-[#6C5CE7]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${tab.active ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
