import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TeacherTabBar } from '../../components/TeacherTabBar';
import { Building2, Star, Mail, Phone, Award, LogOut, User } from 'lucide-react';
import { getTeacherProfile, getTeacherOrganization, type Teacher } from '../../lib/teacher';

export function TeacherProfile() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      
      const storedTeacherId = localStorage.getItem('teacher_id');
      
      if (!storedTeacherId) {
        console.error('Teacher ID not found');
        navigate('/login');
        return;
      }
      
      const teacherProfile = await getTeacherProfile(storedTeacherId);
      
      if (teacherProfile) {
        setTeacher(teacherProfile);
        
        // Загружаем информацию об организации
        const org = await getTeacherOrganization(storedTeacherId);
        setOrganization(org);
      }
    } catch (error) {
      console.error('Error loading teacher profile:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('teacher_id');
    localStorage.removeItem('user_id');
    navigate('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5CE7] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Профиль не найден</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[#6C5CE7] text-white rounded-xl font-medium hover:bg-[#5548C8] transition-colors"
          >
            Вернуться к входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6C5CE7] to-[#A78BFA] pt-8 pb-24">
        <div className="max-w-[480px] mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-2">Мой профиль</h1>
          <p className="text-white/90 text-sm">Учитель</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-[480px] mx-auto px-4 -mt-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Avatar and Main Info */}
          <div className="p-6 text-center border-b border-gray-100">
            <div className="relative inline-block mb-4">
              {teacher.photo_url ? (
                <img
                  src={teacher.photo_url}
                  alt={teacher.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#A78BFA] flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`
                absolute -bottom-2 left-1/2 transform -translate-x-1/2
                px-3 py-1 rounded-full text-xs font-semibold
                ${teacher.status === 'active' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-400 text-white'
                }
              `}>
                {teacher.status === 'active' ? 'Активен' : 'Неактивен'}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {teacher.full_name}
            </h2>
            
            {teacher.specialization && (
              <p className="text-[#6C5CE7] font-medium mb-3">
                {teacher.specialization}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-xl text-gray-900">
                {teacher.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">рейтинг</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 space-y-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Контактная информация</h3>
            
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#6C5CE7]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Телефон</p>
                <p className="font-medium">{teacher.phone}</p>
              </div>
            </div>

            {teacher.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{teacher.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Organization */}
          {organization && (
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Организация</h3>
              
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  {organization.logo_url ? (
                    <img 
                      src={organization.logo_url} 
                      alt={organization.organization_name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {organization.organization_name}
                  </p>
                  {organization.organization_type && (
                    <p className="text-sm text-gray-600">
                      {organization.organization_type}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Достижения</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-[#6C5CE7]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-600">Группы</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-600">Учеников</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{teacher.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-600">Рейтинг</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Выйти
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
          <p className="text-xs text-gray-600 text-center">
            Дата регистрации: {new Date(teacher.created_at).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <TeacherTabBar />
    </div>
  );
}
