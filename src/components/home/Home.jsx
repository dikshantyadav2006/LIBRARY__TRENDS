import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedThreads from "./sections/AnimatedThreads.jsx";
import FocusSection from "./sections/FocusSection.jsx";
import VelocitySection from "./sections/VelocitySection.jsx";
import { Link, NavLink } from "react-router-dom";
const Home = ({isDarkMode}) => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Detect system dark mode or use theme preference
  

  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full bg-[--light-color] dark:bg-[--dark-color] overflow-x-hidden  duration-1000 z-0 transition-all ease-in-out"
    >
      {/* Threads Background Animation */}
      <AnimatedThreads containerRef={containerRef} isDarkMode={isDarkMode} />

      {/* Intro Section */}
      <motion.section
        style={{ y }}
        className="relative z-10 flex flex-col items-center justify-center h-[100vh] text-center px-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-[--dark-color] dark:text-[--light-color] mb-4">
          Welcome to the Learning Library
        </h1>
        <p className="text-lg sm:text-xl text-[--dark-color] dark:text-[--light-color] max-w-2xl">
          Unlock your focus, build habits, and explore the silence of deep learning.
        </p>
      </motion.section>

      {/* Focus Section */}
      <section className="relative z-10 flex justify-center items-center min-h-[60vh] my-20">
        <FocusSection isDarkMode={isDarkMode} />
      </section>

      {/* Scroll Velocity Rotating Text Section */}
      <section className="relative z-10">
        <VelocitySection scrollContainerRef={scrollContainerRef} />
      </section>

      <section className="relative z-10 flex justify-center items-center bg-gray-700  my-20 border-t-[1px] border-[--primary-dark-color]  dark:border-[--primary-light-color]">
        <div className="feedbacks bg-[--primary-light-color] dark:bg-[--primary-dark-color] px-2 py-1 rounded-sm h-fit my-[10vh] ">
          <h1 className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl md:text-7xl font-extrabold text-[--dark-color] dark:text-[--light-color] mb-4 bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4 py-2 rounded-lg whitespace-nowrap">
            Feedbacks
          </h1>
          <p className="text-lg sm:text-xl text-[--dark-color] dark:text-[--light-color] max-w-2xl">
            Your feedback is important to us. Please take a moment to share your thoughts.
          </p>
          <div className="my-6 ">
          <Link to="/feedback" className=" text-[--dark-color] dark:text-[--light-color] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4 py-2 rounded-lg text-lg font-semibold hover:bg-[--primary-light-color] dark:hover:bg-[--primary-dark-color] transition duration-300 ">
          Give Feedback
        </Link>
          </div>
        </div>
        {/* feedback navigation section  */}
        
      </section>
    </main>
  );
};

export default Home;
