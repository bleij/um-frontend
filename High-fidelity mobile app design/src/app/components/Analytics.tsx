import { ArrowLeft, TrendingUp, Briefcase, Star, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { useId } from "react";

const skillDynamicsData = [
  { month: 'W1', lastMonth: 68, currentMonth: 70 },
  { month: 'W2', lastMonth: 70, currentMonth: 73 },
  { month: 'W3', lastMonth: 72, currentMonth: 77 },
  { month: 'W4', lastMonth: 71, currentMonth: 80 },
  { month: 'W5', lastMonth: 73, currentMonth: 82 },
  { month: 'W6', lastMonth: 74, currentMonth: 85 },
];

const careerPredictions = [
  {
    id: 1,
    title: "Bio-Engineer",
    match: 92,
    description: "Genetic engineering & biotechnology",
    icon: "🧬",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "VR Architect",
    match: 87,
    description: "Virtual reality design & development",
    icon: "🥽",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "AI Research Scientist",
    match: 84,
    description: "Machine learning & neural networks",
    icon: "🤖",
    color: "from-indigo-500 to-purple-500"
  },
];

const recentFeedback = [
  {
    id: 1,
    activity: "Chess Club",
    rating: 5,
    feedback: "Improved concentration noted by AI",
    mentor: "Mentor Kairat",
    date: "2 days ago",
    avatar: "♟️"
  },
  {
    id: 2,
    activity: "Robotics Workshop",
    rating: 5,
    feedback: "Excellent problem-solving skills demonstrated",
    mentor: "Mentor Aigul",
    date: "4 days ago",
    avatar: "🤖"
  },
  {
    id: 3,
    activity: "Creative Writing",
    rating: 4,
    feedback: "Strong storytelling, work on structure",
    mentor: "Mentor Daniyar",
    date: "1 week ago",
    avatar: "✍️"
  },
];

export function Analytics() {
  const chartId = useId();

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
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-3xl">Analytics</h1>
            </div>
            <p className="text-muted-foreground">Deep insights into growth patterns</p>
          </motion.div>

          {/* Widget 1: Skill Dynamics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card rounded-[24px] p-6 mb-6 border border-border shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3>Skill Dynamics</h3>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-primary font-semibold">+12%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-[2px] border-t-2 border-dashed border-muted-foreground" />
                <span className="text-xs text-muted-foreground">Last Month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-[2px] bg-primary" />
                <span className="text-xs text-primary font-semibold">Current Month</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[220px]" key={chartId}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={skillDynamicsData} id={chartId}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    vertical={false}
                    key={`grid-${chartId}`}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    key={`xaxis-${chartId}`}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    domain={[60, 90]}
                    key={`yaxis-${chartId}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="lastMonth"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#9ca3af', r: 3 }}
                    key={`line-last-${chartId}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="currentMonth"
                    stroke="#6200EE"
                    strokeWidth={3}
                    dot={{ fill: '#6200EE', r: 4 }}
                    key={`line-current-${chartId}`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Widget 2: Career Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3>Career Predictions</h3>
            </div>

            <div className="space-y-3">
              {careerPredictions.map((career, index) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="bg-card rounded-[24px] p-5 border border-border shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden relative group"
                >
                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${career.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  <div className="relative flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${career.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                      {career.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{career.title}</h4>
                        <span className="text-sm font-semibold text-primary">{career.match}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{career.description}</p>
                      
                      {/* Match Bar */}
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${career.match}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${career.color} rounded-full`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Widget 3: Recent Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-accent" />
              <h3>Recent Feedback</h3>
            </div>

            <div className="space-y-3">
              {recentFeedback.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="bg-card rounded-[24px] p-5 border border-border shadow-lg"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl flex-shrink-0">
                      {item.avatar}
                    </div>
                    
                    {/* Header */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{item.activity}</h4>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating
                                ? 'fill-accent text-accent'
                                : 'text-muted stroke-muted'
                            }`}
                          />
                        ))}
                        <span className="text-sm ml-1 text-foreground font-semibold">
                          {item.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Feedback Text */}
                  <div className="pl-[52px]">
                    <p className="text-sm text-muted-foreground mb-2">{item.feedback}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                        👨‍🏫
                      </div>
                      <span className="text-xs text-muted-foreground">{item.mentor}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
