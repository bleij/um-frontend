import { useOutletContext } from "react-router";
import { TrendingUp, Calendar, Clock, Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "motion/react";
import { useId } from "react";

interface OutletContext {
  theme: 'light' | 'dark';
}

const progressData = [
  { week: 'W1', score: 65 },
  { week: 'W2', score: 68 },
  { week: 'W3', score: 72 },
  { week: 'W4', score: 75 },
  { week: 'W5', score: 78 },
  { week: 'W6', score: 82 },
  { week: 'W7', score: 84 },
];

const recentActivities = [
  {
    date: "Today, 2:30 PM",
    activity: "Completed Data Structures Quiz",
    score: 95,
    talent: "Analytical",
  },
  {
    date: "Today, 10:15 AM",
    activity: "Creative Writing Workshop",
    score: 88,
    talent: "Creative",
  },
  {
    date: "Yesterday, 4:45 PM",
    activity: "Team Leadership Exercise",
    score: 82,
    talent: "Leadership",
  },
  {
    date: "Yesterday, 11:00 AM",
    activity: "Web Development Project",
    score: 92,
    talent: "Technical",
  },
];

export function Progress() {
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';
  const chartId = useId();
  const gradientId = `colorScore-${chartId}`;

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Progress Tracking</h1>
        <p className="text-muted-foreground text-sm">Monitor your growth journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`bg-card rounded-[24px] p-4 border border-border ${isDark ? 'shadow-[0_0_20px_rgba(183,148,246,0.2)]' : 'shadow-lg'}`}
        >
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3 ${isDark ? 'shadow-[0_0_15px_rgba(183,148,246,0.4)]' : ''}`}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl mb-1">+19%</p>
          <p className="text-muted-foreground text-xs">This Month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`bg-card rounded-[24px] p-4 border border-border ${isDark ? 'shadow-[0_0_20px_rgba(183,148,246,0.2)]' : 'shadow-lg'}`}
        >
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center mb-3 ${isDark ? 'shadow-[0_0_15px_rgba(255,215,0,0.4)]' : ''}`}>
            <Flame className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl mb-1">12</p>
          <p className="text-muted-foreground text-xs">Day Streak</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`bg-card rounded-[24px] p-4 border border-border ${isDark ? 'shadow-[0_0_20px_rgba(183,148,246,0.2)]' : 'shadow-lg'}`}
        >
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3`}>
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl mb-1">28</p>
          <p className="text-muted-foreground text-xs">Activities</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={`bg-card rounded-[24px] p-4 border border-border ${isDark ? 'shadow-[0_0_20px_rgba(183,148,246,0.2)]' : 'shadow-lg'}`}
        >
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3`}>
            <Clock className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl mb-1">47h</p>
          <p className="text-muted-foreground text-xs">Total Time</p>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className={`bg-card rounded-[24px] p-6 mb-6 border border-border ${isDark ? 'shadow-[0_0_25px_rgba(183,148,246,0.3)]' : 'shadow-xl'}`}
      >
        <h3 className="mb-4">7-Week Trend</h3>
        <div className="h-[200px]" key={chartId}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData} id={chartId}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? "#b794f6" : "#6200EE"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isDark ? "#b794f6" : "#6200EE"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="week" 
                stroke={isDark ? "#9ca3af" : "#6b7280"}
                fontSize={12}
                tickLine={false}
                key={`xaxis-${chartId}`}
              />
              <YAxis 
                stroke={isDark ? "#9ca3af" : "#6b7280"}
                fontSize={12}
                tickLine={false}
                domain={[60, 90]}
                key={`yaxis-${chartId}`}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke={isDark ? "#b794f6" : "#6200EE"}
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                key={`area-${chartId}`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <h3 className="mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((item, index) => (
            <div
              key={index}
              className={`bg-card rounded-[24px] p-4 border border-border ${isDark ? 'shadow-[0_0_20px_rgba(183,148,246,0.2)]' : 'shadow-lg'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm mb-1">{item.activity}</h4>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  item.score >= 90 
                    ? 'bg-accent/20 text-accent' 
                    : item.score >= 80 
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {item.score}%
                </div>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs">
                {item.talent}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}