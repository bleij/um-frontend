import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем в соответствующий dashboard
    if (user) {
      switch (user.role) {
        case 'parent':
          navigate('/parent');
          break;
        case 'child':
          navigate('/child');
          break;
        case 'teen':
          navigate('/teen');
          break;
        case 'young-adult':
          navigate('/young-adult');
          break;
        case 'organization':
          navigate('/organization');
          break;
        case 'mentor':
          navigate('/mentor');
          break;
        default:
          // Если роль не определена, остаемся на welcome
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] flex flex-col items-center justify-between px-6 py-8">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center text-white text-sm">
        
        <div className="flex gap-1">
          <div className="w-4 h-3 bg-white/30 rounded-sm" />
          <div className="w-4 h-3 bg-white/60 rounded-sm" />
          <div className="w-4 h-3 bg-white/90 rounded-sm" />
        </div>
      </div>

      {/* Logo Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[120px] font-black text-white leading-none tracking-tight">
            UM
          </h1>
          <div className="mt-4 space-y-1">
            <div className="h-2 w-32 bg-white/20 rounded-full mx-auto" />
            <div className="h-2 w-24 bg-white/20 rounded-full mx-auto" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md space-y-4 pb-8">
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-white text-[#6C5CE7] rounded-3xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Войти
        </button>
        <button
          onClick={() => navigate('/role-select')}
          className="w-full py-4 bg-[#5548C8] text-white rounded-3xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Регистрация
        </button>
      </div>
    </div>
  );
}