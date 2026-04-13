import { motion } from "motion/react";
import { ArrowLeft, Phone } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleContinue = () => {
    // Handle phone number submission
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl flex flex-col">
        <div className="flex-1 flex flex-col px-6 pt-8 pb-12">
          {/* Back Button */}
          <Link 
            to="/onboarding/role-selection"
            className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors w-fit"
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
            <h1 className="text-3xl mb-3">Welcome Back</h1>
            <p className="text-muted-foreground">Enter your phone number to continue</p>
          </motion.div>

          {/* Phone Number Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+7</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(777) 123-4567"
                className="w-full pl-16 pr-4 py-4 rounded-[20px] bg-card border-2 border-border focus:border-primary focus:outline-none text-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-4">
              We'll send you a verification code
            </p>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Link to="/onboarding/verify">
              <button
                onClick={handleContinue}
                disabled={phoneNumber.length < 10}
                className={`
                  w-full py-4 rounded-[20px] font-semibold transition-all
                  ${phoneNumber.length >= 10
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:scale-[1.02]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                Continue
              </button>
            </Link>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-3"
          >
            {/* Google Button */}
            <button className="w-full py-4 rounded-[20px] bg-card border-2 border-border hover:border-primary transition-all shadow-lg hover:shadow-xl group">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-foreground">Continue with Google</span>
              </div>
            </button>

            {/* Apple Button */}
            <button className="w-full py-4 rounded-[20px] bg-card border-2 border-border hover:border-primary transition-all shadow-lg hover:shadow-xl group">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="font-semibold text-foreground">Continue with Apple</span>
              </div>
            </button>
          </motion.div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-primary underline">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
