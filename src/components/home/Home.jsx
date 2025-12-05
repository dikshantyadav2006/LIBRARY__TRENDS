import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FocusSection from "./sections/FocusSection.jsx";
import VelocitySection from "./sections/VelocitySection.jsx";
import SeatDetails from "../seatDetails/SeatDetails.jsx";
import { Link } from "react-router-dom";
const Home = ({isDarkMode,loggedInUser}) => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Detect system dark mode or use theme preference
  

  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 400]);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full bg-[--light-color] dark:bg-[--dark-color] duration-1000 z-0 transition-all ease-in-out"
    >

      {/* Intro Section */}
      <motion.section
        style={{ y }}
        className="relative z-10 flex flex-col items-center justify-evenly h-[100vh] text-center px-4 "
      >
        {/* Animated Gradient Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4"
        >
          <span className="text-[--dark-color] dark:text-[--light-color]">Welcome to the </span>
          <motion.span
            className="inline-block bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
            initial={{ backgroundPosition: "0% center" }}
            animate={{ backgroundPosition: "200% center" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            Sai Library
          </motion.span>
        </motion.h1>

        {/* Animated Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg sm:text-xl max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[--dark-color] dark:text-[--light-color]"
          >
            Unlock your{" "}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
          >
            focus
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-[--dark-color] dark:text-[--light-color]"
          >
            , build{" "}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent"
          >
            habits
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-[--dark-color] dark:text-[--light-color]"
          >
            , and explore the{" "}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            silence of deep learning
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.7 }}
            className="text-[--dark-color] dark:text-[--light-color]"
          >
            .
          </motion.span>
        </motion.p>
        {/* Action Buttons */}
        <div className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] w-full md:w-fit p-4 rounded-2xl relative shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="absolute left-4 -top-3 bg-[--primary-light-color] dark:bg-[--primary-dark-color] px-3 py-1 rounded-full text-xs font-medium text-teal-600 dark:text-teal-400 border border-teal-500/30">
            {loggedInUser ? "Make Decisions. Move Forward." : "Power Your Next Move."}
          </p>

          {loggedInUser ? (
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link to="/dashboard" className="group">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <span className="text-lg">👤</span>
                  <span>My Profile</span>
                </button>
              </Link>
              <Link to="/my-bookings" className="group">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <span className="text-lg">📚</span>
                  <span>My Bookings</span>
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link to="/login" className="group">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <span className="text-lg">🔑</span>
                  <span>Login</span>
                </button>
              </Link>
              <Link to="/signup" className="group">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <span className="text-lg">✨</span>
                  <span>Sign Up</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </motion.section>

	      {/* Seat grid below intro */}
	      <section className="relative z-10 my-10">
	        <div className="w-full max-w-6xl mx-auto">
	          <SeatDetails loggedInUser={loggedInUser} />
	        </div>
	      </section>

      {/* Focus Section */}
      <section className="relative z-10 flex justify-center items-center min-h-[60vh] my-20">
        <FocusSection isDarkMode={isDarkMode} />
      </section>

      {/* Scroll Velocity Rotating Text Section */}
      <section ref={scrollContainerRef} className="relative z-10" style={{ position: "relative" }}>
        <VelocitySection scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Feedback Section - Redesigned */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              <span className="text-[--dark-color] dark:text-[--light-color]">What Our </span>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Students Say
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Real experiences from our library members. Your feedback helps us grow!
            </p>
          </motion.div>

          {/* Feedback Cards Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { emoji: "📚", text: "Best place to study in ATARIA!", rating: 5, name: "DIKSHANT YADAV" },
              { emoji: "🎯", text: "Peaceful environment, great focus zone.", rating: 5, name: "Priya K." },
              { emoji: "💡", text: "Affordable and well-maintained library.", rating: 4, name: "Amit Y." },
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-4 rounded-xl bg-[--primary-light-color] dark:bg-[--primary-dark-color] shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-3xl mb-2">{review.emoji}</div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">"{review.text}"</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">— {review.name}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/feedback"
              className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-xl">✍️</span>
              <span>Share Your Experience</span>
            </Link>
            <Link
              to="/feedback"
              className="group flex items-center gap-2 bg-[--primary-light-color] dark:bg-[--primary-dark-color] hover:bg-[--secondary-light-color] dark:hover:bg-[--secondary-dark-color] text-[--dark-color] dark:text-[--light-color] px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-gray-300 dark:border-gray-600"
            >
              <span className="text-xl">👀</span>
              <span>View All Reviews</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center gap-8 mt-10 pt-8 border-t border-gray-300 dark:border-gray-700"
          >
            
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">4.8★</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">59</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Seats</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
