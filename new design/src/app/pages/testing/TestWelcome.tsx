import { useNavigate, useSearchParams } from 'react-router';
import imgCute3DRobotSayHelloPngImagesPsdFreeDownloadPikbestPhotoroom1 from "figma:asset/ab8abd1c8b5a26a30f56bfa1386c9c62c4a37436.png";

export function TestWelcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role'); // child, teen, young-adult
  const parentMode = searchParams.get('parentMode') === 'true'; // режим родителя

  // Определяем куда вернуться при пропуске
  const getSkipPath = () => {
    if (parentMode) {
      return '/parent';
    }
    
    switch (role) {
      case 'child':
        return '/child';
      case 'teen':
        return '/teen';
      case 'young-adult':
        return '/young-adult';
      default:
        return '/parent';
    }
  };

  const handleStart = () => {
    // Передаем параметр role или parentMode дальше в вопросы
    let params = '';
    if (parentMode) {
      params = '?parentMode=true';
    } else if (role) {
      params = `?role=${role}`;
    }
    navigate(`/testing/questions${params}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] flex items-center justify-center p-6">
      {/* Status Bar */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 text-white text-sm" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-3 bg-white/30 rounded-sm" />
          <div className="w-4 h-3 bg-white/60 rounded-sm" />
          <div className="w-4 h-3 bg-white/90 rounded-sm" />
        </div>
      </div>

      <div className="max-w-md w-full mt-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-[40px] p-8 shadow-2xl">
          {/* Robot Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <img 
                src={imgCute3DRobotSayHelloPngImagesPsdFreeDownloadPikbestPhotoroom1} 
                alt="UMO Robot" 
                className="w-56 h-56 object-contain relative z-10"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Привет! Я UMO 👋
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Давай пройдем короткое тестирование, чтобы узнать твои интересы и найти идеальные курсы для тебя!
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3 mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">10</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Всего вопросов</p>
                  <p className="text-sm text-gray-600">Это займет около 5 минут</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">✨</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Персональные рекомендации</p>
                  <p className="text-sm text-gray-600">AI подберет курсы специально для тебя</p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 text-[20px] px-[10px] py-[20px]"
          >
            Начать тестирование
          </button>
        </div>
      </div>
    </div>
  );
}