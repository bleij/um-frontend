import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  BookOpen, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  GraduationCap,
  Award,
  AlertCircle
} from 'lucide-react';
import { getStudentById, getStudentStats, getStudentParent, getActivationByStudentId } from '../../lib/organization';

export function OrgStudentDetail() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [parent, setParent] = useState<any>(null);
  const [activation, setActivation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      loadStudentData();
    }
  }, [studentId]);

  const loadStudentData = async () => {
    if (!studentId) return;

    try {
      console.log('👨‍🎓 Загрузка данных ученика:', studentId);
      
      const studentData = await getStudentById(studentId);
      
      if (!studentData) {
        console.error('❌ Ученик не найден');
        setLoading(false);
        return;
      }

      const [statsData, parentData, activationData] = await Promise.all([
        getStudentStats(studentId),
        studentData.parent_id ? getStudentParent(studentData.parent_id) : null,
        getActivationByStudentId(studentId)
      ]);

      console.log('✅ Данные ученика загружены:', {
        student: studentData,
        stats: statsData,
        parent: parentData,
        activation: activationData
      });

      setStudent(studentData);
      setStats(statsData);
      setParent(parentData);
      setActivation(activationData);
    } catch (error) {
      console.error('❌ Ошибка загрузки данных ученика:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Присутствовал';
      case 'absent':
        return 'Отсутствовал';
      case 'late':
        return 'Опоздал';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Ученик не найден</div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">Профиль ученика</h1>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {student.full_name.charAt(0)}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{student.full_name}</h2>
              <p className="text-sm opacity-90 mb-2">{student.age} лет</p>
              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getLevelColor(student.course_level)}`}>
                {getLevelLabel(student.course_level)}
              </span>
            </div>
          </div>

          {/* Course Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 opacity-90" />
              <span className="text-sm font-medium">{student.course_title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 opacity-90" />
              <span className="text-sm">{student.group_name}</span>
            </div>
            {student.teacher_name && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 opacity-90" />
                <span className="text-sm">{student.teacher_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalClasses || 0}</div>
                <div className="text-xs text-gray-600">Занятий</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats?.attendanceRate || 0}%</div>
                <div className="text-xs text-gray-600">Посещаемость</div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Details */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            Детальная статистика
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.presentCount || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Присутствовал</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{stats?.absentCount || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Отсутствовал</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats?.lateCount || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Опозданий</div>
            </div>
          </div>
        </div>

        {/* Recent Attendance */}
        {stats?.recentAttendance && stats.recentAttendance.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              История посещаемости
            </h3>

            <div className="space-y-2">
              {stats.recentAttendance.map((record: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(record.status)}
                    <div>
                      <div className="text-sm font-medium">{getStatusLabel(record.status)}</div>
                      <div className="text-xs text-gray-600">{formatDate(record.date)}</div>
                    </div>
                  </div>
                  {record.notes && (
                    <div className="text-xs text-gray-500 max-w-[120px] truncate">
                      {record.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parent Contact */}
        {parent && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              Контакт родителя
            </h3>

            <div className="space-y-3">
              {parent.full_name && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-600">Имя</div>
                    <div className="text-sm font-medium">{parent.full_name}</div>
                  </div>
                </div>
              )}
              
              {parent.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-600">Телефон</div>
                    <div className="text-sm font-medium">{parent.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activation Details */}
        {activation && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Статус активации
            </h3>

            <div className="bg-green-50 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Курс активирован</span>
              </div>
              <p className="text-sm text-green-700">
                Ученик подтвердил начало обучения
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-600">Дата активации</div>
                  <div className="text-sm font-medium">{formatDate(activation.activated_at)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!activation && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Статус активации
            </h3>

            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Ожидает активации</span>
              </div>
              <p className="text-sm text-yellow-700">
                Курс будет активирован при первом посещении ученика
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}