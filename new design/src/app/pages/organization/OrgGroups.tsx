import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Users, Clock, GraduationCap, Calendar } from 'lucide-react';
import { OrgTabBar } from '../../components/OrgTabBar';
import { getAllOrgGroups } from '../../lib/organization';
import { getOrganizationProfileByUserId } from '../../lib/users';
import { useAuth } from '../../contexts/AuthContext';
import { useOrgProfile } from '../../hooks/useOrgProfile';

export function OrgGroups() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orgProfile, loading: profileLoading } = useOrgProfile();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgProfile?.id) {
      loadGroups();
    }
  }, [orgProfile]);

  const loadGroups = async () => {
    if (!orgProfile?.id) return;

    try {
      console.log('📚 Загрузка групп для организации:', orgProfile.id);
      const groupsData = await getAllOrgGroups(orgProfile.id);
      console.log('✅ Группы загружены:', groupsData);
      setGroups(groupsData);
    } catch (error) {
      console.error('❌ Ошибка загрузки групп:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Группы</h1>
          <button
            onClick={() => navigate('/organization/groups/create')}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm opacity-90">Всего групп: {groups.length}</p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-semibold text-lg mb-2">Нет групп</h3>
            <p className="text-gray-500 mb-4">Создайте первую группу для начала работы</p>
            <button
              onClick={() => navigate('/organization/groups/create')}
              className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Создать группу
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{group.group_name}</h3>
                  <p className="text-sm text-gray-600">{group.course_title}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  group.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {group.status === 'active' ? 'Активна' : 'Неактивна'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{group.current_students || 0}/{group.max_students} учеников</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{group.teacher_name || 'Не назначен'}</span>
                </div>
              </div>

              {group.schedule && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <Clock className="w-4 h-4" />
                  <span>{group.schedule}</span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/organization/groups/${group.id}`)}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-700 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <OrgTabBar />
    </div>
  );
}