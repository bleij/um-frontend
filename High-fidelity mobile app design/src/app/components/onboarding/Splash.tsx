import { motion } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding/role-selection");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen relative shadow-2xl flex items-center justify-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1]
          }}
          className="text-center"
        >
          {/* Logo Circle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 relative"
          >
            <div className="w-32 h-32 mx-auto rounded-[32px] bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl flex items-center justify-center">
              <span className="text-6xl font-bold text-white tracking-tight">UM</span>
            </div>
            
            {/* Glow Effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-32 h-32 mx-auto rounded-[32px] bg-white/20 blur-2xl -z-10"
            />
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-white mb-2">Universal Mind</h1>
            <p className="text-white/70 text-sm">Unlock Your Child's Potential</p>
          </motion.div>

          {/* Loading Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-12"
          >
            <div className="flex gap-2 justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 rounded-full bg-white"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
