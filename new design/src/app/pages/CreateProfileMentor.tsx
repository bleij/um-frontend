import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Camera, MapPin, Globe, Award, Upload, Tag, DollarSign, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createMentorPending } from '../lib/users';
import { User } from '../lib/users';

export function CreateProfileMentor() {
  const navigate = useNavigate();
  const { user: contextUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [localUser, setLocalUser] = useState<User | null>(null);

  // Загружаем пользователя из localStorage при монтировании
  useEffect(() => {
    console.log('🔄 CreateProfileMentor: useEffect запущен');
    console.log('🔍 contextUser:', contextUser);
    console.log('🔍 authLoading:', authLoading);

    if (!authLoading) {
      if (contextUser) {
        console.log('✅ Используем пользователя из контекста:', contextUser);
        setLocalUser(contextUser);
      } else {
        // Пытаемся загрузить из localStorage
        const storedUserJson = localStorage.getItem('currentUser');
        console.log('🔍 localStorage currentUser:', storedUserJson);
        if (storedUserJson) {
          try {
            const storedUser = JSON.parse(storedUserJson);
            console.log('✅ Пользователь загружен из localStorage:', storedUser);
            setLocalUser(storedUser);
          } catch (error) {
            console.error('❌ Ошибка парсинга пользователя из localStorage:', error);
          }
        } else {
          console.error('❌ Пользователь не найден ни в контексте, ни в localStorage');
        }
      }
    }
  }, [contextUser, authLoading]);

  // Показываем загрузку пока проверяется авторизация
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  // Используем либо пользователя из контекста, либо из localStorage
  const user = contextUser || localUser;

  const [formData, setFormData] = useState({
    // Шаг 1: Личная визитка
    photo: null as File | null,
    photoPreview: '',
    fullName: '',
    city: '',
    languages: [] as string[],

    // Шаг 2: Профессиональный фильтр
    specialization: '',
    experienceYears: '',
    education: '',
    certificate: null as File | null,
    skills: [] as string[],
    customSkill: '',

    // Шаг 3: Маркетинг и продажи
    pitch: '',
    bio: '',
    sessionPrice: '',
  });

  const cities = [
    'Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе',
    'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Семей', 'Атырау',
    'Костанай', 'Кызылорда', 'Уральск', 'Петропавловск', 'Актау'
  ];

  const specializations = [
    'Психолог',
    'Профориентолог',
    'Тьютор по Hard Skills',
    'Тренер по Soft Skills'
  ];

  const predefinedSkills = [
    '#Лидерство', '#ЭмоциональныйИнтеллект', '#IT', '#КритическоеМышление',
    '#Креативность', '#Коммуникация', '#Тайм-менеджмент', '#Командная работа',
    '#Программирование', '#Дизайн', '#Публичные выступления', '#Конфликты'
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file, photoPreview: URL.createObjectURL(file) });
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, certificate: file });
    }
  };

  const toggleLanguage = (lang: string) => {
    const languages = formData.languages.includes(lang)
      ? formData.languages.filter(l => l !== lang)
      : [...formData.languages, lang];
    setFormData({ ...formData, languages });
  };

  const toggleSkill = (skill: string) => {
    const skills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills });
  };

  const addCustomSkill = () => {
    if (formData.customSkill.trim() && !formData.skills.includes(formData.customSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.customSkill.trim()],
        customSkill: ''
      });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const canProceedStep1 = formData.fullName.trim() && formData.city && formData.languages.length > 0;
  const canProceedStep2 = formData.specialization && formData.experienceYears && formData.education.trim();
  const canSubmit = formData.pitch.trim() && formData.bio.trim() && formData.sessionPrice;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔍 handleSubmit - проверка пользователя:', user);

    if (!user) {
      console.error('❌ Пользователь не найден');
      alert('Ошибка: пользователь не авторизован. Пожалуйста, войдите в систему заново.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // В реальном приложении здесь была бы загрузка файлов
      const photoUrl = formData.photoPreview || '';
      const certificateUrl = formData.certificate ? 'uploaded_certificate.pdf' : '';

      console.log('🔄 Создание заявки ментора для user_id:', user.id);

      const mentorPending = await createMentorPending({
        user_id: user.id,
        full_name: formData.fullName,
        photo_url: photoUrl,
        city: formData.city,
        languages: JSON.stringify(formData.languages),
        specialization: formData.specialization,
        experience_years: parseInt(formData.experienceYears) || 0,
        education: formData.education,
        certificate_url: certificateUrl,
        skills: JSON.stringify(formData.skills),
        pitch: formData.pitch,
        bio: formData.bio,
        session_price: parseInt(formData.sessionPrice) || 0,
      });

      console.log('Заявка ментора отправлена на модерацию:', mentorPending);

      // Сохраняем ID заявки
      localStorage.setItem('mentorPendingId', mentorPending.id);

      // Переходим на страницу успеха
      navigate('/mentor-pending-success');
    } catch (error) {
      console.error('Ошибка отправки заявки ментора:', error);
      alert('Ошибка при сохранении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] flex flex-col">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-6 py-4 text-white text-sm">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-3 bg-white/30 rounded-sm" />
          <div className="w-4 h-3 bg-white/60 rounded-sm" />
          <div className="w-4 h-3 bg-white/90 rounded-sm" />
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-2">
        <button
          onClick={currentStep === 1 ? () => navigate(-1) : handleBack}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium">Шаг {currentStep} из {totalSteps}</span>
          <span className="text-white/80 text-sm">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="px-6 py-4 text-center">
        
        <p className="text-white/80 text-sm">
          {currentStep === 1 && 'Это то, что родитель увидит в первую очередь'}
          {currentStep === 2 && 'Данные для системы и администратора'}
          {currentStep === 3 && 'Дополнительная информация'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          {/* Шаг 1: Личная визитка */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Загрузка фото */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-[#6C5CE7] overflow-hidden flex items-center justify-center">
                    {formData.photoPreview ? (
                      <img src={formData.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#6C5CE7] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#5548C8] transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-gray-500 text-sm mt-3">Загрузите профессиональное фото</p>
              </div>

              {/* ФИО */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ФИО *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              {/* Город */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6C5CE7]" />
                  Город *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
                >
                  <option value="">Выберите город</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Языки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#6C5CE7]" />
                  Языки *
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Казахский', 'Русский', 'Английский'].map(lang => (
                    <label
                      key={lang}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.languages.includes(lang)
                          ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-[#6C5CE7]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                        className="hidden"
                      />
                      <span>{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedStep1}
                className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all ${
                  canProceedStep1
                    ? 'bg-[#6C5CE7] text-white hover:bg-[#5548C8] hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Далее
              </button>
            </div>
          )}

          {/* Шаг 2: Профессиональный фильтр */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Специализация */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#6C5CE7]" />
                  Основная специализация *
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
                >
                  <option value="">Выберите специализацию</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Стаж работы */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Стаж работы (лет) *</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
                  placeholder="5"
                />
              </div>

              {/* Учебное заведение */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Учебное заведение *</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
                  placeholder="Казахский Национальный Университет им. аль-Фараби"
                />
              </div>

              {/* Загрузка сертификата */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#6C5CE7]" />
                  Диплом/сертификат (для администратора)
                </label>
                <label className="w-full px-4 py-4 bg-white border-2 border-dashed border-[#6C5CE7] rounded-2xl cursor-pointer hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5 text-[#6C5CE7]" />
                  <span className="text-gray-600">
                    {formData.certificate ? formData.certificate.name : 'Загрузить файл'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleCertificateChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Ключевые навыки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#6C5CE7]" />
                  Ключевые навыки (теги)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {predefinedSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.skills.includes(skill)
                          ? 'bg-[#6C5CE7] text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#6C5CE7]'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                {/* Свой тег */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customSkill}
                    onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    className="flex-1 px-4 py-3 bg-white border-2 border-[#6C5CE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-1 transition-all"
                    placeholder="Добавить свой навык"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-3 bg-[#6C5CE7] text-white rounded-xl hover:bg-[#5548C8] transition-all"
                  >
                    +
                  </button>
                </div>

                {/* Выбранные навыки */}
                {formData.skills.length > 0 && (
                  <div className="mt-3 p-4 bg-white rounded-xl border-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Выбрано:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#6C5CE7]/10 text-[#6C5CE7] rounded-lg text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedStep2}
                className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all ${
                  canProceedStep2
                    ? 'bg-[#6C5CE7] text-white hover:bg-[#5548C8] hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Далее
              </button>
            </div>
          )}

          {/* Шаг 3: Дополнительная информация */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Цепляющий заголовок */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
                  Чему обучите? *
                </label>
                <input
                  type="text"
                  name="pitch"
                  value={formData.pitch}
                  onChange={handleChange}
                  maxLength={60}
                  className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
                  placeholder="Научу вашего ребенка не бояться публичных выступлений"
                />
                <p className="text-gray-500 text-xs mt-1 text-right">{formData.pitch.length}/60</p>
              </div>

              {/* О себе / О методе */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">О себе / О методе *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all resize-none"
                  placeholder="Расскажите, как проходят ваши сессии, какие методы вы используете, какие результаты получают ваши ученики..."
                />
              </div>

              {/* Стоимость сессии */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#6C5CE7]" />
                  Стоимость сессии (60 минут) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="sessionPrice"
                    value={formData.sessionPrice}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-4 pr-16 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
                    placeholder="10000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₸</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all ${
                  canSubmit && !loading
                    ? 'bg-[#6C5CE7] text-white hover:bg-[#5548C8] hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Отправка...' : 'Отправить на модерацию'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
