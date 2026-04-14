import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, Search, Filter, TrendingUp } from 'lucide-react';
import { OrgTabBar } from '../../components/OrgTabBar';
import { getOrgStudents } from '../../lib/organization';
import { getOrganizationProfileByUserId } from '../../lib/users';
import { useAuth } from '../../contexts/AuthContext';

interface Student {
  id: string;
  full_name: string;
  age: number;
  group_name: string;
  course_title: string;
  status: string;
  enrolled_at: string;
}

export function OrgStudents() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    if (user) {
      loadStudents();
    }
  }, [user]);

  const loadStudents = async () => {
    if (!user) return;
    
    try {
      const orgProfile = await getOrganizationProfileByUserId(user.id);
      if (orgProfile) {
        const data = await getOrgStudents(orgProfile.id);
        setStudents(data as any);
      }
    } catch (error) {
      console.error('Ошибка загрузки учеников:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === 'all' || student.course_title === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const courses = Array.from(new Set(students.map(s => s.course_title)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Ученики</h1>
            <p className="text-sm opacity-90 mt-1">База всех учеников организации</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени..."
            className="w-full pl-11 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:bg-white/30 transition-all outline-none"
          />
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-orange-600">{students.length}</div>
            <div className="text-xs text-gray-600 mt-1">Всего</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Активных</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-gray-600">{courses.length}</div>
            <div className="text-xs text-gray-600 mt-1">Курсов</div>
          </div>
        </div>

        {/* Filter */}
        {courses.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Фильтр по курсу</span>
            </div>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="all">Все курсы</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Students List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Загрузка...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'Ничего не найдено' : 'Нет учеников'}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Попробуйте изменить параметры поиска'
                : 'Ученики появятся после записи на курсы'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/organization/students/${student.id}`)}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {student.full_name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{student.full_name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{student.age} лет</p>

                    {/* Course Info */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Курс:</span>
                        <span className="text-xs font-medium text-gray-700">{student.course_title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Группа:</span>
                        <span className="text-xs font-medium text-gray-700">{student.group_name}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/organization/students/${student.id}`);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        Успеваемость
                      </button>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {student.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
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