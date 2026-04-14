import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Users, Clock, GraduationCap, UserPlus, Trash2 } from 'lucide-react';
import { getGroupById, getGroupStudents, getOrgTeachers, getAllChildren, enrollStudentToGroup, removeStudentFromGroup } from '../../lib/organization';
import { useAuth } from '../../contexts/AuthContext';
import { useOrgProfile } from '../../hooks/useOrgProfile';

export function OrgGroupDetail() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user } = useAuth();
  const { orgProfile, loading: profileLoading } = useOrgProfile();
  
  const [group, setGroup] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [availableChildren, setAvailableChildren] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState('');

  useEffect(() => {
    if (orgProfile?.id && groupId) {
      loadGroupData();
    }
  }, [orgProfile, groupId]);

  const loadGroupData = async () => {
    if (!orgProfile?.id || !groupId) return;

    try {
      console.log('📚 Загрузка данных группы:', groupId);
      
      const [groupData, studentsData, teachersData, childrenData] = await Promise.all([
        getGroupById(groupId),
        getGroupStudents(groupId),
        getOrgTeachers(orgProfile.id),
        getAllChildren()
      ]);

      console.log('✅ Данные группы загружены:', {
        group: groupData,
        students: studentsData,
        teachers: teachersData,
        children: childrenData
      });

      setGroup(groupData);
      setStudents(studentsData);
      setTeachers(teachersData);
      
      // Фильтруем детей, которые еще не добавлены в эту группу
      const enrolledIds = studentsData.map((s: any) => s.child_profile_id);
      const available = childrenData.filter((child: any) => !enrolledIds.includes(child.id));
      setAvailableChildren(available);
    } catch (error) {
      console.error('❌ Ошибка загрузки данных группы:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedChildId || !orgProfile?.id || !groupId) return;

    try {
      console.log('➕ Добавление ученика в группу:', {
        childId: selectedChildId,
        groupId
      });

      await enrollStudentToGroup({
        organization_id: orgProfile.id,
        child_profile_id: selectedChildId,
        group_id: groupId
      });

      console.log('✅ Ученик добавлен в группу');
      setShowAddStudent(false);
      setSelectedChildId('');
      loadGroupData(); // Перезагружаем данные
    } catch (error) {
      console.error('❌ Ошибка добавления ученика:', error);
      alert('Ошибка при добавлении ученика');
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm('Удалить ученика из группы?')) return;

    try {
      console.log('➖ Удаление ученика из группы:', studentId);
      await removeStudentFromGroup(studentId);
      console.log('✅ Ученик удален из группы');
      loadGroupData(); // Перезагружаем данные
    } catch (error) {
      console.error('❌ Ошибка удаления ученика:', error);
      alert('Ошибка при удалении ученика');
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Группа не найдена</div>
      </div>
    );
  }

  const teacher = teachers.find(t => t.id === group.teacher_id);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{group.group_name}</h1>
            <p className="text-sm opacity-90">{group.course_title}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Информация о группе */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-3">Информация</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                Учеников: {group.current_students || 0} / {group.max_students}
              </span>
            </div>
            
            {teacher && (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Преподаватель: {teacher.full_name}
                </span>
              </div>
            )}
            
            {group.schedule && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-gray-600 flex-1">{group.schedule}</span>
              </div>
            )}
          </div>
        </div>

        {/* Список учеников */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Ученики</h3>
            <button
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Добавить</span>
            </button>
          </div>

          {/* Форма добавления ученика */}
          {showAddStudent && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Выберите ученика</option>
                {availableChildren.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.full_name} ({child.age} лет)
                  </option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <button
                  onClick={handleAddStudent}
                  disabled={!selectedChildId}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-700 text-white px-4 py-2 rounded-xl font-medium disabled:opacity-50"
                >
                  Добавить
                </button>
                <button
                  onClick={() => {
                    setShowAddStudent(false);
                    setSelectedChildId('');
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-xl font-medium"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>В группе пока нет учеников</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((student: any) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div 
                    onClick={() => navigate(`/organization/students/${student.id}`)}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-medium text-gray-900 hover:text-orange-600 transition-colors">{student.full_name}</p>
                    <p className="text-sm text-gray-500">{student.age} лет</p>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(student.id)}
                    className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}