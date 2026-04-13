import { motion } from "motion/react";
import { ArrowLeft, User, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

const interests = [
  { id: 1, label: "Sports", icon: "⚽", category: "Athletic" },
  { id: 2, label: "Art", icon: "🎨", category: "Creative" },
  { id: 3, label: "Music", icon: "🎵", category: "Creative" },
  { id: 4, label: "Science", icon: "🔬", category: "Analytical" },
  { id: 5, label: "Math", icon: "📐", category: "Analytical" },
  { id: 6, label: "Reading", icon: "📚", category: "Analytical" },
  { id: 7, label: "Coding", icon: "💻", category: "Technical" },
  { id: 8, label: "Gaming", icon: "🎮", category: "Technical" },
  { id: 9, label: "Dancing", icon: "💃", category: "Athletic" },
  { id: 10, label: "Chess", icon: "♟️", category: "Analytical" },
  { id: 11, label: "Drama", icon: "🎭", category: "Creative" },
  { id: 12, label: "Photography", icon: "📸", category: "Creative" },
  { id: 13, label: "Robotics", icon: "🤖", category: "Technical" },
  { id: 14, label: "Writing", icon: "✍️", category: "Creative" },
  { id: 15, label: "Debate", icon: "🗣️", category: "Leadership" },
];

export function ProfileCreation() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

  const toggleInterest = (id: number) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const canContinue = name.trim() && age && selectedInterests.length >= 3;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl">
        <div className="px-6 pt-8 pb-32 overflow-y-auto h-screen">
          {/* Back Button */}
          <Link 
            to="/onboarding/verify"
            className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl mb-3">Create Child Profile</h1>
            <p className="text-muted-foreground">
              Tell us about your child to personalize their experience
            </p>
          </motion.div>

          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl shadow-2xl">
                👦
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border-2 border-background flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 text-primary" />
              </button>
            </div>
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Child's Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alikhan"
                  className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-card border-2 border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
            </div>

            {/* Age Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Age
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 12"
                  min="5"
                  max="18"
                  className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-card border-2 border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
            </div>
          </motion.div>

          {/* Interests Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3>Select Interests</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose at least 3 interests
                </p>
              </div>
              <div className={`
                px-3 py-1.5 rounded-full text-xs font-semibold
                ${selectedInterests.length >= 3 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {selectedInterests.length}/15
              </div>
            </div>

            {/* Interests Chips */}
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => {
                const isSelected = selectedInterests.includes(interest.id);
                
                return (
                  <motion.button
                    key={interest.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.03, duration: 0.2 }}
                    onClick={() => toggleInterest(interest.id)}
                    className={`
                      px-4 py-2.5 rounded-[16px] text-sm font-medium transition-all
                      flex items-center gap-2
                      ${isSelected
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                        : 'bg-card border-2 border-border hover:border-primary text-foreground'
                      }
                    `}
                  >
                    <span className="text-base">{interest.icon}</span>
                    <span>{interest.label}</span>
                    {isSelected && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[24px] p-4 border border-primary/10 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-semibold mb-1">
                  AI-Powered Matching
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Based on your selections, we'll recommend personalized courses, activities, and career paths.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-card/95 backdrop-blur-xl border-t border-border px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/parent">
              <button
                disabled={!canContinue}
                className={`
                  w-full py-4 rounded-[20px] font-semibold transition-all
                  ${canContinue
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:scale-[1.02]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                {canContinue ? 'Create Profile & Start' : 'Select at least 3 interests'}
              </button>
            </Link>
            
            <p className="text-xs text-muted-foreground text-center mt-3">
              You can update interests anytime in settings
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
