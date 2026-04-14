import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function OrgAttendance() {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState('art');

  const clubs = [
    { id: 'art', name: 'Художественная студия' },
    { id: 'football', name: 'Футбол' },
    { id: 'coding', name: 'Программирование' },
  ];

  const sessions = [
    { date: '21 фев', day: 'ПН' },
    { date: '23 фев', day: 'СР' },
    { date: '26 фев', day: 'ПН' },
    { date: '28 фев', day: 'СР' },
  ];

  const students = [
    {
      id: 1,
      name: 'Анна Петрова',
      attendance: [true, true, true, false],
      avatar: 'https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Мария Иванова',
      attendance: [true, false, true, true],
      avatar: 'https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'София Смирнова',
      attendance: [true, true, true, true],
      avatar: 'https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'Елизавета Новикова',
      attendance: [false, true, true, true],
      avatar: 'https://images.unsplash.com/photo-1628435509114-969a718d64e8?w=100&h=100&fit=crop',
    },
  ];

  const getAttendanceRate = (attendance: boolean[]) => {
    const attended = attendance.filter(Boolean).length;
    return Math.round((attended / attendance.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/organization')} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Посещаемость</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Club Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {clubs.map((club) => (
            <button
              key={club.id}
              onClick={() => setSelectedClub(club.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                selectedClub === club.id
                  ? 'bg-[#6C5CE7] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {club.name}
            </button>
          ))}
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex border-b border-gray-200">
            <div className="flex-1 p-3 font-semibold text-sm bg-gray-50">Ученик</div>
            {sessions.map((session, index) => (
              <div key={index} className="w-16 p-3 text-center bg-gray-50 border-l border-gray-200">
                <p className="text-xs font-medium">{session.day}</p>
                <p className="text-[10px] text-gray-500">{session.date}</p>
              </div>
            ))}
            <div className="w-16 p-3 text-center bg-gray-50 border-l border-gray-200">
              <p className="text-xs font-medium">%</p>
            </div>
          </div>

          {/* Students */}
          {students.map((student, studentIndex) => (
            <div
              key={student.id}
              className={`flex items-center ${studentIndex !== students.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex-1 p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium">{student.name}</span>
                </div>
              </div>
              {student.attendance.map((attended, index) => (
                <div
                  key={index}
                  className="w-16 p-3 flex items-center justify-center border-l border-gray-100"
                >
                  {attended ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              ))}
              <div className="w-16 p-3 text-center border-l border-gray-100">
                <span className={`text-sm font-bold ${
                  getAttendanceRate(student.attendance) >= 75 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {getAttendanceRate(student.attendance)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">92%</p>
            <p className="text-xs text-gray-600">Средняя посещаемость</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-[#6C5CE7]">{students.length}</p>
            <p className="text-xs text-gray-600">Всего учеников</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
            <p className="text-xs text-gray-600">Занятий проведено</p>
          </div>
        </div>
      </div>
    </div>
  );
}
