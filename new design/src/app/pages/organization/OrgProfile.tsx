import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Building2, MapPin, Phone, Mail, FileText, LogOut, Edit, CreditCard } from 'lucide-react';
import { OrgTabBar } from '../../components/OrgTabBar';
import { getOrganizationProfileByUserId } from '../../lib/users';
import { useAuth } from '../../contexts/AuthContext';

export function OrgProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orgProfile, setOrgProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await getOrganizationProfileByUserId(user.id);
      setOrgProfile(profile);
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!orgProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Профиль не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 p-6 pb-12 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{orgProfile.organization_name}</h1>
            <p className="text-sm opacity-90">{orgProfile.organization_type || 'Организация'}</p>
          </div>
          <button
            onClick={() => navigate('/organization/profile/edit')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl font-bold">
          {orgProfile.organization_name.charAt(0)}
        </div>
      </div>

      <div className="px-4 -mt-8 space-y-4 pb-6">
        {/* БИН */}
        {orgProfile.bin && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">БИН</p>
                <p className="font-semibold">{orgProfile.bin}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Person */}
        {orgProfile.contact_person && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Контактное лицо</h3>
            <p className="font-medium text-lg">{orgProfile.contact_person}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Контактная информация</h3>
          
          {orgProfile.phone && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Телефон</p>
                <p className="font-medium">{orgProfile.phone}</p>
              </div>
            </div>
          )}

          {orgProfile.email && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium truncate">{orgProfile.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Address */}
        {(orgProfile.city || orgProfile.address) && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Адрес</p>
                <p className="font-medium">{orgProfile.city}</p>
                {orgProfile.address && (
                  <p className="text-sm text-gray-600">{orgProfile.address}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {orgProfile.description && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">Описание</p>
                <p className="text-sm text-gray-700 leading-relaxed">{orgProfile.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Документы</h3>
          <div className="space-y-2">
            {orgProfile.license_url && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm">Лицензия</span>
                <button className="text-xs text-orange-600 font-medium">Просмотр</button>
              </div>
            )}
            {orgProfile.registration_url && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm">Регистрация</span>
                <button className="text-xs text-orange-600 font-medium">Просмотр</button>
              </div>
            )}
            {!orgProfile.license_url && !orgProfile.registration_url && (
              <p className="text-sm text-gray-500">Документы не загружены</p>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Настройки</h3>
          
          <button
            onClick={() => navigate('/organization/profile/edit')}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Редактировать профиль</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Выйти из аккаунта</span>
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-gray-100 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500">ID организации</p>
          <p className="text-sm font-mono text-gray-700 mt-1">{orgProfile.id}</p>
        </div>
      </div>

      <OrgTabBar />
    </div>
  );
}