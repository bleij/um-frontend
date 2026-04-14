import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, GraduationCap, Phone, Mail, Star, Users, Calendar, BookOpen } from 'lucide-react';
import { getTeacherById, getTeacherGroups, getTeacherStudents } from '../../lib/organization';

export function OrgStaffDetail() {
  console.log('🎯 OrgStaffDetail компонент загружен');
  
  const navigate = useNavigate();
  const { staffId } = useParams();
  
  console.log('📌 staffId из useParams:', staffId);
  
  const [teacher, setTeacher] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (staffId) {
      loadTeacherData();
    }
  }, [staffId]);

  const loadTeacherData = async () => {
    if (!staffId) return;

    try {
      console.log('👨‍🏫 Загрузка данных преподавателя:', staffId);
      
      const [teacherData, groupsData, studentsData] = await Promise.all([
        getTeacherById(staffId),
        getTeacherGroups(staffId),
        getTeacherStudents(staffId)
      ]);

      console.log('✅ Данные преподавателя загружены:', {
        teacher: teacherData,
        groups: groupsData,
        students: studentsData
      });

      setTeacher(teacherData);
      setGroups(groupsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('❌ Ошибка загрузки данных преподавателя:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">Активен</span>;
      case 'invited':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">Приглашен</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">Неактивен</span>;
      default:
        return null;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Преподаватель не найден</div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">Преподаватель</h1>
          </div>
        </div>

        {/* Teacher Profile Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {teacher.full_name.charAt(0)}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{teacher.full_name}</h2>
              {teacher.specialization && (
                <p className="text-sm opacity-90 mb-2">{teacher.specialization}</p>
              )}
              {getStatusBadge(teacher.status)}
            </div>
          </div>

          {/* Rating */}
          {teacher.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{teacher.rating.toFixed(1)}</span>
              <span className="text-sm opacity-90">(0 отзывов)</span>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 opacity-90" />
              <span className="text-sm">{teacher.phone}</span>
            </div>
            {teacher.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 opacity-90" />
                <span className="text-sm truncate">{teacher.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{groups.length}</div>
                <div className="text-xs text-gray-600">Групп</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
                <div className="text-xs text-gray-600">Учеников</div>
              </div>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-orange-600" />
            Группы преподавателя
          </h3>

          {groups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>У преподавателя пока нет групп</p>
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
                      <h4 className="font-semibold text-gray-900 mb-1">{group.group_name}</h4>
                      <p className="text-sm text-gray-600">{group.course_title}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getLevelColor(group.course_level)}`}>
                      {getLevelLabel(group.course_level)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {group.schedule && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="line-clamp-1">{group.schedule}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{group.current_students || 0} / {group.max_students}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Students List */}
        {students.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              Ученики преподавателя
            </h3>

            <div className="space-y-2">
              {students.map((student: any) => (
                <div
                  key={student.id}
                  onClick={() => navigate(`/organization/students/${student.id}`)}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 hover:text-orange-600 transition-colors">{student.full_name}</p>
                      <p className="text-sm text-gray-500">{student.age} лет • {student.group_name}</p>
                    </div>
                    <div className="text-xs text-gray-500">{student.course_title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {teacher.status === 'invited' && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold mb-3">Действия</h3>
            <button className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors">
              Отправить повторное приглашение
            </button>
          </div>
        )}
      </div>
    </div>
  );
}