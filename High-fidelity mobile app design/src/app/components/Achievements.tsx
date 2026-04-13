import { useOutletContext } from "react-router";
import { Trophy, Star, Award, Crown, Zap, Target } from "lucide-react";
import { motion } from "motion/react";

interface OutletContext {
  theme: 'light' | 'dark';
}

const achievements = [
  {
    icon: Trophy,
    title: "Top Performer",
    description: "Ranked in top 5% this month",
    progress: 100,
    color: "from-accent to-yellow-500",
    earned: true,
    points: 500,
  },
  {
    icon: Star,
    title: "Rising Star",
    description: "Complete 10 skill assessments",
    progress: 80,
    color: "from-primary to-secondary",
    earned: false,
    points: 300,
  },
  {
    icon: Zap,
    title: "Fast Learner",
    description: "Master 3 skills in one week",
    progress: 100,
    color: "from-purple-500 to-pink-500",
    earned: true,
    points: 400,
  },
  {
    icon: Target,
    title: "Goal Crusher",
    description: "Achieve 5 personal goals",
    progress: 60,
    color: "from-blue-500 to-cyan-500",
    earned: false,
    points: 250,
  },
  {
    icon: Crown,
    title: "Talent Master",
    description: "Reach level 10 in any talent",
    progress: 45,
    color: "from-accent to-orange-500",
    earned: false,
    points: 1000,
  },
  {
    icon: Award,
    title: "Consistent",
    description: "30-day learning streak",
    progress: 40,
    color: "from-green-500 to-emerald-500",
    earned: false,
    points: 350,
  },
];

export function Achievements() {
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';

  const totalPoints = achievements
    .filter(a => a.earned)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Achievements</h1>
        <p className="text-muted-foreground text-sm">Your earned rewards and badges</p>
      </div>

      {/* Points Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-gradient-to-br from-accent to-yellow-500 rounded-[24px] p-6 mb-6 ${isDark ? 'shadow-[0_0_30px_rgba(255,215,0,0.4)]' : 'shadow-2xl'}`}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-3 border-2 border-white/30">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-white text-3xl mb-1">{totalPoints}</h2>
          <p className="text-white/80 text-sm">Total Achievement Points</p>
        </div>
      </motion.div>

      {/* Achievement Grid */}
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-card rounded-[24px] p-5 border border-border overflow-hidden relative ${
              isDark ? 'shadow-[0_0_20px_rgba(183,148,246,0.2)]' : 'shadow-lg'
            } ${achievement.earned ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}`}
          >
            {/* Background gradient for earned badges */}
            {achievement.earned && (
              <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-5`} />
            )}
            
            <div className="relative flex gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0 ${
                isDark && achievement.earned ? 'shadow-[0_0_20px_rgba(183,148,246,0.4)]' : ''
              } ${!achievement.earned ? 'opacity-40 grayscale' : ''}`}>
                <achievement.icon className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="mb-1 flex items-center gap-2">
                      {achievement.title}
                      {achievement.earned && (
                        <span className="text-accent">✓</span>
                      )}
                    </h4>
                    <p className="text-muted-foreground text-sm">{achievement.description}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {!achievement.earned && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-muted-foreground">{achievement.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${achievement.color} rounded-full transition-all duration-500`}
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Points Badge */}
                <div className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs ${
                  achievement.earned 
                    ? 'bg-accent/20 text-accent' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Star className="w-3 h-3" />
                  {achievement.points} pts
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
