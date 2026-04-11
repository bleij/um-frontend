import { useNavigate } from 'react-router';
import { Users, Zap, Building2, UserCog, ArrowLeft } from 'lucide-react';
import { User } from '../lib/users';

export function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (roleType: User['role']) => {
    // Сохраняем выбранную роль в sessionStorage
    sessionStorage.setItem('selectedRole', roleType);
    // Переходим к форме регистрации
    navigate('/register');
  };

  const roles = [
    {
      title: 'Родитель',
      description: 'Управление профилями детей, бронирование занятий',
      icon: Users,
      path: '/create-profile-parent',
      gradient: 'from-[#6C5CE7] to-[#8B7FE8]',
      roleType: 'parent' as User['role'],
    },
    {
      title: 'Подросток (12-17 лет)',
      description: 'Цели, навыки и общение с ментором',
      icon: Zap,
      path: '/create-profile-teen',
      gradient: 'from-blue-500 to-blue-600',
      roleType: 'teen' as User['role'],
    },
    {
      title: 'Организация',
      description: 'Управление клубами и учениками',
      icon: Building2,
      path: '/create-profile-organization',
      gradient: 'from-orange-500 to-orange-600',
      roleType: 'organization' as User['role'],
    },
    {
      title: 'Ментор',
      description: 'Создание планов развития и поддержка',
      icon: UserCog,
      path: '/create-profile-mentor',
      gradient: 'from-teal-500 to-teal-600',
      roleType: 'mentor' as User['role'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8]">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-6 py-4 text-white text-sm">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-3 bg-white/30 rounded-sm" />
          <div className="w-4 h-3 bg-white/60 rounded-sm" />
          <div className="w-4 h-3 bg-white/90 rounded-sm" />
        </div>
      </div>

      {/* Back Button */}
      <div className="px-6 py-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
      </div>

      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-6xl font-black text-white mb-4">UM</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Выберите роль</h2>
        <p className="text-white/80 text-sm">
          Чтобы продолжить, укажите вашу роль
        </p>
      </div>

      {/* Roles Section */}
      <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8 min-h-[60vh]">
        <div className="space-y-4">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <button
                key={index}
                onClick={() => handleRoleSelect(role.roleType)}
                className="w-full p-5 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-lg text-gray-900">{role.title}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{role.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
