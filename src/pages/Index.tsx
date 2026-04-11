import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, TrendingUp, Award, Target, Zap, Shield, Crown, Star, GraduationCap, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Hero Section - Mobile First */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative px-4 py-16 sm:py-20 md:py-28 min-h-screen flex items-center"
      >
        <div className="mx-auto max-w-7xl text-center relative z-10">
          {/* Enhanced Logo Animation - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-6 sm:mb-10"
          >
            <div className="relative inline-flex items-center justify-center">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-600 rounded-3xl blur-3xl opacity-60"
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative w-24 h-24 sm:w-32 sm:h-36 md:w-36 md:h-36 mx-auto bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl border border-amber-300/20 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Crown className="w-12 h-12 sm:w-16 sm:w-20 text-white drop-shadow-lg" />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced Brand Name - Mobile First */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <motion.img 
                src="/logo.svg" 
                alt="Simple Road" 
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-18 lg:h-18 drop-shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl text-center">
                Simple Road
              </h1>
              <motion.img 
                src="/logo.svg" 
                alt="Simple Road" 
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-18 lg:h-18 drop-shadow-lg"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-amber-300" />
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-amber-200 font-semibold text-center">
                Elite Education Platform
              </p>
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            
            {/* Enhanced Value Proposition Headline - Mobile First */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mb-6 sm:mb-8"
            >
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-amber-400/30 max-w-5xl mx-auto shadow-2xl">
                <motion.h2 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight text-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  Ethiopia's Free Exam & Quiz Platform
                </motion.h2>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-amber-200 font-semibold mb-4 sm:mb-6 text-center">
                  for Grade 9–12 Students
                </p>
                <motion.div 
                  className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-400/30 mb-4 sm:mb-6 shadow-xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 text-red-300" />
                    </motion.div>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                      Grade 12 National Ethiopian Exam Preparation
                    </p>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 text-red-300" />
                    </motion.div>
                  </div>
                </motion.div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-amber-300">
                  <motion.span 
                    className="flex items-center gap-2 sm:gap-3 bg-white/10 px-3 py-2 sm:px-4 rounded-full"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="font-medium text-sm sm:text-base lg:text-lg">Exams</span>
                  </motion.span>
                  <motion.span 
                    className="flex items-center gap-2 sm:gap-3 bg-white/10 px-3 py-2 sm:px-4 rounded-full"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <Target className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="font-medium text-sm sm:text-base lg:text-lg">Quizzes</span>
                  </motion.span>
                  <motion.span 
                    className="flex items-center gap-2 sm:gap-3 bg-white/10 px-3 py-2 sm:px-4 rounded-full"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="font-medium text-sm sm:text-base lg:text-lg">Books</span>
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Where <span className="text-amber-300 font-bold">Excellence</span> Meets <span className="text-amber-300 font-bold">Opportunity</span>
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12 text-lg md:text-xl text-amber-100/60 max-w-2xl mx-auto"
          >
            Premium Ethiopian Student Learning Experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-0"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/matric"
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-14 py-4 sm:py-7 text-base sm:text-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 border border-amber-400/20 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative flex items-center gap-3 sm:gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-5 h-5 sm:w-7 sm:h-7" />
                  </motion.div>
                  <span className="text-sm sm:text-base md:text-xl">Start Excellence Journey</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className="w-5 h-5 sm:w-7 sm:h-7" />
                  </motion.div>
                </span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/matric"
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-14 py-4 sm:py-7 text-base sm:text-xl font-bold text-amber-300 border-2 border-amber-400/50 rounded-2xl sm:rounded-3xl hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative flex items-center gap-3 sm:gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Target className="w-5 h-5 sm:w-7 sm:h-7" />
                  </motion.div>
                  <span className="text-sm sm:text-base md:text-xl">Explore Excellence</span>
                  <motion.div
                    animate={{ rotate: [0, 180] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-5 h-5 sm:w-7 sm:h-7" />
                  </motion.div>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Section - Mobile First */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative px-4 py-12 sm:py-16 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Trusted by Ethiopian Students
            </h2>
            <p className="text-base sm:text-lg text-amber-100/60 px-4">
              Join thousands of students excelling with Simple Road
            </p>
          </motion.div>
          
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-400/30">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <GraduationCap className="w-8 h-8 sm:w-10 sm:h-12 text-amber-300 mx-auto mb-3 sm:mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  10,000+
                </motion.h3>
                <p className="text-sm sm:text-base text-amber-200">Active Students</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-400/30">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="w-8 h-8 sm:w-10 sm:h-12 text-blue-300 mx-auto mb-3 sm:mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.3 }}
                >
                  50,000+
                </motion.h3>
                <p className="text-sm sm:text-base text-blue-200">Quizzes Taken</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-400/30">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-12 text-green-300 mx-auto mb-3 sm:mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.4 }}
                >
                  95%
                </motion.h3>
                <p className="text-sm sm:text-base text-green-200">Success Rate</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30">
                <motion.div
                  animate={{ rotate: [0, 180, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="w-8 h-8 sm:w-10 sm:h-12 text-purple-300 mx-auto mb-3 sm:mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                >
                  4.9/5
                </motion.h3>
                <p className="text-sm sm:text-base text-purple-200">Student Rating</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Elite Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative px-4 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-amber-400" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Elite Features
              </h2>
              <Award className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-xl text-amber-100/60 max-w-3xl mx-auto">
              Experience the pinnacle of educational excellence
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Premium Content", desc: "Exclusive study materials curated by experts", icon: Crown, color: "amber" },
              { title: "Advanced Analytics", desc: "AI-powered performance tracking and insights", icon: TrendingUp, color: "orange" },
              { title: "Elite Certification", desc: "Recognized credentials for academic excellence", icon: Shield, color: "yellow" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 hover:transform hover:scale-105">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-amber-100 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-amber-200/70 text-center leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Matric Excellence Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative px-4 py-20 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="w-8 h-8 text-amber-400" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Matric Supremacy
              </h2>
              <GraduationCap className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-xl text-amber-100/60 max-w-3xl mx-auto">
              Master the Ethiopian Matriculation Examination with elite preparation
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Natural Science", desc: "Mathematics, Physics, Chemistry, Biology", icon: "🔬", route: "/matric/2016/natural" },
              { title: "Social Science", desc: "History, Geography, Economics, Civics", icon: "📚", route: "/matric/2016/social" },
              { title: "Language Arts", desc: "English, Amharic, Literature", icon: "📝", route: "/matric/2016/natural" },
              { title: "Exam Strategy", desc: "Advanced test-taking techniques", icon: "🎯", route: "/matric/2016/natural" },
              { title: "Past Papers", desc: "Extensive exam archives", icon: "📋", route: "/matric/2016/natural" },
              { title: "Performance Tracking", desc: "Monitor your progress", icon: "📊", route: "/performance" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 + index * 0.05 }}
                className="group"
              >
                <Link
                  href={item.route}
                  className="block relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{item.icon}</div>
                      <h3 className="text-2xl font-bold text-amber-100 group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-amber-200/70 leading-relaxed mb-4">{item.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-amber-300 group-hover:text-amber-200 transition-colors">
                      <span className="text-sm font-semibold">Master Excellence</span>
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Elite Menu Items Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative px-4 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo.svg" alt="Simple Road" className="w-8 h-8" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Elite Portfolio
              </h2>
              <img src="/logo.svg" alt="Simple Road" className="w-8 h-8" />
            </div>
            <p className="text-xl text-amber-100/60 max-w-3xl mx-auto">
              Explore our comprehensive suite of premium educational services
            </p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Academic Excellence", desc: "Premier grade-level mastery programs", icon: "🎓", route: "/grades" },
              { title: "Matric Supremacy", desc: "Elite exam preparation systems", icon: "🏆", route: "/matric" },
              { title: "Knowledge Vault", desc: "Exclusive digital library access", icon: "📚", route: "/notes" },
              { title: "Digital Collection", desc: "Curated premium textbooks", icon: "📖", route: "/books" },
              { title: "Career Architects", desc: "Professional pathway design", icon: "💼", route: "/career-simulator" },
              { title: "Performance Analytics", desc: "Advanced progress tracking", icon: "📊", route: "/performance" },
              { title: "Elite Profile", desc: "Premium account management", icon: "👤", route: "/profile" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 + index * 0.05 }}
                className="group"
              >
                <Link
                  href={item.route}
                  className="block relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{item.icon}</div>
                      <h3 className="text-2xl font-bold text-amber-100 group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-amber-200/70 leading-relaxed">{item.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-amber-300 group-hover:text-amber-200 transition-colors">
                      <span className="text-sm font-semibold">Access Excellence</span>
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Supreme CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9 }}
        className="relative px-4 py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      >
        <div className="mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="w-10 h-10 text-amber-400" />
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Ascend to Excellence
              </h2>
              <Crown className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-2xl md:text-3xl text-amber-100/80 max-w-4xl mx-auto leading-relaxed">
              Join the <span className="text-amber-300 font-bold">elite circle</span> of academic achievers
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            className="flex flex-col gap-6 sm:flex-row sm:justify-center items-center"
          >
            <Link
              href="/matric"
              className="group relative inline-flex items-center justify-center px-16 py-8 text-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl shadow-2xl hover:shadow-amber-500/30 transform hover:scale-105 transition-all duration-300 border border-amber-400/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-300"></span>
              <span className="relative flex items-center gap-4">
                <Crown className="w-8 h-8" />
                Begin Excellence Journey
                <Zap className="w-8 h-8" />
              </span>
            </Link>
            <Link
              href="/matric"
              className="group inline-flex items-center justify-center px-16 py-8 text-2xl font-bold text-amber-300 border-2 border-amber-400/50 rounded-3xl hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center gap-4">
                <Target className="w-8 h-8" />
                Explore Excellence
                <Star className="w-8 h-8" />
              </span>
            </Link>
          </motion.div>
        </div>
        
        {/* Bottom decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </motion.section>

      {/* Footer Section */}
      <footer className="relative px-4 py-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-t border-amber-400/20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-amber-100/80 text-sm mb-2">
                Created by <span className="text-amber-300 font-semibold">Milkesa Comm.</span> <span className="text-amber-300 font-semibold">Getahun Tadese</span>
              </p>
              <p className="text-amber-100/60 text-xs mb-2">
                © 2026 Simple Road. All rights reserved.
              </p>
              <div className="flex flex-col gap-1 text-amber-100/60 text-xs">
                <p className="flex items-center gap-2">
                  <span className="text-amber-400">📱</span>
                  <span>0992010092 / 0950502881</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-amber-400">✉️</span>
                  <span>alexgetahuntadese@gmail.com</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Simple Road" className="w-16 h-16" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
