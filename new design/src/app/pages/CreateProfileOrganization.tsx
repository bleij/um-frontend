import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Building2, User, Mail, Phone, MapPin, FileText, Upload, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createOrganizationProfile } from '../lib/users';

export function CreateProfileOrganization() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    orgName: '',
    orgType: '',
    bin: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    description: '',
    capacity: '',
  });

  const [files, setFiles] = useState({
    license: null as File | null,
    registration: null as File | null,
    logo: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Ошибка: пользователь не авторизован');
      return;
    }
    
    console.log('📝 CreateProfileOrganization: начало создания профиля');
    console.log('👤 User ID:', user.id);
    console.log('📋 Form data:', formData);
    
    setLoading(true);
    
    try {
      // В реальном приложении здесь была бы загрузка файлов
      // Пока сохраняем placeholder URLs
      const profileData = {
        user_id: user.id,
        organization_name: formData.orgName,
        organization_type: formData.orgType,
        bin: formData.bin,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        address: formData.address,
        description: formData.description,
        license_url: files.license ? 'uploaded_license.pdf' : undefined,
        registration_url: files.registration ? 'uploaded_registration.pdf' : undefined,
        logo_url: files.logo ? 'uploaded_logo.jpg' : undefined,
      };
      
      console.log('📤 Отправляем данные профиля:', profileData);
      
      const organizationProfile = await createOrganizationProfile(profileData);
      
      console.log('✅ Профиль организации создан:', organizationProfile);
      
      // Сохраняем ID профиля
      localStorage.setItem('organizationProfileId', organizationProfile.id);
      
      // Переходим к дашборду организации
      navigate('/organization');
    } catch (error) {
      console.error('❌ Ошибка создания профиля организации:', error);
      alert('Ошибка при сохранении профиля: ' + (error as Error).message);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'license' | 'registration' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles({ ...files, [field]: file });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Регистрация организации</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Organization Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              Информация об организации
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Полное название организации *</label>
                <input
                  type="text"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Например: RoboTech Academy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">БИН *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="bin"
                    value={formData.bin}
                    onChange={handleChange}
                    required
                    maxLength={12}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="123456789012"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Бизнес-идентификационный номер (12 цифр)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип организации *</label>
                <select
                  name="orgType"
                  value={formData.orgType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="">Выберите тип</option>
                  <option value="club">Клуб</option>
                  <option value="school">Школа</option>
                  <option value="center">Образовательный центр</option>
                  <option value="studio">Студия</option>
                  <option value="academy">Академия</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Вместимость учеников</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Количество мест"
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-600" />
              Документы
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Лицензия на образовательную деятельность</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'license')}
                    className="hidden"
                    id="license-upload"
                  />
                  <label htmlFor="license-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {files.license ? files.license.name : 'Нажмите для загрузки'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG до 10MB</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Свидетельство о регистрации</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'registration')}
                    className="hidden"
                    id="registration-upload"
                  />
                  <label htmlFor="registration-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {files.registration ? files.registration.name : 'Нажмите для загрузки'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG до 10MB</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Логотип организации</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'logo')}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {files.logo ? files.logo.name : 'Нажмите для загрузки'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG до 5MB</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Person Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              Контактное лицо
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ФИО директора / менеджера *</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Полное имя"
              />
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-600" />
              Контактная информация
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="organization@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              Адрес
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Город *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Например: Алматы"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес офиса/центра *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Улица, дом, офис"
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Описание
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">О вашей организации</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                placeholder="Расскажите о вашей организации, направлениях деятельности, преимуществах..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание профиля...' : 'Создать профиль'}
          </button>
        </form>
      </div>
    </div>
  );
}