import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Header } from '../../components/Header';
import { Star, MapPin, Clock, User, Calendar, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getParentProfileByUserId, getChildrenByParentId } from '../../lib/users';
import { getCourseById } from '../../lib/courses';
import { enrollInCourse, isEnrolled, unenrollFromCourse } from '../../lib/enrollments';

export function ParentClubDetail() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const { user } = useAuth();
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'pending' | 'confirmed' | 'already' | 'unenrolling' | 'unenrolled'>('idle');
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [club, setClub] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      if (!user || !clubId) return;
      
      try {
        const course = await getCourseById(clubId);
        setClub(course);

        const parentProfile = await getParentProfileByUserId(user.id);
        if (parentProfile) {
          const childrenList = await getChildrenByParentId(parentProfile.id);
          setChildren(childrenList);
          if (childrenList.length > 0) {
            setSelectedChild(childrenList[0].id);
            
            // Проверяем уже записан ли
            const enrolled = await isEnrolled(clubId, childrenList[0].id);
            if (enrolled) {
              setEnrollmentStatus('already');
            }
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    }
    
    loadData();
  }, [user, clubId]);

  const handleEnroll = async () => {
    if (!selectedChild || !clubId) return;
    
    setEnrollmentStatus('pending');
    
    try {
      await enrollInCourse(clubId, selectedChild, 'child');
      setTimeout(() => {
        setEnrollmentStatus('confirmed');
      }, 1000);
    } catch (error) {
      console.error('Ошибка записи:', error);
      setEnrollmentStatus('idle');
    }
  };

  const handleUnenroll = async () => {
    if (!selectedChild || !clubId) return;
    
    setEnrollmentStatus('unenrolling');
    
    try {
      await unenrollFromCourse(clubId, selectedChild);
      setTimeout(() => {
        setEnrollmentStatus('unenrolled');
        // Через 2 секунды переходим обратно к списку кружков
        setTimeout(() => {
          navigate('/parent/clubs');
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error('Ошибка отписки:', error);
      setEnrollmentStatus('already');
    }
  };

  if (!club) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  const reviews = [
    { id: 1, author: 'Елена К.', rating: 5, text: 'Отличная студия! Дочка с удовольствием ходит на занятия.' },
    { id: 2, author: 'Андрей М.', rating: 5, text: 'Профессиональный подход, видны результаты.' },
    { id: 3, author: 'Ольга П.', rating: 4, text: 'Хорошая программа, но хотелось бы больше практики.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative">
        <img src={club.image_url || 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=400'} alt={club.title} className="w-full h-72 object-cover" />
        <button
          onClick={() => navigate('/parent/clubs')}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          ←
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Title and Rating */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{club.title}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{club.rating || 4.5}</span>
            </div>
            <span className="text-gray-500 text-sm">(3 отзыва)</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-2">Описание</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{club.description || 'Подробное описание курса скоро будет доступно.'}</p>
        </div>

        {/* Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              👥
            </div>
            <div>
              <p className="font-medium text-sm">Возраст</p>
              <p className="text-gray-600 text-sm">{club.age_group} лет</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <div>
              <p className="font-medium text-sm">Длительность</p>
              <p className="text-gray-600 text-sm">{club.duration || 'Уточняется'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <div>
              <p className="font-medium text-sm">Формат</p>
              <p className="text-gray-600 text-sm">{club.format || 'Уточняется'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <div>
              <p className="font-medium text-sm">Категория</p>
              <p className="text-gray-600 text-sm">{club.category || 'Общее'}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3">Отзывы</h3>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{review.author}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600">Стоимость</span>
            <span className="text-2xl font-bold text-[#6C5CE7]">{club.price ? `${club.price}₽/мес` : 'Бесплатно'}</span>
          </div>
          <p className="text-xs text-gray-500">
            При подтверждении бронирования будет списан депозит 25% от суммы месяца.
            Оставшаяся сумма оплачивается после начала занятий.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        {enrollmentStatus === 'idle' && (
          <button
            onClick={handleEnroll}
            className="w-full py-4 bg-[#6C5CE7] text-white rounded-2xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Записаться
          </button>
        )}
        {enrollmentStatus === 'pending' && (
          <div className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-semibold text-center">
            ⏳ Ожидание подтверждения...
          </div>
        )}
        {enrollmentStatus === 'confirmed' && (
          <div className="w-full py-4 bg-green-500 text-white rounded-2xl font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Запись подтверждена!
          </div>
        )}
        {enrollmentStatus === 'already' && (
          <div className="space-y-3">
            <div className="bg-green-50 border-2 border-green-500 text-green-800 py-3 rounded-2xl font-semibold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Вы уже записаны на этот курс
            </div>
            <button
              onClick={handleUnenroll}
              className="w-full py-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Отписаться от курса
            </button>
          </div>
        )}
        {enrollmentStatus === 'unenrolling' && (
          <div className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-semibold text-center">
            ⏳ Обработка отписки...
          </div>
        )}
        {enrollmentStatus === 'unenrolled' && (
          <div className="w-full py-4 bg-green-500 text-white rounded-2xl font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Вы успешно отписаны!
          </div>
        )}
      </div>
    </div>
  );
}