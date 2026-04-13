import { useState } from "react";
import { Lock, MessageCircle, Sparkles, ChevronRight, ArrowLeft, Clock } from "lucide-react";
import { TalentRadar } from "./TalentRadar";
import { motion } from "motion/react";
import { Link } from "react-router";

const children = [
  { id: 1, name: "Alikhan", avatar: "👦", active: true },
  { id: 2, name: "Aiym", avatar: "👧", active: false },
  { id: 3, name: "Arman", avatar: "👦", active: false },
];

const talentData = [
  { talent: 'Logic', value: 82, fullMark: 100 },
  { talent: 'Creativity', value: 75, fullMark: 100 },
  { talent: 'EQ', value: 88, fullMark: 100 },
  { talent: 'Physical', value: 70, fullMark: 100 },
  { talent: 'Leadership', value: 78, fullMark: 100 },
  { talent: 'Social', value: 85, fullMark: 100 },
];

export function ParentDashboard() {
  const [isPremium, setIsPremium] = useState(false);
  const [activeChild, setActiveChild] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl">
        <div className="px-6 pt-8 pb-24">
          {/* Back Button */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 mb-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Teen View</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl mb-1">Hello, Sabina! 👋</h1>
            <p className="text-muted-foreground text-sm">Track your children's progress</p>
          </div>

          {/* Child Switcher */}
          <div className="mb-8">
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setActiveChild(child.id)}
                  className="flex-shrink-0 flex flex-col items-center gap-2 group"
                >
                  <div className={`relative ${activeChild === child.id ? 'scale-105' : ''} transition-all`}>
                    {/* Glowing ring for active child */}
                    {activeChild === child.id && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary blur-md opacity-60 animate-pulse" />
                    )}
                    <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-card border-2 transition-all ${
                      activeChild === child.id 
                        ? 'border-primary shadow-[0_0_20px_rgba(98,0,238,0.5)]' 
                        : 'border-border'
                    }`}>
                      {child.avatar}
                    </div>
                  </div>
                  <span className={`text-sm transition-all ${
                    activeChild === child.id 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}>
                    {child.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Premium Toggle (for demo purposes) */}
          <div className="mb-4 flex items-center justify-center">
            <button
              onClick={() => setIsPremium(!isPremium)}
              className={`px-4 py-2 rounded-full text-xs transition-all ${
                isPremium 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isPremium ? '✨ Premium Version' : '🔒 Lite Version'} (Tap to switch)
            </button>
          </div>

          {/* Radar Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-[24px] p-6 mb-6 border border-border shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3>Talent Map</h3>
              {!isPremium && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs">
                  <Lock className="w-3 h-3" />
                  <span>Lite</span>
                </div>
              )}
              {isPremium && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>

            {/* Version 1: Lite - Blurred with Lock */}
            {!isPremium && (
              <div className="relative h-[280px]">
                <div className="absolute inset-0 blur-lg opacity-30">
                  <TalentRadar key="lite-blur" data={talentData} isDark={false} instanceId="parent-lite" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <Lock className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="mb-2">Unlock Full Insights</h4>
                  <p className="text-muted-foreground text-sm text-center mb-4 max-w-[200px]">
                    Upgrade to Premium to see detailed talent analysis
                  </p>
                  <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:scale-105 transition-transform">
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}

            {/* Version 2: Premium - Full Detail */}
            {isPremium && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-[280px]"
              >
                <TalentRadar key="premium-full" data={talentData} isDark={false} instanceId="parent-premium" />
              </motion.div>
            )}
          </motion.div>

          {/* Weekly Schedule Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-card rounded-[24px] p-5 mb-6 border border-border shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3>Weekly Schedule</h3>
              {isPremium && (
                <Link 
                  to="/calendar"
                  className="flex items-center gap-1 text-primary text-sm hover:text-primary/80 transition-colors"
                >
                  <span>View Calendar</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            
            {/* Calendar Row */}
            <div className="flex gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const isToday = index === 2; // Wednesday is today
                return (
                  <div 
                    key={day}
                    className={`flex-1 flex flex-col items-center py-2 px-1 rounded-[12px] transition-all ${
                      isToday 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs mb-1">{day}</span>
                    <span className={`text-sm ${isToday ? 'font-semibold' : ''}`}>
                      {index + 6}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Active Class Card */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-[20px] p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white mb-0.5">Robotics Class</p>
                  <p className="text-white/70 text-sm">17:00</p>
                </div>
              </div>
              
              {/* Progress Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-[12px] bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-white text-sm">Focus: +15 XP Logic</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-3 gap-3 mb-6"
            >
              <div className="bg-card rounded-[20px] p-4 border border-border shadow-lg">
                <p className="text-2xl mb-1">8.2</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="bg-card rounded-[20px] p-4 border border-border shadow-lg">
                <p className="text-2xl mb-1">Top 15%</p>
                <p className="text-xs text-muted-foreground">Ranking</p>
              </div>
              <Link 
                to="/analytics"
                className="bg-gradient-to-br from-primary to-secondary rounded-[20px] p-4 shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                <p className="text-2xl mb-1 text-white">📊</p>
                <p className="text-xs text-white/90">Analytics</p>
              </Link>
            </motion.div>
          )}

          {/* Mentor Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-primary to-secondary rounded-[24px] p-5 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              {/* Mentor Photo */}
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border-2 border-white/30 flex-shrink-0">
                👩‍🏫
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm">Mentor Asel</p>
                  <div className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">
                    ⭐ 4.9
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-1">
                  "I have 3 tips for Alikhan"
                </p>
                <p className="text-white/70 text-xs">
                  To boost leadership & EQ skills
                </p>
              </div>
              
              <Link 
                to="/chat"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 flex-shrink-0 hover:bg-white/30 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Navigation - 5 Icons */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-card/95 backdrop-blur-xl border-t border-border">
          <div className="flex items-center justify-around px-4 py-3">
            <button className="flex flex-col items-center gap-1 px-3 py-2 text-primary">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs">Home</span>
            </button>
            
            <Link to="/courses" className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <span className="text-xs">Courses</span>
            </Link>
            
            <Link to="/chat" className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <MessageCircle className="w-6 h-6" strokeWidth={2} />
              <span className="text-xs">Chat</span>
              {/* Notification dot */}
              <div className="absolute top-1 right-2 w-2 h-2 bg-accent rounded-full border-2 border-card"/>
            </Link>
            
            <button className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span className="text-xs">Analytics</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}