import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TeacherTabBar } from '../../components/TeacherTabBar';
import { Users, Clock, ChevronRight } from 'lucide-react';
import { getTeacherGroups, type TeacherGroup } from '../../lib/teacher';

export function TeacherGroups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<TeacherGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      setLoading(true);
      
      const storedTeacherId = localStorage.getItem('teacher_id');
      
      if (!storedTeacherId) {
        console.error('Teacher ID not found');
        return;
      }
      
      const teacherGroups = await getTeacherGroups(storedTeacherId);
      setGroups(teacherGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5CE7] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка групп...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Мои группы</h1>
          <p className="text-sm text-gray-600 mt-1">
            {groups.length} {groups.length === 1 ? 'группа' : 'групп'}
          </p>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 py-6">
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Нет групп</p>
            <p className="text-sm text-gray-500 mt-2">Вы пока не назначены на группы</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/teacher/groups/${group.id}`)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {group.group_name}
                    </h3>
                    <p className="text-sm text-[#6C5CE7] font-medium">
                      {group.course_title}
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 mt-1" />
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {group.current_students} / {group.max_students} учеников
                    </span>
                  </div>
                  
                  {group.schedule && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{group.schedule}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${group.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                    }
                  `}>
                    {group.status === 'active' ? 'Активна' : 'Неактивна'}
                  </div>
                  
                  {group.current_students >= group.max_students && (
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      Группа заполнена
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TeacherTabBar />
    </div>
  );
}
