import { useNavigate } from 'react-router';
import { CheckCircle, Clock } from 'lucide-react';

export function MentorPendingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] flex flex-col">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-6 py-4 text-white text-sm">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-3 bg-white/30 rounded-sm" />
          <div className="w-4 h-3 bg-white/60 rounded-sm" />
          <div className="w-4 h-3 bg-white/90 rounded-sm" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-[40px] p-8 shadow-2xl max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-500" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#6C5CE7] rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Данные успешно отправлены!
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Мы проверяем ваш диплом и другие документы.
          </p>

          <div className="bg-[#6C5CE7]/10 rounded-2xl p-4 mb-8">
            <p className="text-[#6C5CE7] font-semibold text-sm">
              ⏱ Обычно это занимает до 24 часов
            </p>
          </div>

          {/* Additional Info */}
          <div className="text-left space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#6C5CE7] rounded-full mt-2"></div>
              <p className="text-gray-600 text-sm">
                Мы отправим уведомление на вашу почту, как только проверка будет завершена
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#6C5CE7] rounded-full mt-2"></div>
              <p className="text-gray-600 text-sm">
                После одобрения вы получите доступ к платформе и сможете начать работу с учениками
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-2xl font-semibold text-lg bg-[#6C5CE7] text-white hover:bg-[#5548C8] transition-all shadow-lg hover:scale-105"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}
