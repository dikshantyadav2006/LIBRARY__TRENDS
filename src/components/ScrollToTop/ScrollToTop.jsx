// src/components/ScrollToTop.js
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [showAnimation, setShowAnimation] = useState(true);
  useEffect(() => {
    // Hide animation on initial load
    setShowAnimation(false);
  }, []);

  useEffect(() => {
    // Scroll to top and trigger animation
    setShowAnimation(true);
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
      // Hide animation after it's done
      setShowAnimation(false);
    }, 400); // faster route-change animation

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="origin-top w-screen h-screen fixed top-0 left-0 bg-[--primary-light-color] dark:bg-[--primary-dark-color] z-[999] overflow-hidden"
        >
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: "easeInOut" }}
            className="origin-top w-screen h-[90vh] bg-[--dark-color] dark:bg-[--light-color]"
          >
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
              className="origin-top w-screen h-[70vh] bg-[--light-color] dark:bg-[--dark-color]"
            ></motion.div>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 0.51 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: "easeInOut" }}
              className="origin-top w-screen h-[70vh] bg-[--dark-color] dark:bg-[--light-color]"
            ></motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
