import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";

export function Verify() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last character
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const isComplete = code.every(digit => digit !== "");

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl flex flex-col">
        <div className="flex-1 flex flex-col px-6 pt-8 pb-12">
          {/* Back Button */}
          <Link 
            to="/onboarding/login"
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
            <h1 className="text-3xl mb-3">Verify Your Number</h1>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <span className="text-foreground font-semibold">+7 (777) 123-4567</span>
            </p>
          </motion.div>

          {/* Code Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex gap-3 justify-center mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`
                    w-14 h-16 rounded-[16px] text-center text-2xl font-semibold
                    bg-card border-2 transition-all
                    ${digit 
                      ? 'border-primary text-foreground' 
                      : 'border-border text-muted-foreground'
                    }
                    focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10
                  `}
                />
              ))}
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              <button className="text-sm text-primary font-semibold hover:underline">
                Resend Code
              </button>
            </div>
          </motion.div>

          {/* Verify Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/onboarding/profile-creation">
              <button
                disabled={!isComplete}
                className={`
                  w-full py-4 rounded-[20px] font-semibold transition-all
                  ${isComplete
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:scale-[1.02]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                Verify & Continue
              </button>
            </Link>
          </motion.div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8"
          >
            <div className="flex items-start gap-3 p-4 rounded-[20px] bg-primary/5 border border-primary/10">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-semibold mb-1">Secure Verification</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your phone number is used only for secure authentication and will never be shared.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
