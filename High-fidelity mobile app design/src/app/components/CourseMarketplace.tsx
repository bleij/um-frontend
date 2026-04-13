import { Search, Star, Zap, ArrowLeft, Filter, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const courses = [
  {
    id: 1,
    title: "Advanced Robotics & Engineering",
    instructor: "Dr. Aidar Khamzin",
    image: "https://images.unsplash.com/photo-1767954561407-7014cb8fb16c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGNsYXNzJTIwY2hpbGRyZW4lMjBlZHVjYXRpb258ZW58MXx8fHwxNzc1NjM2MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    match: 98,
    xp: 15,
    talent: "Logic",
    price: 21000,
    originalPrice: 25000,
    rating: 4.9,
    students: 1234,
  },
  {
    id: 2,
    title: "Creative Coding & Game Design",
    instructor: "Aliya Nursultan",
    image: "https://images.unsplash.com/photo-1632835298280-ad3d64834ab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB3b3Jrc2hvcCUyMGtpZHMlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NTYzNjIyOHww&ixlib=rb-4.1.0&q=80&w=1080",
    match: 95,
    xp: 18,
    talent: "Creativity",
    price: 19500,
    originalPrice: 24000,
    rating: 4.8,
    students: 892,
  },
  {
    id: 3,
    title: "STEM Lab: Science Experiments",
    instructor: "Prof. Marat Serik",
    image: "https://images.unsplash.com/photo-1766297248027-611186dbccc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVtJTIwZWR1Y2F0aW9uJTIwbGFib3JhdG9yeSUyMHNjaWVuY2V8ZW58MXx8fHwxNzc1NjM2MjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    match: 92,
    xp: 12,
    talent: "Analytical",
    price: 18000,
    originalPrice: 22000,
    rating: 4.9,
    students: 1567,
  },
];

export function CourseMarketplace() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl">
        <div className="px-6 pt-8 pb-24">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link 
              to="/parent"
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl">Course Marketplace</h1>
              <p className="text-muted-foreground text-sm">Find the perfect course</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3.5 rounded-[20px] bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <button className="w-12 h-12 rounded-[20px] bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Filter className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Ideal for your child section */}
          <div className="mb-4">
            <h3 className="mb-1">Ideal for your child</h3>
            <p className="text-muted-foreground text-sm">AI-matched courses for Alikhan</p>
          </div>

          {/* Course Cards */}
          <div className="space-y-5">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-[24px] border border-border shadow-xl overflow-hidden"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs shadow-lg backdrop-blur-sm border border-white/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{course.match}% Match</span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-accent/90 backdrop-blur-sm text-xs shadow-lg border border-accent/30 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>+{course.xp} XP {course.talent}</span>
                    </div>
                  </div>

                  {/* Gradient Overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Course Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="mb-1 leading-tight">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                  </div>

                  {/* Rating & Students */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {course.students.toLocaleString()} students
                    </div>
                  </div>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{course.price.toLocaleString()} ₸</span>
                        <span className="text-muted-foreground line-through text-sm">
                          {course.originalPrice.toLocaleString()} ₸
                        </span>
                      </div>
                      <div className="text-xs text-green-500 mt-0.5">
                        Save {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                      </div>
                    </div>
                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:scale-105 transition-transform flex-shrink-0">
                      Offer to Child
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Browse More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <button className="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
              Browse All Courses
            </button>
          </motion.div>
        </div>

        {/* Bottom Navigation - 5 Icons (Same as Parent Dashboard) */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-card/95 backdrop-blur-xl border-t border-border">
          <div className="flex items-center justify-around px-4 py-3">
            <Link to="/parent" className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span className="text-xs">Home</span>
            </Link>
            
            <button className="flex flex-col items-center gap-1 px-3 py-2 text-primary">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <span className="text-xs">Courses</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span className="text-xs">Chat</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span className="text-xs">Analytics</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}