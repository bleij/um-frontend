import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, User, GraduationCap, Briefcase, Target, Mail, Phone, Check, Plus, Baby, Zap, GraduationCap as GradCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createChildProfile, createYoungAdultProfile } from '../lib/users';

export function CreateProfileYoungAdult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentMode = searchParams.get('parentMode') === 'true';
  const [profileSaved, setProfileSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    education: '',
    profession: '',
    experience: '',
    goals: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const ageNum = parseInt(formData.age) || 19;
      
      if (parentMode) {
        // Родитель создает профиль молодого взрослого
        let parentProfileId = localStorage.getItem('parentProfileId');

        // Если ID профиля родителя нет, пытаемся найти его по user_id
        if (!parentProfileId && user) {
          console.log('⚠️ parentProfileId не найден в localStorage, ищем профиль родителя по user_id:', user.id);
          try {
            const { getParentProfileByUserId, createParentProfile } = await import('../lib/users');
            let parentProfile = await getParentProfileByUserId(user.id);

            // Если профиль не найден, создаем его
            if (!parentProfile) {
              console.log('📝 Создаем профиль родителя...');
              parentProfile = await createParentProfile({
                user_id: user.id,
                full_name: user.firstName || 'Родитель',
                phone: user.lastName || '',
                children_count: 1,
              });
            }

            parentProfileId = parentProfile.id;
            localStorage.setItem('parentProfileId', parentProfileId);
            console.log('✅ parentProfileId сохранен:', parentProfileId);
          } catch (error) {
            console.error('❌ Ошибка получения/создания профиля родителя:', error);
          }
        }

        if (!parentProfileId) {
          alert('Ошибка: не удалось определить профиль родителя. Пожалуйста, попробуйте снова.');
          setLoading(false);
          return;
        }

        const youngAdultProfile = await createChildProfile({
          parent_id: parentProfileId,
          full_name: fullName,
          age: ageNum,
          age_category: 'young-adult',
          interests: formData.profession,
        });
        
        console.log('Профиль молодого взрослого создан родителем:', youngAdultProfile);
        
        // Сохраняем информацию о созданном профиле
        const createdProfiles = JSON.parse(localStorage.getItem('createdChildProfiles') || '[]');
        if (!createdProfiles.includes('young-adult')) {
          createdProfiles.push('young-adult');
          localStorage.setItem('createdChildProfiles', JSON.stringify(createdProfiles));
        }
        
        // Сохраняем ID профиля для тестирования
        localStorage.setItem('currentChildProfileId', youngAdultProfile.id);
        
        setProfileSaved(true);
      } else {
        // Молодой взрослый создает собственный профиль
        if (!user) {
          alert('Ошибка: пользователь не авторизован. Пожалуйста, вернитесь к выбору роли.');
          setLoading(false);
          return;
        }
        
        const youngAdultProfile = await createYoungAdultProfile({
          user_id: user.id,
          full_name: fullName,
          age: ageNum,
          education_level: formData.education,
          career_goals: formData.goals,
          interests: formData.profession,
        });
        
        console.log('Собственный профиль молодого взрослого создан:', youngAdultProfile);
        
        // Сохраняем ID профиля
        localStorage.setItem('currentChildProfileId', youngAdultProfile.id);
        
        // Переходим к тестированию
        navigate('/testing/welcome?role=young-adult');
      }
    } catch (error) {
      console.error('Ошибка создания профиля молодого взрослого:', error);
      alert('Ошибка при сохранении профиля. Попробуйте еще раз.');
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

  const childCategories = [
    {
      title: 'Ребенок',
      ageRange: '6-11 лет',
      icon: Baby,
      path: '/create-profile-child?parentMode=true',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
    },
    {
      title: 'Подросток',
      ageRange: '12-17 лет',
      icon: Zap,
      path: '/create-profile-teen?parentMode=true',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      title: 'Молодой взрослый',
      ageRange: '18-20 лет',
      icon: GradCap,
      path: '/create-profile-young-adult?parentMode=true',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
    },
  ];

  // Если профиль молодого взрослого сохранен в режиме родителя, показываем экран успеха
  if (profileSaved && parentMode) {
    // Получаем список уже созданных профилей
    const createdProfiles = JSON.parse(localStorage.getItem('createdChildProfiles') || '[]');
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8]">
        {/* Status Bar */}
        <div className="w-full flex justify-between items-center px-6 py-4 text-white text-sm">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-3 bg-white/30 rounded-sm" />
            <div className="w-4 h-3 bg-white/60 rounded-sm" />
            <div className="w-4 h-3 bg-white/90 rounded-sm" />
          </div>
        </div>

        {/* Success Header */}
        <div className="px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-10 h-10 text-[#6C5CE7]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Отлично!</h1>
          <p className="text-white/90 text-lg">
            Профиль сохранен
          </p>
        </div>

        {/* Categories Section */}
        <div className="flex-1 bg-gray-50 rounded-t-[40px] min-h-[50vh] px-[24px] py-[40px] m-[0px]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Добавить еще ребенка?</h2>
          <div className="space-y-4">
            {childCategories.map((category, index) => {
              const Icon = category.icon;
              const categoryKey = category.title === 'Ребенок' ? 'child' : 
                                 category.title === 'Подросток' ? 'teen' : 'young-adult';
              const isCreated = createdProfiles.includes(categoryKey);
              
              return (
                <button
                  key={index}
                  onClick={() => navigate(category.path)}
                  className="w-full p-5 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] relative"
                >
                  {isCreated && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-600 font-medium mt-0.5">{category.ageRange}</p>
                    </div>
                    {!isCreated && <Plus className="w-6 h-6 text-[#6C5CE7]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/testing/welcome?parentMode=true')}
            className="w-full mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Продолжить к тестированию
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">
            {parentMode ? 'Создать профиль молодого взрослого' : 'Создать профиль'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Фамилия"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Возраст</label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Выберите возраст</option>
                  <option value="18">18 лет</option>
                  <option value="19">19 лет</option>
                  <option value="20">20 лет</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-3 text-center rounded-xl border-2 border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                      Мужской
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-3 text-center rounded-xl border-2 border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                      Женский
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600" />
              Контакты
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              Образование
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Учебное заведение / Специальность</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Университет, колледж, специальность"
              />
            </div>
          </div>

          {/* Professional Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              Профессиональная информация
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Профессиональные интересы</label>
                <textarea
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Какая сфера деятельности вас интересует?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Опыт</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Опишите ваш опыт работы или проектов"
                />
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Цели
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Профессиональные и личные цели</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Чего вы хотите достичь в ближайшее время?"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {loading ? 'Сохранение...' : 'Создать профиль'}
          </button>
        </form>
      </div>
    </div>
  );
}