import { useNavigate } from 'react-router';
import { Baby, Zap, ArrowLeft } from 'lucide-react';

export function ParentChildCategorySelect() {
  const navigate = useNavigate();

  const childCategories = [
    {
      title: 'Ребенок',
      ageRange: '6-11 лет',
      icon: Baby,
      path: '/create-profile-child?parentMode=true',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
    },
    {
      title: 'Подросток',
      ageRange: '12-17 лет',
      icon: Zap,
      path: '/create-profile-teen?parentMode=true',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8]">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-6 py-4 text-white text-sm">
        <span>9:41</span>
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
      <div className="px-6 py-8 text-center">
        <h1 className="text-3xl font-black text-white mb-3">
          Выберите категорию
        </h1>
        <p className="text-white/90 text-lg">
          Сколько лет вашему ребенку?
        </p>
      </div>

      {/* Categories Section */}
      <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8 min-h-[50vh]">
        <div className="space-y-4 max-w-md mx-auto">
          {childCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <button
                key={index}
                onClick={() => navigate(category.path)}
                className="w-full p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-xl text-gray-900">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      {category.ageRange}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
