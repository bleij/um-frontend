import { ArrowLeft, Check, Sparkles, Calendar, TrendingUp, FileText, Target } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

const basicFeatures = [
  "Full 15-min test",
  "PDF report",
  "Top-3 career predictions"
];

const premiumFeatures = [
  "Everything in Basic",
  "Unlimited tests",
  "Skill Growth Dynamics chart",
  "AI-Calendar with smart scheduling",
  "Partner discounts"
];

export function SubscriptionPlan() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
      {/* Watermark - Radar Chart Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="text-accent text-[200px] leading-none" style={{
          textShadow: '0 0 40px rgba(255, 193, 7, 0.6)'
        }}>
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <circle cx="150" cy="150" r="100" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <circle cx="150" cy="150" r="60" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <line x1="150" y1="10" x2="150" y2="290" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <line x1="10" y1="150" x2="290" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <line x1="40" y1="40" x2="260" y2="260" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <line x1="260" y1="40" x2="40" y2="260" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <polygon points="150,50 220,110 240,190 180,250 120,250 60,190 80,110" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
      </div>

      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen relative shadow-2xl">
        <div className="px-6 pt-8 pb-32 relative z-10">
          {/* Back Button */}
          <Link 
            to="/parent"
            className="inline-flex items-center gap-2 mb-8 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl text-white mb-2">Choose your development path</h1>
          </motion.div>

          {/* Pricing Cards */}
          <div className="space-y-4 mb-8">
            {/* Basic Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-[24px] p-6 border-2 border-gray-300 shadow-lg"
            >
              <div className="mb-4">
                <h3 className="text-xl text-foreground mb-1">One-time Report</h3>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-3xl text-foreground">2 900 ₸</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {basicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Premium Card - Recommended */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-primary rounded-[24px] p-6 relative overflow-hidden"
              style={{
                boxShadow: '0 0 40px rgba(255, 193, 7, 0.4), 0 10px 30px rgba(98, 0, 238, 0.3)'
              }}
            >
              {/* Outer Glow Effect */}
              <div className="absolute -inset-1 bg-accent opacity-20 blur-2xl rounded-[24px]" />
              
              {/* Best Value Badge */}
              <div className="relative mb-4 flex items-center justify-end">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-accent-foreground" />
                  <span className="text-xs text-accent-foreground font-semibold">BEST VALUE</span>
                </div>
              </div>

              <div className="relative mb-4">
                <h3 className="text-xl text-white mb-1">Premium</h3>
                <p className="text-white/80 text-sm">Recommended</p>
              </div>

              {/* Price */}
              <div className="relative mb-6">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl text-white">5 900 ₸</p>
                  <span className="text-white/70 text-sm">/ year</span>
                </div>
              </div>

              {/* Features */}
              <div className="relative space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-gradient-to-t from-primary via-primary to-primary/0 p-6 pt-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="w-full py-4 rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-[1.02] transition-transform mb-3"
            style={{
              boxShadow: '0 0 30px rgba(255, 193, 7, 0.5)'
            }}
          >
            <span className="text-lg font-semibold">Try 3 Days Free</span>
          </motion.button>
          
          <p className="text-white/70 text-xs text-center">
            Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}