import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, XCircle, User } from 'lucide-react';

export function OrgApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([
    {
      id: 1,
      childName: 'Мария Иванова',
      age: 7,
      parent: 'Екатерина Иванова',
      club: 'Художественная студия',
      date: '25 фев 2026',
      status: 'new' as const,
      avatar: 'https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      childName: 'Дмитрий Петров',
      age: 14,
      parent: 'Андрей Петров',
      club: 'Футбольная школа',
      date: '26 фев 2026',
      status: 'new' as const,
      avatar: 'https://images.unsplash.com/photo-1510340842445-b6b8a6c0762e?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      childName: 'София Смирнова',
      age: 10,
      parent: 'Ольга Смирнова',
      club: 'Программирование',
      date: '27 фев 2026',
      status: 'new' as const,
      avatar: 'https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop',
    },
  ]);

  const handleApprove = (id: number) => {
    setApplications(applications.map((app) =>
      app.id === id ? { ...app, status: 'confirmed' as const } : app
    ));
  };

  const handleReject = (id: number) => {
    setApplications(applications.map((app) =>
      app.id === id ? { ...app, status: 'rejected' as const } : app
    ));
  };

  const newApplications = applications.filter((a) => a.status === 'new');
  const confirmedApplications = applications.filter((a) => a.status === 'confirmed');
  const rejectedApplications = applications.filter((a) => a.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/organization')} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Заявки на запись</h1>
            <p className="text-sm text-gray-500">{newApplications.length} новых заявок</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* New Applications */}
        {newApplications.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 px-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Новые заявки
            </h3>
            <div className="space-y-3">
              {newApplications.map((app) => (
                <div key={app.id} className="bg-white p-4 rounded-2xl shadow-lg border-2 border-orange-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={app.avatar} alt={app.childName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{app.childName}</h4>
                      <p className="text-sm text-gray-600">{app.age} лет</p>
                      <p className="text-sm text-gray-500">Родитель: {app.parent}</p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Новая
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl mb-3">
                    <p className="text-sm">
                      <span className="font-medium">Кружок:</span> {app.club}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Дата подачи:</span> {app.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmed Applications */}
        {confirmedApplications.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 px-1">Одобренные</h3>
            <div className="space-y-2">
              {confirmedApplications.map((app) => (
                <div key={app.id} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={app.avatar} alt={app.childName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{app.childName}</h4>
                      <p className="text-xs text-gray-500">{app.club}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Одобрено
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Applications */}
        {rejectedApplications.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 px-1">Отклонённые</h3>
            <div className="space-y-2">
              {rejectedApplications.map((app) => (
                <div key={app.id} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-red-200 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={app.avatar} alt={app.childName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{app.childName}</h4>
                      <p className="text-xs text-gray-500">{app.club}</p>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Отклонено
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {applications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет заявок</p>
          </div>
        )}
      </div>
    </div>
  );
}
