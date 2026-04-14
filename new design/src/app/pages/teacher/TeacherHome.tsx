import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TeacherTabBar } from '../../components/TeacherTabBar';
import { Clock, MapPin, QrCode, AlertCircle } from 'lucide-react';
import { getTodayLessons, getTeacherProfile, type TeacherLesson } from '../../lib/teacher';
import { QRScanner } from '../../components/QRScanner';

export function TeacherHome() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Получаем teacher_id из localStorage (должен быть установлен при логине)
      const storedTeacherId = localStorage.getItem('teacher_id');
      
      if (!storedTeacherId) {
        console.error('Teacher ID not found');
        return;
      }
      
      setTeacherId(storedTeacherId);
      
      // Загружаем уроки на сегодня
      const todayLessons = await getTodayLessons(storedTeacherId);
      setLessons(todayLessons);
    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getNextLesson = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return lessons.find(lesson => {
      const [hours, minutes] = lesson.time.split(':').map(Number);
      const lessonTime = hours * 60 + minutes;
      return lessonTime > currentTime;
    });
  };

  const getTimeUntilLesson = (lessonTime: string) => {
    const now = new Date();
    const [hours, minutes] = lessonTime.split(':').map(Number);
    const lesson = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const diff = lesson.getTime() - now.getTime();
    const minutesLeft = Math.floor(diff / (1000 * 60));
    
    if (minutesLeft <= 0) return 'Урок идёт';
    if (minutesLeft < 60) return `Через ${minutesLeft} мин`;
    const hoursLeft = Math.floor(minutesLeft / 60);
    return `Через ${hoursLeft} ч ${minutesLeft % 60} мин`;
  };

  const nextLesson = getNextLesson();

  const handleScanSuccess = async (data: string) => {
    console.log('QR Code scanned:', data);
    setShowScanner(false);
    
    // Здесь должна быть логика активации ученика
    // data содержит student_id из QR кода
    alert(`Ученик активирован: ${data}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5CE7] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Моё расписание</h1>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6">
        {/* Next Lesson Alert */}
        {nextLesson && (
          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#A78BFA] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Следующий урок</span>
              </div>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {getTimeUntilLesson(nextLesson.time)}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{nextLesson.course_title}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{nextLesson.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{nextLesson.location || 'Не указано'}</span>
              </div>
            </div>
          </div>
        )}

        {/* QR Scanner Button */}
        <button
          onClick={() => setShowScanner(true)}
          className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#6C5CE7] to-[#A78BFA] rounded-2xl flex items-center justify-center">
                <QrCode className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-lg">Сканер QR</h3>
                <p className="text-sm text-gray-600 mt-0.5">Активация новых учеников</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600">→</span>
            </div>
          </div>
        </button>

        {/* Today's Lessons */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Уроки на сегодня</h2>
          
          {lessons.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Нет уроков на сегодня</p>
              <p className="text-sm text-gray-500 mt-2">Отдохните и подготовьтесь к завтра</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/teacher/groups/${lesson.group_id}`)}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {lesson.course_title}
                      </h3>
                      <p className="text-sm text-gray-600">{lesson.group_name}</p>
                    </div>
                    <span className="text-2xl font-bold text-[#6C5CE7] ml-4">
                      {lesson.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{lesson.location || 'Не указано'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      <TeacherTabBar />
    </div>
  );
}
