import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-4 py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sky-400 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">SR</span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-4xl font-bold text-sky-900 md:text-6xl"
          >
            Simple Road
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 text-lg text-sky-700 md:text-xl"
          >
            Your pathway to university success
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-lg text-sky-700 md:text-xl"
          >
            Ethiopian Student Learning Platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              to="/grades"
              className="rounded-2xl bg-sky-600 px-8 py-4 text-white hover:bg-sky-700 transition-colors"
            >
              Start Learning
            </Link>
            <Link
              to="/grades"
              className="rounded-2xl border-2 border-sky-600 px-8 py-4 text-sky-600 hover:bg-sky-50 transition-colors"
            >
              View Grades
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="px-4 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-sky-900">
            Features
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Study Materials", desc: "Access comprehensive notes and textbooks" },
              { title: "Practice Quizzes", desc: "Test your knowledge with interactive quizzes" },
              { title: "Progress Tracking", desc: "Monitor your learning journey" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="rounded-2xl bg-white p-6 shadow-lg"
              >
                <h3 className="mb-3 text-xl font-semibold text-sky-900">
                  {feature.title}
                </h3>
                <p className="text-sky-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
