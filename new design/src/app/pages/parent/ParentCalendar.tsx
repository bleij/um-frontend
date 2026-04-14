import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Home, Calendar as CalendarIcon, BookOpen, BarChart3, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useParentData } from '../../contexts/ParentDataContext';

export function ParentCalendar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { children } = useParentData();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1));
  const [selectedDate, setSelectedDate] = useState(27);

  const classes: any[] = [];

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const navItems = [
    { icon: Home, label: 'Главная', path: '/parent' },
    { icon: CalendarIcon, label: 'Календарь', path: '/parent/calendar' },
    { icon: BookOpen, label: 'Кружки', path: '/parent/clubs' },
    { icon: BarChart3, label: 'Отчеты', path: '/parent/reports' },
    { icon: User, label: 'Профиль', path: '/parent/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Календарь" showBack={true} dark={true} backPath="/parent" />

      <div className="p-4 space-y-4">
        {/* Month Selector */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day && setSelectedDate(day)}
                disabled={!day}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                  day === selectedDate
                    ? 'bg-[#6C5CE7] text-white font-bold'
                    : day
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'cursor-default'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Classes */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3">
            Занятия на {selectedDate} {monthNames[currentMonth.getMonth()].toLowerCase()}
          </h3>
          {classes.length > 0 ? (
            <div className="space-y-2">
              {classes.map((cls) => (
                <div key={cls.id} className="p-3 bg-purple-50 rounded-xl border-l-4 border-[#6C5CE7]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{cls.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{cls.child}</p>
                    </div>
                    <span className="text-sm font-medium text-[#6C5CE7]">{cls.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">На выбранный день нет занятий</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav items={navItems} />
    </div>
  );
}