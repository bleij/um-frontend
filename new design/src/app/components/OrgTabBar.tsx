import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, BookOpen, Users, GraduationCap, User } from 'lucide-react';

export function OrgTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: LayoutDashboard, label: 'Главная', path: '/organization' },
    { icon: BookOpen, label: 'Курсы', path: '/organization/courses' },
    { icon: GraduationCap, label: 'Учителя', path: '/organization/staff' },
    { icon: Users, label: 'Ученики', path: '/organization/students' },
    { icon: User, label: 'Профиль', path: '/organization/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive 
                  ? 'text-orange-600' 
                  : 'text-gray-500 hover:text-orange-400'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
