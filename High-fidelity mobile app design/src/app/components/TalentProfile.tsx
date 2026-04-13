import { useOutletContext } from "react-router";
import { Calendar, MapPin, Mail, GraduationCap, ArrowUpRight } from "lucide-react";
import { TalentRadar } from "./TalentRadar";
import { motion } from "motion/react";

interface OutletContext {
  theme: 'light' | 'dark';
}

const talentData = [
  { talent: 'Creative', value: 85, fullMark: 100 },
  { talent: 'Analytical', value: 72, fullMark: 100 },
  { talent: 'Leadership', value: 68, fullMark: 100 },
  { talent: 'Technical', value: 90, fullMark: 100 },
  { talent: 'Social', value: 75, fullMark: 100 },
  { talent: 'Athletic', value: 62, fullMark: 100 },
];

const topSkills = [
  { name: "Web Development", level: 90, trend: "+12%" },
  { name: "Creative Writing", level: 85, trend: "+8%" },
  { name: "Data Analysis", level: 78, trend: "+15%" },
];

export function TalentProfile() {
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Talent Profile</h1>
        <p className="text-muted-foreground text-sm">Your complete talent overview</p>
      </div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-card rounded-[24px] p-6 mb-6 border border-border ${isDark ? 'shadow-[0_0_25px_rgba(183,148,246,0.3)]' : 'shadow-xl'}`}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-xl mb-1">Alex Rivera</h2>
            <p className="text-muted-foreground text-sm">@alexrivera</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Age 16 • Born June 15, 2010</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Riverside High School, Grade 11</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">alex.rivera@example.com</span>
          </div>
        </div>
      </motion.div>

      {/* Talent Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card rounded-[24px] p-6 border border-border shadow-xl"
      >
        <h3 className="mb-4">Talent Distribution</h3>
        <div className="h-[300px]">
          <TalentRadar data={talentData} isDark={isDark} instanceId="profile" />
        </div>
      </motion.div>

      {/* Top Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`bg-card rounded-[24px] p-6 border border-border ${isDark ? 'shadow-[0_0_25px_rgba(183,148,246,0.3)]' : 'shadow-xl'}`}
      >
        <h3 className="mb-4">Top Skills</h3>
        <div className="space-y-4">
          {topSkills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {skill.trend}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{
                    boxShadow: isDark ? '0 0 10px rgba(183, 148, 246, 0.5)' : 'none'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}