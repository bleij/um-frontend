import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Users, Check, X, Clock, TrendingUp } from 'lucide-react';
import { 
  getGroupStudents, 
  saveAttendance, 
  getAttendance,
  updateStudentProgress,
  type GroupStudent,
  type AttendanceRecord 
} from '../../lib/teacher';
import { toast } from 'sonner';

export function TeacherGroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState<GroupStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'attendance' | 'progress'>('attendance');
  const [selectedStudent, setSelectedStudent] = useState<GroupStudent | null>(null);
  
  // Посещаемость
  const [attendanceData, setAttendanceData] = useState<Map<string, 'present' | 'absent' | 'late'>>(new Map());
  const [todayDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Прогресс
  const [selectedSkill, setSelectedSkill] = useState('');
  const [progressNotes, setProgressNotes] = useState('');

  const skills = [
    { value: 'leadership', label: 'Лидерство', emoji: '👑' },
    { value: 'logic', label: 'Логика', emoji: '🧩' },
    { value: 'creativity', label: 'Креативность', emoji: '🎨' },
    { value: 'communication', label: 'Коммуникация', emoji: '💬' },
    { value: 'teamwork', label: 'Командная работа', emoji: '🤝' },
    { value: 'problem_solving', label: 'Решение задач', emoji: '🎯' }
  ];

  useEffect(() => {
    if (groupId) {
      loadStudents();
      loadTodayAttendance();
    }
  }, [groupId]);

  async function loadStudents() {
    try {
      setLoading(true);
      const groupStudents = await getGroupStudents(groupId!);
      setStudents(groupStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Ошибка загрузки учеников');
    } finally {
      setLoading(false);
    }
  }

  async function loadTodayAttendance() {
    try {
      const attendance = await getAttendance(groupId!, todayDate);
      const attendanceMap = new Map<string, 'present' | 'absent' | 'late'>();
      
      attendance.forEach((record: AttendanceRecord) => {
        attendanceMap.set(record.student_id, record.status);
      });
      
      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  }

  function toggleAttendance(studentId: string) {
    const currentStatus = attendanceData.get(studentId);
    let newStatus: 'present' | 'absent' | 'late';
    
    if (currentStatus === 'present') {
      newStatus = 'late';
    } else if (currentStatus === 'late') {
      newStatus = 'absent';
    } else {
      newStatus = 'present';
    }
    
    const newMap = new Map(attendanceData);
    newMap.set(studentId, newStatus);
    setAttendanceData(newMap);
  }

  async function handleSaveAttendance() {
    try {
      const attendance = Array.from(attendanceData.entries()).map(([studentId, status]) => ({
        studentId,
        status
      }));
      
      const success = await saveAttendance(groupId!, todayDate, attendance);
      
      if (success) {
        toast.success('Посещаемость сохранена');
      } else {
        toast.error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Ошибка сохранения');
    }
  }

  async function handleSaveProgress() {
    if (!selectedStudent || !selectedSkill) {
      toast.error('Выберите навык');
      return;
    }
    
    try {
      const success = await updateStudentProgress(
        selectedStudent.student_id,
        selectedSkill,
        1,
        progressNotes
      );
      
      if (success) {
        toast.success('Прогресс обновлен');
        setSelectedStudent(null);
        setSelectedSkill('');
        setProgressNotes('');
      } else {
        toast.error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Ошибка сохранения');
    }
  }

  const getStatusColor = (status?: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return 'bg-green-500 border-green-600';
      case 'late':
        return 'bg-yellow-500 border-yellow-600';
      case 'absent':
        return 'bg-red-500 border-red-600';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };

  const getStatusLabel = (status?: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return 'Присутствует';
      case 'late':
        return 'Опоздал';
      case 'absent':
        return 'Отсутствует';
      default:
        return 'Не отмечен';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5CE7] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/teacher/groups')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6C5CE7] to-[#A78BFA] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Группа</h1>
              <p className="text-sm text-gray-600">{students.length} учеников</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`
                flex-1 py-2.5 rounded-xl font-medium text-sm transition-all
                ${activeTab === 'attendance'
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              Посещаемость
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`
                flex-1 py-2.5 rounded-xl font-medium text-sm transition-all
                ${activeTab === 'progress'
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              Оценка прогресса
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 py-6">
        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Дата</p>
                <p className="font-semibold text-gray-900">
                  {new Date(todayDate).toLocaleDateString('ru-RU', { 
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
              <button
                onClick={handleSaveAttendance}
                className="px-6 py-2.5 bg-[#6C5CE7] text-white rounded-xl font-medium hover:bg-[#5548C8] transition-colors shadow-sm active:scale-95"
              >
                Сохранить
              </button>
            </div>

            {students.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">Нет учеников в группе</p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student) => {
                  const status = attendanceData.get(student.student_id);
                  
                  return (
                    <div
                      key={student.student_id}
                      onClick={() => toggleAttendance(student.student_id)}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                              {student.full_name.charAt(0)}
                            </div>
                            {status && (
                              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${getStatusColor(status)}`}>
                                {status === 'present' && <Check className="w-3 h-3 text-white" />}
                                {status === 'absent' && <X className="w-3 h-3 text-white" />}
                                {status === 'late' && <Clock className="w-3 h-3 text-white" />}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.full_name}</p>
                            <p className="text-sm text-gray-600">{student.age} лет</p>
                          </div>
                        </div>
                        
                        <div className={`
                          px-3 py-1.5 rounded-full text-xs font-medium
                          ${status === 'present' ? 'bg-green-100 text-green-700' : ''}
                          ${status === 'late' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${status === 'absent' ? 'bg-red-100 text-red-700' : ''}
                          ${!status ? 'bg-gray-100 text-gray-700' : ''}
                        `}>
                          {getStatusLabel(status)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-3">Легенда:</p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Присутствует</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Опоздал</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">Отсутствует</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            {!selectedStudent ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Выберите ученика для оценки прогресса
                </p>
                
                {students.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Нет учеников в группе</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {students.map((student) => (
                      <div
                        key={student.student_id}
                        onClick={() => setSelectedStudent(student)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                              {student.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{student.full_name}</p>
                              <p className="text-sm text-gray-600">{student.age} лет</p>
                            </div>
                          </div>
                          <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {/* Selected Student */}
                <div className="bg-gradient-to-r from-[#6C5CE7] to-[#A78BFA] rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedStudent.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedStudent.full_name}</p>
                      <p className="text-sm text-white/90">{selectedStudent.age} лет</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(null);
                      setSelectedSkill('');
                      setProgressNotes('');
                    }}
                    className="text-sm text-white/90 hover:text-white underline"
                  >
                    Выбрать другого ученика
                  </button>
                </div>

                {/* Skills Selection */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Выберите навык или достижение:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {skills.map((skill) => (
                      <button
                        key={skill.value}
                        onClick={() => setSelectedSkill(skill.value)}
                        className={`
                          p-4 rounded-2xl border-2 transition-all text-left
                          ${selectedSkill === skill.value
                            ? 'border-[#6C5CE7] bg-[#6C5CE7]/5'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="text-2xl mb-2">{skill.emoji}</div>
                        <p className="text-sm font-semibold text-gray-900">
                          {skill.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Комментарий (необязательно)
                  </label>
                  <textarea
                    value={progressNotes}
                    onChange={(e) => setProgressNotes(e.target.value)}
                    placeholder="Например: Отлично справился с логической задачей"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none"
                    rows={3}
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveProgress}
                  disabled={!selectedSkill}
                  className={`
                    w-full py-3.5 rounded-xl font-semibold transition-all shadow-sm
                    ${selectedSkill
                      ? 'bg-[#6C5CE7] text-white hover:bg-[#5548C8] active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  Сохранить прогресс
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
