import { Home, Calendar, BookOpen, BarChart3, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface NavItem {
  icon: any;
  label: string;
  path: string;
}

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/20 mx-auto shadow-2xl px-6 py-4 rounded-t-[30px]" style={{ maxWidth: '480px' }}>
      <div className="flex items-center justify-around">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] text-white shadow-lg scale-110' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              
            </button>
          );
        })}
      </div>
    </div>
  );
}