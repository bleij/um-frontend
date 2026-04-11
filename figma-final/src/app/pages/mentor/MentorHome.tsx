import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, Target, MessageCircle } from 'lucide-react';

export function MentorHome() {
  const navigate = useNavigate();

  const students = [
    {
      id: 1,
      name: 'Анна Петрова',
      age: 8,
      level: 5,
      xp: 1250,
      avatar: 'https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop',
      progress: 85,
      skills: { communication: 85, leadership: 65, creativity: 90, logic: 75, discipline: 70 },
    },
    {
      id: 2,
      name: 'Максим Иванов',
      age: 14,
      level: 8,
      xp: 2450,
      avatar: 'https://images.unsplash.com/photo-1510340842445-b6b8a6c0762e?w=100&h=100&fit=crop',
      progress: 78,
      skills: { communication: 78, leadership: 65, creativity: 85, logic: 80, discipline: 72 },
    },
    {
      id: 3,
      name: 'София Смирнова',
      age: 10,
      level: 6,
      xp: 1680,
      avatar: 'https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop',
      progress: 92,
      skills: { communication: 90, leadership: 75, creativity: 88, logic: 85, discipline: 80 },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-green-700 p-6 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Мои подопечные</h1>
            <p className="text-sm opacity-90">Анна Сергеевна • Ментор</p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
            <img
              src="https://images.unsplash.com/photo-1610357285982-a5352a783962?w=200&h=200&fit=crop"
              alt="Ментор"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-xs opacity-90">Учеников</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">15</p>
            <p className="text-xs opacity-90">Планов развития</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">87%</p>
            <p className="text-xs opacity-90">Средний прогресс</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-6">
        {/* Students List */}
        <div>
          <h3 className="font-semibold text-lg mb-3 px-1">Список учеников</h3>
          <div className="space-y-3">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => navigate(`/mentor/child/${student.id}`)}
                className="w-full bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.age} лет</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs bg-purple-100 text-[#6C5CE7] px-2 py-1 rounded-full font-medium">
                        Level {student.level}
                      </span>
                      <span className="text-xs text-gray-500">{student.xp} XP</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#6C5CE7]">{student.progress}%</div>
                    <p className="text-xs text-gray-500">Прогресс</p>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(student.skills).map(([skill, value]) => (
                    <div key={skill} className="text-center">
                      <div className="h-16 flex items-end justify-center mb-1">
                        <div
                          className="w-full bg-gradient-to-t from-[#6C5CE7] to-purple-400 rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 capitalize">
                        {skill.slice(0, 3)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/mentor/learning-path/${student.id}`);
                    }}
                    className="flex-1 py-2 bg-[#6C5CE7] text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Target className="w-4 h-4" />
                    План развития
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/teen/mentor-chat');
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#6C5CE7]" />
            Общая статистика
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-purple-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#6C5CE7]">42</p>
              <p className="text-xs text-gray-600">Рекомендаций дано</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-600">28</p>
              <p className="text-xs text-gray-600">Целей достигнуто</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
