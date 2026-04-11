import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Home, Calendar, BookOpen, BarChart3, User, Filter, Star, MapPin } from 'lucide-react';
import { useParentData } from '../../contexts/ParentDataContext';
import { getEnrollmentsByChild } from '../../lib/enrollments';
import { getCourseById } from '../../lib/courses';

export function ParentClubs() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const { courses, children } = useParentData();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  useEffect(() => {
    async function loadEnrolledCourses() {
      if (children.length === 0) return;
      
      try {
        // Получаем все записи для всех детей
        const allEnrollments = await Promise.all(
          children.map(child => getEnrollmentsByChild(child.id))
        );
        
        // Объединяем все записи
        const enrollments = allEnrollments.flat();
        
        // Получаем детали курсов
        const coursesDetails = await Promise.all(
          enrollments.map(async (enrollment) => {
            const course = await getCourseById(enrollment.course_id);
            return course;
          })
        );
        
        // Удаляем дубликаты и null значения
        const uniqueCourses = coursesDetails.filter((course, index, self) => 
          course && self.findIndex(c => c?.id === course?.id) === index
        );
        
        setEnrolledCourses(uniqueCourses);
      } catch (error) {
        console.error('Ошибка загрузки записанных курсов:', error);
      }
    }
    
    loadEnrolledCourses();
  }, [children]);

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'Искусство и творчество', label: 'Искусство' },
    { id: 'Спорт и физическая активность', label: 'Спорт' },
    { id: 'Технологии и IT', label: 'Технологии' },
    { id: 'Социальные навыки и коммуникация', label: 'Коммуникация' },
    { id: 'Аналитическое мышление', label: 'Мышление' },
  ];

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter((course) => course.category === activeCategory);

  // Исключаем записанные курсы из основного каталога
  const availableCourses = filteredCourses.filter(
    course => !enrolledCourses.find(enrolled => enrolled?.id === course.id)
  );

  const navItems = [
    { icon: Home, label: 'Главная', path: '/parent' },
    { icon: Calendar, label: 'Календарь', path: '/parent/calendar' },
    { icon: BookOpen, label: 'Кружки', path: '/parent/clubs' },
    { icon: BarChart3, label: 'Отчеты', path: '/parent/reports' },
    { icon: User, label: 'Профиль', path: '/parent/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Каталог кружков" showBack={true} dark={true} backPath="/parent" />

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex-shrink-0">
            <Filter className="w-5 h-5 text-[#6C5CE7]" />
          </button>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#6C5CE7] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* My Enrolled Courses Section */}
        {enrolledCourses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800">📚 Мои кружки</h2>
              <span className="text-sm text-gray-500">{enrolledCourses.length} записей</span>
            </div>
            <div className="space-y-3">
              {enrolledCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/parent/clubs/${course.id}`)}
                  className="w-full bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden text-left border-2 border-[#6C5CE7]/20"
                >
                  <div className="relative h-40">
                    <img src={course.image_url || 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=400'} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-[#6C5CE7] text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                      ✓ Записан
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-sm">{course.rating || 4.5}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <p>👥 Возраст: {course.age_group} лет</p>
                      <p>📅 Длительность: {course.duration || 'Уточняется'}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="font-semibold text-lg text-[#6C5CE7]">{course.price ? `${course.price}₽/мес` : 'Бесплатно'}</span>
                      <span className="text-sm font-medium text-[#6C5CE7]">Подробнее →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses Section */}
        <div className="space-y-3">
          {enrolledCourses.length > 0 && (
            <h2 className="font-bold text-lg text-gray-800 mt-6">🔍 Доступные кружки</h2>
          )}
          {availableCourses.length > 0 ? (
            availableCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => navigate(`/parent/clubs/${course.id}`)}
                className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden text-left"
              >
                <div className="relative h-48">
                  <img src={course.image_url || 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=400'} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-sm">{course.rating || 4.5}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p>👥 Возраст: {course.age_group} лет</p>
                    <p>📅 Длительность: {course.duration || 'Уточняется'}</p>
                    <p>📍 Формат: {course.format || 'Уточняется'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="font-semibold text-lg text-[#6C5CE7]">{course.price ? `${course.price}₽/мес` : 'Бесплатно'}</span>
                    <span className="text-sm font-medium text-[#6C5CE7]">Подробнее →</span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center">
              <p className="text-gray-500">Нет доступных кружков в этой категории</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav items={navItems} />
    </div>
  );
}