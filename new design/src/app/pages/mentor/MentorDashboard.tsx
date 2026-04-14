import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, Calendar, Users, Wallet, User, Bell, Clock, Star } from 'lucide-react';

export function MentorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  // Mock данные
  const nextSession = {
    childName: 'Алишер Нурмуханбетов',
    childAge: 12,
    childPhoto: 'https://images.unsplash.com/photo-1510340842445-b6b8a6c0762e?w=100&h=100&fit=crop',
    time: '14:00',
    minutesUntil: 40,
    subject: 'Развитие креативности',
  };

  const todayTasks = [
    { id: 1, time: '14:00', child: 'Алишер Н.', status: 'paid', subject: 'Креативность' },
    { id: 2, time: '16:00', child: 'Мирас К.', status: 'paid', subject: 'Лидерство' },
    { id: 3, time: '18:00', child: 'София П.', status: 'awaiting_report', subject: 'Коммуникация' },
  ];

  const notifications = [
    { id: 1, type: 'review', text: 'Мама Алишера оставила отзыв', rating: 5, time: '10 мин назад' },
    { id: 2, type: 'ai', text: 'Система ИИ обновила паутинку вашего ученика Мираса', time: '1 час назад' },
    { id: 3, type: 'booking', text: 'Новая запись на 20 апреля в 15:00', time: '2 часа назад' },
  ];

  const balance = 125000;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] pb-20">
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
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              <img
                src="https://images.unsplash.com/photo-1610357285982-a5352a783962?w=100&h=100&fit=crop"
                alt="Mentor"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Добрый день, Арман!</h1>
              <p className="text-white/80 text-sm">Ментор • Психолог</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Toggle: Принимаю заказы */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isAcceptingOrders ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <div>
              <p className="text-white font-semibold">Принимаю заказы</p>
              <p className="text-white/70 text-xs">
                {isAcceptingOrders ? 'Вы видны в поиске' : 'Режим отпуска'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
            className={`w-14 h-8 rounded-full transition-colors relative ${
              isAcceptingOrders ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                isAcceptingOrders ? 'translate-x-7' : 'translate-x-1'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8">
        {/* Next Session Card */}
        <div className="bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-3xl p-6 mb-6 text-white shadow-xl">
          <p className="text-white/80 text-sm mb-3">Ближайшая сессия</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
              <img src={nextSession.childPhoto} alt={nextSession.childName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{nextSession.childName}</h3>
              <p className="text-white/90 text-sm">{nextSession.childAge} лет • {nextSession.subject}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">{nextSession.time}</span>
                <span className="text-white/70 text-sm">• Через {nextSession.minutesUntil} минут</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all">
              Подготовиться
            </button>
            <button className="flex-1 py-3 bg-white text-[#6C5CE7] rounded-xl font-semibold hover:bg-white/90 transition-all">
              Начать созвон
            </button>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Задачи на сегодня</h3>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6C5CE7]">{task.time.split(':')[0]}</p>
                  <p className="text-xs text-gray-500">{task.time.split(':')[1]}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{task.child}</p>
                  <p className="text-sm text-gray-600">{task.subject}</p>
                </div>
                <div>
                  {task.status === 'paid' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Оплачено
                    </span>
                  )}
                  {task.status === 'awaiting_report' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      Ждет отчета
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Уведомления</h3>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center flex-shrink-0">
                    {notif.type === 'review' && <Star className="w-5 h-5 text-[#6C5CE7]" />}
                    {notif.type === 'ai' && <Bell className="w-5 h-5 text-[#6C5CE7]" />}
                    {notif.type === 'booking' && <Calendar className="w-5 h-5 text-[#6C5CE7]" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{notif.text}</p>
                    {notif.rating && (
                      <div className="flex gap-1 mt-1">
                        {[...Array(notif.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance Widget */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-5 text-white shadow-xl">
          <p className="text-white/80 text-sm mb-1">Доступно к выводу</p>
          <p className="text-3xl font-bold mb-3">{balance.toLocaleString()} ₸</p>
          <button
            onClick={() => setActiveTab('wallet')}
            className="w-full py-2 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all"
          >
            Перейти в кошелек
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-inset-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'home' ? 'text-[#6C5CE7]' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Главная</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'calendar' ? 'text-[#6C5CE7]' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Календарь</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'students' ? 'text-[#6C5CE7]' : 'text-gray-400'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Ученики</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'wallet' ? 'text-[#6C5CE7]' : 'text-gray-400'
            }`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs font-medium">Кошелек</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'profile' ? 'text-[#6C5CE7]' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Профиль</span>
          </button>
        </div>
      </div>
    </div>
  );
}
