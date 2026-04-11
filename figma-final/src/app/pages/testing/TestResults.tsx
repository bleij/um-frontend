import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Sparkles, TrendingUp, Star, ArrowRight } from 'lucide-react';
import imgImagePhotoroom1 from "figma:asset/46afc62df192bb193729f6e8cde3d6be579447c2.png";
import { getTestResultById } from '../../lib/tests';
import { getAllCourses } from '../../lib/courses';

export function TestResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role'); // child, teen, young-adult, или undefined (для родителя)
  const parentMode = searchParams.get('parentMode') === 'true'; // новый параметр для режима родителя
  const testId = searchParams.get('testId');
  
  const [predisposition, setPredisposition] = useState<string>('');
  const [recommendedCoursesList, setRecommendedCoursesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestResults() {
      if (!testId) {
        setLoading(false);
        return;
      }
      
      try {
        const testResult = await getTestResultById(testId);
        if (testResult) {
          setPredisposition(testResult.predisposition || 'Универсальное развитие');
          if (testResult.recommended_courses) {
            setRecommendedCoursesList(JSON.parse(testResult.recommended_courses));
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки результатов теста:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadTestResults();
  }, [testId]);

  // Определяем куда перенаправлять после тестирования
  const getRedirectPath = () => {
    // Если parentMode=true, то это родитель проходил тест для ребенка
    if (parentMode) {
      return '/parent';
    }
    
    // Иначе смотрим роль пользователя
    switch (role) {
      case 'child':
        return '/child';
      case 'teen':
        return '/teen';
      case 'young-adult':
        return '/young-adult';
      default:
        return '/parent'; // По умолчанию - родительская панель
    }
  };

  // Мок данные результатов (в будущем будут рассчитываться на основе ответов)
  const topSkills = [
    { name: 'Творческое мышление', score: 92, color: 'from-pink-500 to-purple-500' },
    { name: 'Техническое мышление', score: 85, color: 'from-blue-500 to-cyan-500' },
    { name: 'Командная работа', score: 78, color: 'from-green-500 to-emerald-500' },
  ];

  const recommendedCourses = [
    {
      id: 1,
      title: 'Художественная студия',
      description: 'Развитие творческих навыков через рисование и живопись',
      match: 95,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
      ageGroup: '6-11 лет',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Программирование для начинающих',
      description: 'Основы кодирования и создание первых проектов',
      match: 88,
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop',
      ageGroup: '8-14 лет',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Робототехника',
      description: 'Конструирование и программирование роботов',
      match: 82,
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      ageGroup: '9-15 лет',
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pb-8">
      {/* Header with confetti effect */}
      <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 text-white relative overflow-hidden px-[16px] py-[30px]">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Поздравляем!</h1>
          <p className="text-purple-100 text-lg">Тестирование завершено</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 mx-[0px] my-[-15px]">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-[20px] py-[0px] mx-[0px] mt-[10px] mb-[0px]">
        {/* Profile Image Card */}
        <div className="bg-white rounded-3xl shadow-xl mb-6 px-[24px] py-[30px]">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-200 to-blue-200">
              <img 
                src={imgImagePhotoroom1} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Ваш профиль создан!</h2>
              <p className="text-gray-600">AI проанализировал ваши ответы</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Skills */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Ваши сильные стороны</h2>
          </div>
          
          <div className="space-y-4">
            {topSkills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="text-sm font-semibold text-purple-600">{skill.score}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Рекомендованные курсы</h2>
          </div>
          
          <div className="space-y-4">
            {recommendedCourses.map((course) => (
              <div
                key={course.id}
                className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex gap-4 px-[4px] py-[12px]">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 p-[0px]">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 m-[0px]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {course.match}% совпадение
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-medium">
                        {course.ageGroup}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Вы всегда можете пройти тестирование заново из настроек профиля
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(getRedirectPath())}
          className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          Перейти в панель
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}