import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  avatar?: string;
  dark?: boolean; // Темный режим (для светлых фонов)
  onNotificationClick?: () => void; // Обработчик для уведомлений
  backPath?: string; // Явный путь для кнопки "назад"
}

export function Header({ title, showBack = false, showNotifications = false, avatar, dark = false, onNotificationClick, backPath }: HeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex items-center justify-between px-6 py-4 ${dark ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBackClick}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${dark ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'} transition-all`}
            aria-label="Назад"
          >
            <ArrowLeft className={`w-6 h-6 ${dark ? 'text-gray-900' : 'text-white'}`} />
          </button>
        )}
        {title && <h1 className={`font-black text-2xl ${dark ? 'text-gray-900' : 'text-white'}`}>{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        {showNotifications && (
          <button 
            onClick={onNotificationClick}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${dark ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'} transition-all relative`}
          >
            <Bell className={`w-6 h-6 ${dark ? 'text-gray-900' : 'text-white'}`} />
            <span className={`absolute top-1 right-1 w-2.5 h-2.5 bg-${dark ? '[#6C5CE7]' : 'white'} rounded-full border-2 border-${dark ? 'white' : '[#6C5CE7]'}`}></span>
          </button>
        )}
        {avatar && (
          <div className={`w-10 h-10 rounded-full overflow-hidden ${dark ? 'bg-gray-200' : 'bg-white/20'} ring-2 ring-${dark ? 'gray-300' : 'white/40'}`}>
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}