import { motion } from "motion/react";
import { Users, Sparkles } from "lucide-react";
import { Link } from "react-router";

export function RoleSelection() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-[24px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
              <span className="text-3xl font-bold text-white">UM</span>
            </div>
            <h1 className="text-3xl mb-3">Welcome to UM</h1>
            <p className="text-muted-foreground">Choose your role to get started</p>
          </motion.div>

          {/* Role Cards */}
          <div className="space-y-4 mb-8">
            {/* Parent Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                to="/onboarding/login"
                className="block"
              >
                <div className="bg-card rounded-[24px] p-6 border-2 border-border hover:border-primary transition-all shadow-lg hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-2">I am a Parent</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Monitor and guide your child's talent development journey
                      </p>
                      
                      {/* Features */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-muted-foreground">Track progress & achievements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-muted-foreground">Connect with mentors</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-muted-foreground">Personalized recommendations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Teenager Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                to="/onboarding/login"
                className="block"
              >
                <div className="bg-card rounded-[24px] p-6 border-2 border-border hover:border-secondary transition-all shadow-lg hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-2">I am a Teenager</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Discover your talents and explore exciting career paths
                      </p>
                      
                      {/* Features */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          <span className="text-xs text-muted-foreground">Interactive talent radar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          <span className="text-xs text-muted-foreground">Earn achievements & badges</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          <span className="text-xs text-muted-foreground">AI-powered course matching</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Bottom Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              Join thousands of families unlocking potential
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
