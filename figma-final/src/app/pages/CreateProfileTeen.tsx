import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, User, GraduationCap, Sparkles, Target, Check, Plus, Baby, Zap, GraduationCap as GradCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createChildProfile, createTeenProfile } from '../lib/users';

export function CreateProfileTeen() {
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
    education: '',
    interests: [] as string[],
    otherInterest: '',
    goals: '',
    skills: '',
  });

  const availableInterests = [
    'Рисование',
    'Музыка',
    'Спорт',
    'Программирование',
    'Фотография',
    'Видеомонтаж',
    'Чтение',
    'Танцы',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const ageNum = parseInt(formData.age) || 15;
      
      if (parentMode) {
        // Родитель создает профиль подростка
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

        const teenProfile = await createChildProfile({
          parent_id: parentProfileId,
          full_name: fullName,
          age: ageNum,
          age_category: 'teen',
          interests: JSON.stringify(formData.interests),
        });
        
        console.log('Профиль подростка создан родителем:', teenProfile);
        
        // Сохраняем информацию о созданном профиле
        const createdProfiles = JSON.parse(localStorage.getItem('createdChildProfiles') || '[]');
        if (!createdProfiles.includes('teen')) {
          createdProfiles.push('teen');
          localStorage.setItem('createdChildProfiles', JSON.stringify(createdProfiles));
        }
        
        // Сохраняем ID профиля для тестирования
        localStorage.setItem('currentChildProfileId', teenProfile.id);
        
        setProfileSaved(true);
      } else {
        // Подросток создает собственный профиль
        if (!user) {
          alert('Ошибка: пользователь не авторизован. Пожалуйста, вернитесь к выбору роли.');
          setLoading(false);
          return;
        }
        
        const teenProfile = await createTeenProfile({
          user_id: user.id,
          full_name: fullName,
          age: ageNum,
          interests: JSON.stringify(formData.interests),
        });
        
        console.log('Собственный профиль подростка создан:', teenProfile);
        
        // Сохраняем ID профиля
        localStorage.setItem('currentChildProfileId', teenProfile.id);
        
        // Переходим к тестированию
        navigate('/testing/welcome?role=teen');
      }
    } catch (error) {
      console.error('Ошибка создания профиля подростка:', error);
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

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, value],
      });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter((interest) => interest !== value),
      });
    }
  };

  const handleOtherInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      otherInterest: e.target.value,
    });
  };

  const handleAddOtherInterest = () => {
    if (formData.otherInterest.trim()) {
      setFormData({
        ...formData,
        interests: [...formData.interests, formData.otherInterest],
        otherInterest: '',
      });
    }
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

  // Если профиль подростка сохранен в режиме родителя, показываем экран успеха
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
            Профиль подростка сохранен
          </p>
        </div>

        {/* Categories Section */}
        <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8 min-h-[50vh]">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">
            {parentMode ? 'Создать профиль подростка' : 'Создать профиль'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Личная информация
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Введите имя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Введите фамилию"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Возраст</label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Выберите возраст</option>
                  {Array.from({ length: 6 }, (_, i) => i + 12).map(age => (
                    <option key={age} value={age}>{age} лет</option>
                  ))}
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
                    <div className="p-3 text-center rounded-xl border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all">
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
                    <div className="p-3 text-center rounded-xl border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all">
                      Женский
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Education Section */}
          

          {/* Interests Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Интересы
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Что вам интересно?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableInterests.map((interest) => (
                  <label key={interest} className="cursor-pointer">
                    <input
                      type="checkbox"
                      value={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={handleInterestChange}
                      className="peer sr-only"
                    />
                    <div className="p-3 text-center text-sm rounded-xl border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all">
                      {interest}
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Другое:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.otherInterest}
                    onChange={handleOtherInterestChange}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Введите свой интерес"
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherInterest}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {formData.interests.filter((i) => !availableInterests.includes(i)).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.interests
                      .filter((i) => !availableInterests.includes(i))
                      .map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                interests: formData.interests.filter((i) => i !== interest),
                              })
                            }
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Цели
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Чего вы хотите достичь?</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Опишите свои цели и стремления"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {loading ? 'Сохранение...' : 'Создать профиль'}
          </button>
        </form>
      </div>
    </div>
  );
}