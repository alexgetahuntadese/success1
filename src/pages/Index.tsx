import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Award, Target, Zap, Shield, Crown, Star, GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative px-4 py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-600 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border border-amber-300/20">
                <Crown className="w-16 h-16 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo.svg" alt="Simple Road" className="w-12 h-12 md:w-16 md:h-16" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Simple Road
              </h1>
              <img src="/logo.svg" alt="Simple Road" className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-300" />
              <p className="text-2xl md:text-3xl text-amber-200 font-semibold">
                Elite Education Platform
              </p>
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
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
            className="flex flex-col gap-6 sm:flex-row sm:justify-center items-center"
          >
            <Link
              to="/matric"
              className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 border border-amber-400/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></span>
              <span className="relative flex items-center gap-3">
                <Crown className="w-6 h-6" />
                Start Excellence Journey
                <Zap className="w-6 h-6" />
              </span>
            </Link>
            <Link
              to="/matric"
              className="group inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-amber-300 border-2 border-amber-400/50 rounded-2xl hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                <Target className="w-6 h-6" />
                Explore Excellence
                <Star className="w-6 h-6" />
              </span>
            </Link>
          </motion.div>
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
                  to={item.route}
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
                  to={item.route}
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
              to="/matric"
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
              to="/matric"
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
