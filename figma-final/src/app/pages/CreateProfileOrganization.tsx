import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Building2, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createOrganizationProfile } from '../lib/users';

export function CreateProfileOrganization() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    orgName: '',
    orgType: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    description: '',
    capacity: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Ошибка: пользователь не авторизован');
      return;
    }
    
    setLoading(true);
    
    try {
      const organizationProfile = await createOrganizationProfile({
        user_id: user.id,
        organization_name: formData.orgName,
        organization_type: formData.orgType,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
      });
      
      console.log('Профиль организации создан:', organizationProfile);
      
      // Сохраняем ID профиля
      localStorage.setItem('organizationProfileId', organizationProfile.id);
      
      // Переходим к дашборду организации
      navigate('/organization');
    } catch (error) {
      console.error('Ошибка создания профиля организации:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Создать профиль организации</h1>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Название организации</label>
                <input
                  type="text"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Введите название"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип организации</label>
                <select
                  name="orgType"
                  value={formData.orgType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="">Выберите тип</option>
                  <option value="club">Клуб</option>
                  <option value="school">Школа</option>
                  <option value="center">Образовательный центр</option>
                  <option value="studio">Студия</option>
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

          {/* Contact Person Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              Контактное лицо
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ФИО представителя</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="organization@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Введите город"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
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
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Создать профиль
          </button>
        </form>
      </div>
    </div>
  );
}