import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { createCourseGroup, getOrgCourses, getOrgTeachers } from '../../lib/organization';
import { getOrganizationProfileByUserId } from '../../lib/users';
import { useAuth } from '../../contexts/AuthContext';
import { useOrgProfile } from '../../hooks/useOrgProfile';

type WeekDay = {
  day: string;
  label: string;
  selected: boolean;
};

type TimeSlot = {
  startTime: string;
  endTime: string;
};

export function OrgGroupCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orgProfile, loading: profileLoading } = useOrgProfile();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    course_id: '',
    group_name: '',
    max_students: 10,
    teacher_id: '',
  });

  const [weekDays, setWeekDays] = useState<WeekDay[]>([
    { day: 'monday', label: 'Пн', selected: false },
    { day: 'tuesday', label: 'Вт', selected: false },
    { day: 'wednesday', label: 'Ср', selected: false },
    { day: 'thursday', label: 'Чт', selected: false },
    { day: 'friday', label: 'Пт', selected: false },
    { day: 'saturday', label: 'Сб', selected: false },
    { day: 'sunday', label: 'Вс', selected: false },
  ]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { startTime: '10:00', endTime: '11:30' }
  ]);

  useEffect(() => {
    if (orgProfile?.id) {
      loadData();
    }
  }, [orgProfile]);

  const loadData = async () => {
    if (!orgProfile?.id) return;

    try {
      console.log('📚 Загрузка курсов и учителей для организации:', orgProfile.id);
      const [coursesData, teachersData] = await Promise.all([
        getOrgCourses(orgProfile.id),
        getOrgTeachers(orgProfile.id)
      ]);
      console.log('✅ Курсы загружены:', coursesData);
      console.log('✅ Учителя загружены:', teachersData);
      setCourses(coursesData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('❌ Ошибка загрузки данных:', error);
    }
  };

  const toggleWeekDay = (index: number) => {
    setWeekDays(prev => prev.map((day, i) => 
      i === index ? { ...day, selected: !day.selected } : day
    ));
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '10:00', endTime: '11:30' }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setTimeSlots(prev => prev.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const generateScheduleString = () => {
    const selectedDays = weekDays.filter(d => d.selected).map(d => d.label).join(', ');
    const times = timeSlots.map(slot => `${slot.startTime}-${slot.endTime}`).join('; ');
    return `${selectedDays}: ${times}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgProfile?.id) {
      alert('Профиль организации не найден');
      return;
    }

    if (!formData.course_id) {
      alert('Выберите курс');
      return;
    }

    if (!formData.group_name.trim()) {
      alert('Введите название группы');
      return;
    }

    const selectedDaysCount = weekDays.filter(d => d.selected).length;
    if (selectedDaysCount === 0) {
      alert('Выберите хотя бы один день недели');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Создание группы с данными:', {
        ...formData,
        schedule: generateScheduleString()
      });

      const group = await createCourseGroup({
        course_id: formData.course_id,
        group_name: formData.group_name,
        schedule: generateScheduleString(),
        max_students: formData.max_students,
        teacher_id: formData.teacher_id || undefined,
      });

      console.log('✅ Группа создана:', group);
      alert('Группа успешно создана!');
      navigate('/organization/groups');
    } catch (error) {
      console.error('❌ Ошибка при создании группы:', error);
      alert('Ошибка при создании группы');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Создать группу</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Выбор курса */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-3">Курс</h3>
          {courses.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-3">Сначала создайте курс</p>
              <button
                type="button"
                onClick={() => navigate('/organization/courses/create')}
                className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-4 py-2 rounded-xl font-medium"
              >
                Создать курс
              </button>
            </div>
          ) : (
            <select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Выберите курс</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Название группы */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-3">Название группы</h3>
          <input
            type="text"
            value={formData.group_name}
            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
            placeholder="Например: Группа А, Начинающие, 7-9 лет"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Дни недели */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-3">Дни занятий</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <button
                key={day.day}
                type="button"
                onClick={() => toggleWeekDay(index)}
                className={`h-12 rounded-xl font-medium transition-all ${
                  day.selected
                    ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Время занятий */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Время занятий</h3>
            <button
              type="button"
              onClick={addTimeSlot}
              className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Добавить</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <span className="text-gray-400">—</span>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                {timeSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Преподаватель */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-3">Преподаватель</h3>
          {teachers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-3">Нет добавленных преподавателей</p>
              <button
                type="button"
                onClick={() => navigate('/organization/staff/add')}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Добавить преподавателя
              </button>
            </div>
          ) : (
            <select
              value={formData.teacher_id}
              onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Не назначен</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name} {teacher.specialization && `(${teacher.specialization})`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Максимальное количество учеников */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold mb-3">Максимальное количество учеников</h3>
          <input
            type="number"
            min="1"
            max="50"
            value={formData.max_students}
            onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Предпросмотр расписания */}
        {weekDays.some(d => d.selected) && (
          <div className="bg-orange-50 rounded-2xl p-5">
            <h3 className="font-semibold mb-2 text-orange-900">Расписание</h3>
            <p className="text-sm text-orange-800">{generateScheduleString()}</p>
          </div>
        )}

        {/* Кнопка создания */}
        <button
          type="submit"
          disabled={loading || courses.length === 0}
          className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Создание...' : 'Создать группу'}
        </button>
      </form>
    </div>
  );
}