import { ArrowLeft, Video, Send, Sparkles, Calendar, Circle } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";

const chatMessages = [
  {
    id: 1,
    type: "ai-tip",
    content: "Based on Alikhan's recent activities, I've noticed strong improvement in analytical skills! Consider adding more creative challenges to balance development.",
    timestamp: "10:30 AM",
    date: "Today"
  },
  {
    id: 2,
    type: "ai-tip",
    content: "Tip: Children who engage in 30+ minutes of physical activity daily show 15% better concentration in technical subjects.",
    timestamp: "10:32 AM",
    date: "Today"
  },
  {
    id: 3,
    type: "mentor",
    content: "Hi Sabina! I reviewed Alikhan's progress this week. He's doing amazing in robotics! 🤖",
    timestamp: "11:15 AM",
    date: "Today",
    mentorName: "Asel"
  },
  {
    id: 4,
    type: "mentor",
    content: "I'd like to discuss some strategies to help him with leadership skills. Would you be available for a quick video call this week?",
    timestamp: "11:16 AM",
    date: "Today",
    mentorName: "Asel"
  },
  {
    id: 5,
    type: "user",
    content: "Thank you! Yes, I'd love to schedule a call. What times work best for you?",
    timestamp: "11:45 AM",
    date: "Today"
  },
  {
    id: 6,
    type: "mentor",
    content: "Great! I'm available Tuesday afternoon or Thursday evening. You can book a session using the button above 😊",
    timestamp: "11:50 AM",
    date: "Today",
    mentorName: "Asel"
  },
];

export function Chat() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl flex flex-col">
        {/* Top Bar - Mentor Profile */}
        <div className="bg-card border-b border-border px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <Link 
              to="/parent"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* Mentor Avatar & Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
                  👩‍🏫
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">Asel</h3>
                <div className="flex items-center gap-1.5">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  <p className="text-xs text-muted-foreground">Child Psychologist • Online</p>
                </div>
              </div>
            </div>

            {/* Video Call Button */}
            <button className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
              <Video className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Book Session Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-[16px] p-3 border border-accent/30"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground truncate">Book 30-min Consultation</span>
              </div>
              <Link
                to="/book-session"
                className="px-4 py-1.5 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold shadow-lg transition-all hover:scale-105 flex-shrink-0"
              >
                5000₸
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {chatMessages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* AI Tip Message */}
              {msg.type === "ai-tip" && (
                <div className="max-w-[85%]">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[20px] rounded-tl-sm p-4 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-primary">AI Insight</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-2">{msg.timestamp}</p>
                </div>
              )}

              {/* Mentor Message */}
              {msg.type === "mentor" && (
                <div className="max-w-[85%]">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm flex-shrink-0">
                      👩‍🏫
                    </div>
                    <div>
                      <div className="bg-card rounded-[20px] rounded-tl-sm p-4 border border-border shadow-lg">
                        <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-2">{msg.timestamp}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* User Message */}
              {msg.type === "user" && (
                <div className="max-w-[85%]">
                  <div className="bg-primary rounded-[20px] rounded-tr-sm p-4 shadow-lg">
                    <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 mr-2 text-right">{msg.timestamp}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Floating Action Button - Book Consultation */}
        <Link
          to="/book-session"
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-yellow-500 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-10"
          style={{ maxWidth: "calc(428px - 48px)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <Calendar className="w-6 h-6 text-white" />
          </motion.div>
        </Link>

        {/* Message Input Area */}
        <div className="bg-card border-t border-border px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-[20px] bg-muted border border-border focus:border-primary focus:outline-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                message.trim()
                  ? "bg-primary hover:bg-primary/90 shadow-lg hover:scale-105"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}