import { ArrowLeft, ChevronLeft, ChevronRight, Clock, CheckCircle2, Video, Calendar as CalendarIcon } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";

const timeSlots = [
  { id: 1, time: "10:00", available: true },
  { id: 2, time: "11:30", available: true },
  { id: 3, time: "13:00", available: false },
  { id: 4, time: "15:00", available: true },
  { id: 5, time: "16:30", available: true },
  { id: 6, time: "18:00", available: false },
];

const discussionPoints = [
  { id: 1, title: "Talent map review", description: "Deep dive into Alikhan's strengths" },
  { id: 2, title: "Career path adjustment", description: "Align activities with future goals" },
  { id: 3, title: "School recommendations", description: "Best programs for your child" },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Generate calendar days for April 2026
const generateCalendarDays = () => {
  const days = [];
  const firstDay = 3; // April 1, 2026 is Wednesday (0 = Monday)
  const totalDays = 30;
  
  // Add empty slots for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }
  
  return days;
};

export function BookSession() {
  const [selectedDate, setSelectedDate] = useState(8); // April 8 (today)
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [currentMonth] = useState("April 2026");

  const calendarDays = generateCalendarDays();
  const today = 8; // Today is April 8

  const handleDateSelect = (day: number | null) => {
    if (day && day >= today) {
      setSelectedDate(day);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleTimeSelect = (slotId: number) => {
    const slot = timeSlots.find(s => s.id === slotId);
    if (slot?.available) {
      setSelectedTime(slotId);
    }
  };

  const canConfirm = selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl">
        <div className="px-6 pt-8 pb-32 overflow-y-auto">
          {/* Back Button */}
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Chat</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-3xl mb-2">Book a Session</h1>
            <p className="text-muted-foreground">Choose your preferred time</p>
          </motion.div>

          {/* Mentor Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card rounded-[24px] p-5 mb-6 border border-border shadow-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              {/* Mentor Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
                  👩‍🏫
                </div>
                {/* Online Status */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
              </div>
              
              {/* Mentor Info */}
              <div className="flex-1 min-w-0">
                <h3 className="mb-1">Asel</h3>
                <p className="text-sm text-muted-foreground mb-2">Child Psychologist</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-accent">⭐</span>
                    <span className="text-sm font-semibold">4.9</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span className="text-sm text-muted-foreground">127 sessions</span>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="flex items-center gap-3 p-3 rounded-[16px] bg-primary/5 border border-primary/10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">30-minute Video Consultation</p>
                <p className="text-xs text-muted-foreground">Private one-on-one session</p>
              </div>
            </div>
          </motion.div>

          {/* Calendar Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card rounded-[24px] p-5 mb-6 border border-border shadow-xl"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <h3>{currentMonth}</h3>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center py-2">
                  <span className="text-xs text-muted-foreground font-medium">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} />;
                }

                const isToday = day === today;
                const isSelected = day === selectedDate;
                const isPast = day < today;
                const isAvailable = !isPast;

                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    disabled={isPast}
                    className={`
                      aspect-square rounded-[12px] text-sm font-medium transition-all
                      ${isPast ? 'text-muted-foreground/30 cursor-not-allowed' : ''}
                      ${isSelected ? 'bg-primary text-white shadow-lg scale-105' : ''}
                      ${!isSelected && isAvailable ? 'hover:bg-muted text-foreground' : ''}
                      ${isToday && !isSelected ? 'border-2 border-primary' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Time Slots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3>Available Times</h3>
              <span className="text-sm text-muted-foreground">
                April {selectedDate}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.id;
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleTimeSelect(slot.id)}
                    disabled={!slot.available}
                    className={`
                      py-3 px-4 rounded-[16px] text-sm font-medium transition-all
                      ${!slot.available ? 'bg-muted text-muted-foreground/50 cursor-not-allowed line-through' : ''}
                      ${isSelected ? 'bg-primary text-white shadow-lg scale-105' : ''}
                      ${slot.available && !isSelected ? 'bg-card border-2 border-border hover:border-primary text-foreground' : ''}
                    `}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-card rounded-[24px] p-5 mb-6 border border-border shadow-xl"
          >
            <h3 className="mb-4">What We Will Discuss</h3>
            
            <div className="space-y-3">
              {discussionPoints.map((point, index) => (
                <div key={point.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground mb-0.5">{point.title}</p>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Summary Card (if date and time selected) */}
          {canConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[24px] p-5 mb-6 border border-primary/20"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-1">Your Session</p>
                  <p className="text-sm text-muted-foreground">
                    April {selectedDate}, 2026 at {timeSlots.find(s => s.id === selectedTime)?.time}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer - Fixed at Bottom */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-card/95 backdrop-blur-xl border-t border-border px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {/* Price and Button */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-foreground">5 000 ₸</p>
              </div>
              <button
                disabled={!canConfirm}
                className={`
                  px-8 py-4 rounded-[20px] font-semibold transition-all
                  ${canConfirm 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-2xl hover:scale-105' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                {canConfirm ? 'Confirm & Pay' : 'Select Time'}
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              By confirming, you agree to our terms & conditions
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
