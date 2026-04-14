import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Users, Plus, Check, Baby, Zap, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createParentProfile, getParentProfileByUserId } from '../lib/users';

export function CreateProfileParent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const childAdded = searchParams.get('childAdded') === 'true';
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    childrenCount: '1',
  });

  const [parentProfileSaved, setParentProfileSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const childCategories = [
    {
      title: 'Ребенок',
      ageRange: '6-11 лет',
      icon: Baby,
      path: '/create-profile-child?parentMode=true',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Подросток',
      ageRange: '12-17 лет',
      icon: Zap,
      path: '/create-profile-teen?parentMode=true',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Молодой взрослый',
      ageRange: '18-20 лет',
      icon: GraduationCap,
      path: '/create-profile-young-adult?parentMode=true',
      gradient: 'from-green-500 to-green-600',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (!user) {
      console.error('Пользователь не авторизован');
      return;
    }

    setLoading(true);
    
    try {
      const parentProfile = await createParentProfile({
        user_id: user.id,
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        age: undefined,
        children_count: parseInt(formData.childrenCount),
      });
      
      console.log('Профиль родителя сохранен:', parentProfile);
      
      // Сохраняем ID профиля родителя для дальнейшего использования
      localStorage.setItem('parentProfileId', parentProfile.id);
      
      // Помечаем профиль родителя как сохраненный
      setParentProfileSaved(true);
    } catch (error) {
      console.error('Ошибка сохранения профиля родителя:', error);
      alert('Ошибка при сохранении профиля. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Если профиль родителя сохранен, показываем экран выбора категории ребенка
  if (parentProfileSaved) {
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
            Теперь добавьте профиль ребенка
          </p>
        </div>

        {/* Categories Section */}
        <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8 min-h-[50vh]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Выберите возрастную категорию</h2>
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
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
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
        </div>
      </div>
    );
  }

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

      {/* Back Button */}
      <div className="px-6 py-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
      </div>

      {/* Header */}
      <div className="px-6 py-6 text-center">
        <h1 className="text-4xl font-black text-white mb-2">Профиль родителя</h1>
        <p className="text-white/80 text-sm">
          Заполните информацию о себе
        </p>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name inputs */}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C5CE7]" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Имя"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C5CE7]" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Фамилия"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact inputs */}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C5CE7]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C5CE7]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Телефон"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Address inputs */}
          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C5CE7]" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Город"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C5CE7]" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Адрес"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
              />
            </div>
          </div>

          {/* Children count */}
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C5CE7]" />
            <select
              name="childrenCount"
              value={formData.childrenCount}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all appearance-none"
            >
              <option value="1">1 ребенок</option>
              <option value="2">2 детей</option>
              <option value="3">3 детей</option>
              <option value="4">4 детей</option>
              <option value="5">5+ детей</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.firstName || !formData.lastName || !formData.phone || !formData.childrenCount || loading}
            className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all mt-6 ${
              !formData.firstName || !formData.lastName || !formData.phone || !formData.childrenCount || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#6C5CE7] text-white hover:bg-[#5548C8] hover:scale-105'
            }`}
          >
            {loading ? 'Сохранение...' : 'Сохранить и продолжить'}
          </button>
        </form>
      </div>
    </div>
  );
}