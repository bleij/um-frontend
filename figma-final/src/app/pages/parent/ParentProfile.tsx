import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Home, Calendar, BookOpen, BarChart3, User, Bell, CreditCard, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useParentData } from '../../contexts/ParentDataContext';
import { updateParentProfile } from '../../lib/users';
import { getEnrollmentsByChild } from '../../lib/enrollments';

export function ParentProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { parentProfile, children, refetch } = useParentData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);

  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    age: '',
  });

  useEffect(() => {
    if (parentProfile && showEditModal) {
      setEditForm({
        full_name: parentProfile.full_name || '',
        phone: parentProfile.phone || '',
        age: parentProfile.age?.toString() || '',
      });
    }
  }, [parentProfile, showEditModal]);

  useEffect(() => {
    async function loadEnrollments() {
      if (children.length === 0) return;
      
      try {
        const allEnrollments = await Promise.all(
          children.map(child => getEnrollmentsByChild(child.id))
        );
        const total = allEnrollments.flat().length;
        setEnrollmentsCount(total);
      } catch (error) {
        console.error('Ошибка загрузки записей:', error);
      }
    }
    
    loadEnrollments();
  }, [children]);

  const handleSaveProfile = async () => {
    if (!parentProfile) return;
    
    try {
      await updateParentProfile(parentProfile.id, {
        full_name: editForm.full_name,
        phone: editForm.phone,
        age: editForm.age ? parseInt(editForm.age) : undefined,
      });
      
      await refetch();
      setShowEditModal(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      alert('Не удалось обновить профиль');
    }
  };

  const navItems = [
    { icon: Home, label: 'Главная', path: '/parent' },
    { icon: Calendar, label: 'Календарь', path: '/parent/calendar' },
    { icon: BookOpen, label: 'Кружки', path: '/parent/clubs' },
    { icon: BarChart3, label: 'Отчеты', path: '/parent/reports' },
    { icon: User, label: 'Профиль', path: '/parent/profile' },
  ];

  const menuItems = [
    { icon: User, label: 'Редактировать профиль', path: '#' },
    { icon: Bell, label: 'Уведомления', path: '#' },
    { icon: CreditCard, label: 'Способы оплаты', path: '#' },
    { icon: Settings, label: 'Настройки', path: '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] pb-24">
      <Header title="Профиль" showBack={true} backPath="/parent" />

      <div className="p-6 space-y-6">
        {/* Profile Info */}
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-lg text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200 ring-4 ring-white/50 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1758687126864-96b61e1b3af0?w=200&h=200&fit=crop"
              alt="Профиль"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {parentProfile?.full_name || 'Загрузка...'}
          </h2>
          <p className="text-gray-500 mb-6">{user?.email}</p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
                <p className="text-2xl font-black text-white">{children.length}</p>
              </div>
              <p className="text-xs text-gray-600 font-medium">Детей</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
                <p className="text-2xl font-black text-white">{enrollmentsCount}</p>
              </div>
              <p className="text-xs text-gray-600 font-medium">Записей</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  if (index === 0) setShowEditModal(true);
                  else if (index === 1) setShowNotificationsModal(true);
                  else if (index === 2) setShowPaymentModal(true);
                  else if (index === 3) setShowSettingsModal(true);
                }}
                className="w-full flex items-center gap-4 p-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-2xl flex items-center justify-center shadow-md">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="flex-1 text-left font-semibold text-gray-800 text-lg">{item.label}</span>
                <svg className="w-6 h-6 text-[#6C5CE7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-3 p-5 bg-white/95 backdrop-blur-sm text-red-600 rounded-2xl shadow-lg hover:shadow-xl hover:bg-red-50 transition-all font-semibold text-lg"
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </button>
      </div>

      <BottomNav items={navItems} />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Редактировать профиль</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Полное имя</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  placeholder="Введите полное имя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Возраст</label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  placeholder="Введите возраст"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder Modals */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowNotificationsModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Уведомления</h2>
              <button onClick={() => setShowNotificationsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600">Настройки уведомлений скоро будут доступны</p>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Способы оплаты</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600">Управление способами оплаты скоро будет доступно</p>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Настройки</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600">Дополнительные настройки скоро будут доступны</p>
          </div>
        </div>
      )}
    </div>
  );
}