import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, BookOpen, Plus, X } from 'lucide-react';
import { getCourseById, updateCourse } from '../../lib/organization';
import { useOrgProfile } from '../../hooks/useOrgProfile';

interface Skill {
  name: string;
  value: number;
}

export function OrgCourseEdit() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { orgProfile, loading: profileLoading } = useOrgProfile();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [course, setCourse] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'beginner',
    price: '',
    status: 'active',
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', value: 10 });

  const skillOptions = [
    'Логика',
    'Креативность',
    'Работа в команде',
    'Лидерство',
    'Критическое мышление',
    'Коммуникация',
    'Эмпатия',
    'Самоорганизация',
    'Программирование',
    'Дизайн',
    'Математика',
    'Язык',
  ];

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    if (!courseId) return;

    try {
      const courseData = await getCourseById(courseId);
      
      if (courseData) {
        setCourse(courseData);
        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          level: courseData.level || 'beginner',
          price: courseData.price?.toString() || '0',
          status: courseData.status || 'active',
        });
        
        // Загружаем навыки
        if (courseData.skills && courseData.skills !== '[]') {
          try {
            const parsedSkills = JSON.parse(courseData.skills);
            setSkills(parsedSkills);
          } catch (e) {
            console.error('Ошибка парсинга навыков:', e);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки курса:', error);
      alert('Ошибка при загрузке курса');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    if (newSkill.name && newSkill.value > 0) {
      setSkills([...skills, { ...newSkill }]);
      setNewSkill({ name: '', value: 10 });
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId) {
      alert('ID курса не найден');
      return;
    }

    if (!orgProfile) {
      alert('Профиль организации не загружен');
      return;
    }
    
    if (skills.length === 0) {
      alert('Добавьте хотя бы один навык');
      return;
    }
    
    setSubmitting(true);
    
    try {
      console.log('📝 Обновление курса:', courseId);

      await updateCourse(courseId, {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        price: parseFloat(formData.price) || 0,
        skills: JSON.stringify(skills),
        status: formData.status,
      });
      
      console.log('✅ Курс обновлен успешно');
      navigate(`/organization/courses/${courseId}`);
    } catch (error) {
      console.error('❌ Ошибка обновления курса:', error);
      alert('Ошибка при обновлении курса: ' + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Курс не найден</h2>
          <p className="text-gray-600 mb-6">
            Не удалось загрузить данные курса. Пожалуйста, вернитесь назад и попробуйте снова.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Редактировать курс</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              Основная информация
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название курса *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Например: Робототехника для начинающих"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Расскажите о курсе, что будут изучать дети..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Уровень *</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="beginner">Начальный</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутый</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₸/месяц) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="active">Активный</option>
                  <option value="draft">Черновик</option>
                  <option value="archived">Архивный</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Развиваемые навыки</h2>
            <p className="text-sm text-gray-600 mb-4">
              Укажите, какие навыки развивает курс и на сколько процентов
            </p>

            {/* Add Skill */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Выберите навык</label>
                <select
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="">Выберите навык</option>
                  {skillOptions.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={addSkill}
                disabled={!newSkill.name}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-medium hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Добавить навык
              </button>
            </div>

            {/* Skills List */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Добавленные навыки:</p>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-purple-50 rounded-xl"
                  >
                    <div>
                      <span className="font-medium text-purple-900">{skill.name}</span>
                      <span className="text-sm text-purple-600 ml-2">+{skill.value}%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="p-1 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-purple-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      </div>
    </div>
  );
}
