import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, GraduationCap, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { addOrgTeacher } from '../../lib/organization';
import { getOrganizationProfileByUserId } from '../../lib/users';

export function OrgStaffAdd() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    specialization: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Ошибка: пользователь не авторизован');
      return;
    }
    
    setLoading(true);
    
    try {
      const orgProfile = await getOrganizationProfileByUserId(user.id);
      
      if (!orgProfile) {
        alert('Ошибка: профиль организации не найден');
        return;
      }

      await addOrgTeacher({
        organization_id: orgProfile.id,
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        specialization: formData.specialization,
      });
      
      console.log('Учитель добавлен');
      
      // Показываем сообщение об успехе
      alert(`Приглашение отправлено на номер ${formData.phone}`);
      
      navigate('/organization/staff');
    } catch (error) {
      console.error('Ошибка добавления учителя:', error);
      alert('Ошибка при добавлении учителя');
    } finally {
      setLoading(false);
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
          <h1 className="text-xl font-bold">Добавить учителя</h1>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            <Send className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Как это работает?</h3>
              <p className="text-sm text-blue-700">
                После добавления учителю придет СМС-приглашение с инструкциями для входа в приложение. 
                Он сможет видеть свои группы и управлять ими.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Teacher Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              Данные учителя
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Полное имя преподавателя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Номер телефона *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="+7 (___) ___-__-__"
                />
                <p className="text-xs text-gray-500 mt-1">
                  На этот номер придет СМС-приглашение
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="teacher@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Специализация</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="">Выберите специализацию</option>
                  <option value="Робототехника">Робототехника</option>
                  <option value="Программирование">Программирование</option>
                  <option value="Математика">Математика</option>
                  <option value="Искусство">Искусство</option>
                  <option value="Музыка">Музыка</option>
                  <option value="Спорт">Спорт</option>
                  <option value="Языки">Языки</option>
                  <option value="Наука">Наука</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Отправка приглашения...'
            ) : (
              <>
                <Send className="w-5 h-5" />
                Отправить приглашение
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
