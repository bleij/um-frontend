import { Brain, Moon, Sparkles, Sun, Target, Users } from "lucide-react";
import { motion } from "motion/react";
import { Link, useOutletContext } from "react-router";
import { TalentRadar } from "./TalentRadar";

interface OutletContext {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const talentData = [
  { talent: "Creative", value: 85, fullMark: 100 },
  { talent: "Analytical", value: 72, fullMark: 100 },
  { talent: "Leadership", value: 68, fullMark: 100 },
  { talent: "Technical", value: 90, fullMark: 100 },
  { talent: "Social", value: 75, fullMark: 100 },
  { talent: "Athletic", value: 62, fullMark: 100 },
];

const insights = [
  {
    icon: Brain,
    title: "AI Insight",
    description: "Strong technical and creative balance detected",
    color: "text-primary",
  },
  {
    icon: Target,
    title: "Focus Area",
    description: "Leadership skills show great potential",
    color: "text-accent",
  },
];

export function Dashboard() {
  const { theme, toggleTheme } = useOutletContext<OutletContext>();
  const isDark = theme === "dark";

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-10 h-10 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center ${isDark ? "shadow-[0_0_20px_rgba(183,148,246,0.6)]" : "shadow-lg"}`}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl">UM</h1>
          </div>
          <p className="text-muted-foreground text-sm">Ursa Major</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/parent"
            className={`w-12 h-12 rounded-3xl bg-card border border-border flex items-center justify-center transition-all hover:scale-105 ${isDark ? "shadow-[0_0_15px_rgba(183,148,246,0.4)]" : "shadow-lg"}`}
            title="Parent Dashboard"
          >
            <Users className="w-5 h-5 text-primary" />
          </Link>
          <button
            onClick={toggleTheme}
            className={`w-12 h-12 rounded-3xl bg-card border border-border flex items-center justify-center transition-all hover:scale-105 ${isDark ? "shadow-[0_0_15px_rgba(183,148,246,0.4)]" : "shadow-lg"}`}
          >
            {isDark ? (
              <Moon className="w-5 h-5 text-secondary" />
            ) : (
              <Sun className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-gradient-to-br from-primary to-secondary rounded-[24px] p-6 mb-6 ${isDark ? "shadow-[0_0_30px_rgba(183,148,246,0.4)]" : "shadow-2xl"}`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-white text-xl">Alex Rivera</h2>
            <p className="text-white/80 text-sm">Age 16 • Student</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Talent Score</p>
            <p className="text-white text-xl">8.4/10</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Rank</p>
            <p className="text-white text-xl">#127</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Streak</p>
            <p className="text-white text-xl">12d</p>
          </div>
        </div>
      </motion.div>

      {/* Talent Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-[24px] p-6 mb-6 border border-border shadow-xl"
      >
        <h3 className="mb-4">Talent Map</h3>
        <div className="h-[280px]">
          <TalentRadar
            data={talentData}
            isDark={isDark}
            instanceId="dashboard"
          />
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="mb-3">AI Insights</h3>
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`bg-card rounded-[24px] p-5 border border-border ${isDark ? "shadow-[0_0_20px_rgba(183,148,246,0.2)]" : "shadow-lg"}`}
          >
            <div className="flex gap-4">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${isDark ? "from-primary/20 to-secondary/20" : "from-primary/10 to-secondary/10"} flex items-center justify-center flex-shrink-0`}
              >
                <insight.icon className={`w-6 h-6 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="mb-1">{insight.title}</h4>
                <p className="text-muted-foreground text-sm">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
