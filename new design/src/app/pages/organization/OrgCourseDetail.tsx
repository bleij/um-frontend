import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, BookOpen, Users, DollarSign, Plus, Edit, Calendar, GraduationCap } from 'lucide-react';
import { getCourseById, getCourseGroups } from '../../lib/organization';
import { useOrgProfile } from '../../hooks/useOrgProfile';

export function OrgCourseDetail() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { orgProfile, loading: profileLoading } = useOrgProfile();
  
  const [course, setCourse] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    if (!courseId) return;

    try {
      console.log('📚 Загрузка данных курса:', courseId);
      
      const [courseData, groupsData] = await Promise.all([
        getCourseById(courseId),
        getCourseGroups(courseId)
      ]);

      console.log('✅ Данные курса загружены:', {
        course: courseData,
        groups: groupsData
      });

      setCourse(courseData);
      setGroups(groupsData);
    } catch (error) {
      console.error('❌ Ошибка загрузки данных курса:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Начальный';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return level;
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Курс не найден</div>
      </div>
    );
  }

  const skills = course.skills && course.skills !== '[]' ? JSON.parse(course.skills) : [];
  const totalStudents = groups.reduce((sum: number, group: any) => sum + (group.current_students || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                {getLevelLabel(course.level)}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/organization/courses/${courseId}/edit`)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold">{groups.length}</div>
            <div className="text-xs opacity-90">Групп</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold">{totalStudents}</div>
            <div className="text-xs opacity-90">Учеников</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold">{course.price?.toLocaleString() || 0}</div>
            <div className="text-xs opacity-90">₸ / месяц</div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Описание курса */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            Описание курса
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {course.description || 'Описание не указано'}
          </p>
        </div>

        {/* Навыки */}
        {skills.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold mb-3">Развиваемые навыки</h3>
            <div className="space-y-2">
              {skills.map((skill: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <span className="text-purple-900 font-medium">{skill.name}</span>
                  <span className="text-purple-600 font-bold">+{skill.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Группы */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Группы курса</h3>
            <button
              onClick={() => navigate(`/organization/groups/create?courseId=${courseId}`)}
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Добавить</span>
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="mb-4">У курса пока нет групп</p>
              <button
                onClick={() => navigate(`/organization/groups/create?courseId=${courseId}`)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Создать первую группу
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group: any) => (
                <div
                  key={group.id}
                  onClick={() => navigate(`/organization/groups/${group.id}`)}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{group.group_name}</h4>
                      {group.teacher_name && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <GraduationCap className="w-4 h-4" />
                          <span>{group.teacher_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{group.current_students || 0} / {group.max_students}</span>
                    </div>
                  </div>
                  
                  {group.schedule && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{group.schedule}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
