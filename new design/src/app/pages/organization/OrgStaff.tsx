import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, GraduationCap, Star, Phone, Mail } from 'lucide-react';
import { OrgTabBar } from '../../components/OrgTabBar';
import { getOrgTeachers } from '../../lib/organization';
import { getOrganizationProfileByUserId } from '../../lib/users';
import { useAuth } from '../../contexts/AuthContext';

interface Teacher {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  specialization: string;
  rating: number;
  status: string;
  photo_url?: string;
}

export function OrgStaff() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTeachers();
    }
  }, [user]);

  const loadTeachers = async () => {
    if (!user) return;
    
    try {
      const orgProfile = await getOrganizationProfileByUserId(user.id);
      if (orgProfile) {
        const data = await getOrgTeachers(orgProfile.id);
        setTeachers(data as any);
      }
    } catch (error) {
      console.error('Ошибка загрузки учителей:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Активен</span>;
      case 'invited':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Приглашен</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Неактивен</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">Учителя</h1>
            <p className="text-sm opacity-90 mt-1">Преподавательский состав</p>
          </div>
          <button
            onClick={() => navigate('/organization/staff/add')}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-orange-600">{teachers.length}</div>
            <div className="text-xs text-gray-600 mt-1">Всего</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-green-600">
              {teachers.filter(t => t.status === 'active').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Активных</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {teachers.filter(t => t.status === 'invited').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Приглашены</div>
          </div>
        </div>

        {/* Teachers List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Загрузка...</div>
        ) : teachers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет учителей</h3>
            <p className="text-gray-500 mb-4">Добавьте первого преподавателя</p>
            <button
              onClick={() => navigate('/organization/staff/add')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Добавить учителя
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {teacher.full_name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{teacher.full_name}</h3>
                        {teacher.specialization && (
                          <p className="text-sm text-gray-600">{teacher.specialization}</p>
                        )}
                      </div>
                      {getStatusBadge(teacher.status)}
                    </div>

                    {/* Rating */}
                    {teacher.rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{teacher.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">(0 отзывов)</span>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{teacher.phone}</span>
                      </div>
                      {teacher.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/organization/staff/${teacher.id}`)}
                        className="flex-1 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-100 transition-colors"
                      >
                        Подробнее
                      </button>
                      {teacher.status === 'invited' && (
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                          Напомнить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OrgTabBar />
    </div>
  );
}