import { ArrowLeft, Sparkles, Zap, Calendar as CalendarIcon, Clock } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";

const weekDays = [
  { day: "Mon", date: 5, isToday: false },
  { day: "Tue", date: 6, isToday: false },
  { day: "Wed", date: 7, isToday: true },
  { day: "Thu", date: 8, isToday: false },
  { day: "Fri", date: 9, isToday: false },
  { day: "Sat", date: 10, isToday: false },
  { day: "Sun", date: 11, isToday: false },
];

const scheduleData = [
  {
    id: 1,
    title: "Mathematics",
    time: "09:00",
    duration: "1h 30m",
    xp: 15,
    skill: "Logic",
    day: "Mon",
    color: "bg-primary/10 border-primary/30"
  },
  {
    id: 2,
    title: "Robotics",
    time: "17:00",
    duration: "2h",
    xp: 15,
    skill: "Logic",
    day: "Wed",
    color: "bg-gradient-to-br from-accent/20 to-primary/20 border-accent shadow-lg",
    isHighlighted: true
  },
  {
    id: 3,
    title: "Art & Design",
    time: "15:00",
    duration: "1h 30m",
    xp: 10,
    skill: "Creative",
    day: "Wed",
    color: "bg-primary/10 border-primary/30"
  },
  {
    id: 4,
    title: "English Club",
    time: "11:00",
    duration: "1h",
    xp: 8,
    skill: "Social",
    day: "Fri",
    color: "bg-primary/10 border-primary/30"
  },
];

const aiSlot = {
  day: "Thu",
  time: "14:00 - 16:00",
  suggestion: "Python intro class",
  reason: "Perfect free window"
};

export function Calendar() {
  const [selectedDay, setSelectedDay] = useState("Wed");

  const filteredSchedule = scheduleData.filter(item => item.day === selectedDay);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl">
        <div className="px-6 pt-8 pb-32">
          {/* Back Button */}
          <Link 
            to="/parent"
            className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="w-8 h-8 text-primary" />
              <h1 className="text-3xl">AI Calendar</h1>
            </div>
            <p className="text-muted-foreground">Smart scheduling for optimal learning</p>
          </motion.div>

          {/* Weekly Date Scroller */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 -mx-6 px-6 overflow-x-auto"
          >
            <div className="flex gap-3 pb-2">
              {weekDays.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(item.day)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-[20px] transition-all min-w-[70px] ${
                    selectedDay === item.day
                      ? "bg-primary text-white shadow-lg"
                      : item.isToday
                      ? "bg-accent/20 border-2 border-accent text-foreground"
                      : "bg-card border-2 border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="text-xs font-medium">{item.day}</span>
                  <span className="text-xl">{item.date}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Optimizer Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 p-4 rounded-[24px] bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/30"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-foreground">AI Optimizer</h3>
                <p className="text-sm text-muted-foreground">
                  High load on Wednesday, recommend moving <span className="font-semibold text-foreground">Art</span> to Saturday for better balance
                </p>
              </div>
            </div>
          </motion.div>

          {/* Schedule Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-xl mb-4">Today's Schedule</h2>

            {/* AI Slot Suggestion (only show for Thursday) */}
            {selectedDay === aiSlot.day && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-4 rounded-[24px] bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-primary">AI Slot Suggestion</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Free window on Thursday — perfect for a <span className="font-semibold text-foreground">{aiSlot.suggestion}</span>
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{aiSlot.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Schedule Cards */}
            <div className="space-y-3">
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-[24px] border-2 ${item.color} transition-all hover:scale-[1.02] cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{item.time}</span>
                          <span className="text-sm">• {item.duration}</span>
                        </div>
                      </div>
                      {item.isHighlighted && (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/90 shadow-md">
                          <Zap className="w-3.5 h-3.5 text-accent-foreground" />
                          <span className="text-xs font-semibold text-accent-foreground">
                            +{item.xp} XP {item.skill}
                          </span>
                        </div>
                      )}
                    </div>
                    {item.isHighlighted && (
                      <div className="pt-3 border-t border-accent/20">
                        <p className="text-xs text-muted-foreground">
                          ✨ Recently added to your schedule
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No classes scheduled for this day</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
