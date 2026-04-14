import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, BookOpen, Users, DollarSign, Edit, Eye } from 'lucide-react';
import { OrgTabBar } from '../../components/OrgTabBar';
import { getOrgCourses } from '../../lib/organization';
import { getOrganizationProfileByUserId } from '../../lib/users';
import { useAuth } from '../../contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  skills: string;
  status: string;
}

export function OrgCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    if (!user) return;
    
    try {
      const orgProfile = await getOrganizationProfileByUserId(user.id);
      if (orgProfile) {
        const data = await getOrgCourses(orgProfile.id);
        setCourses(data as any);
      }
    } catch (error) {
      console.error('Ошибка загрузки курсов:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">Курсы</h1>
            <p className="text-sm opacity-90 mt-1">Управление образовательными программами</p>
          </div>
          <button
            onClick={() => navigate('/organization/courses/create')}
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
            <div className="text-2xl font-bold text-orange-600">{courses.length}</div>
            <div className="text-xs text-gray-600 mt-1">Всего курсов</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-green-600">
              {courses.filter(c => c.status === 'active').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Активных</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-gray-600">0</div>
            <div className="text-xs text-gray-600 mt-1">Черновиков</div>
          </div>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Загрузка...</div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет курсов</h3>
            <p className="text-gray-500 mb-4">Создайте свой первый курс</p>
            <button
              onClick={() => navigate('/organization/courses/create')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Создать курс
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {getLevelLabel(course.level)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{course.price.toLocaleString()} ₸</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>0 учеников</span>
                  </div>
                </div>

                {/* Skills Tags */}
                {course.skills && course.skills !== '[]' && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {JSON.parse(course.skills).slice(0, 3).map((skill: any, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg">
                        {skill.name} +{skill.value}%
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/organization/courses/${course.id}`)}
                    className="flex-1 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl font-medium hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Просмотр
                  </button>
                  <button
                    onClick={() => navigate(`/organization/courses/${course.id}/edit`)}
                    className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Редактировать
                  </button>
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