import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Phone, Award, Briefcase, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createMentorProfile } from '../lib/users';

export function CreateProfileMentor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    expertise: '',
    description: '',
    education: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Ошибка: пользователь не авторизован');
      return;
    }
    
    setLoading(true);
    
    try {
      const mentorProfile = await createMentorProfile({
        user_id: user.id,
        full_name: `${formData.firstName} ${formData.lastName}`,
        expertise: formData.expertise,
        experience_years: parseInt(formData.experience) || 0,
        phone: formData.phone,
        bio: formData.description,
      });
      
      console.log('Профиль ментора создан:', mentorProfile);
      
      // Сохраняем ID профиля
      localStorage.setItem('mentorProfileId', mentorProfile.id);
      
      // Переходим к дашборду ментора
      navigate('/mentor');
    } catch (error) {
      console.error('Ошибка создания профиля ментора:', error);
      alert('Ошибка при сохранении профиля');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Создать профиль ментора</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              Личная информация
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Фамилия"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-600" />
              Контактная информация
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="mentor@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              Образование
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Образование и квалификация</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                placeholder="Ваше образование, сертификаты, степени..."
              />
            </div>
          </div>

          {/* Professional Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-600" />
              Профессиональная информация
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Специализация</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Например: Карьерное развитие, Программирование, Искусство"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Опыт работы (лет)</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                  <option value="">Выберите опыт</option>
                  <option value="1-2">1-2 года</option>
                  <option value="3-5">3-5 лет</option>
                  <option value="6-10">6-10 лет</option>
                  <option value="10+">10+ лет</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expertise Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              Области экспертизы
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ключевые навыки и компетенции</label>
              <textarea
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                placeholder="Перечислите ваши ключевые навыки и области экспертизы"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              О себе
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание профиля</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                placeholder="Расскажите о себе, своем подходе к менторству, достижениях..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Создать профиль
          </button>
        </form>
      </div>
    </div>
  );
}