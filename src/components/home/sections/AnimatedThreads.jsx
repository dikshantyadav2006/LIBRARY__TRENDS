import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Threads from "../../animations/Threads/Threads";

const AnimatedThreads = ({ containerRef, isDarkMode }) => {
  const [threadColor, setThreadColor] = useState([18 / 255, 19 / 255, 21 / 255]); // Default dark
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 1900]);

  useEffect(() => {
    console.log(isDarkMode)
    setThreadColor(isDarkMode ? [1, 1, 1] : [18 / 255, 19 / 255, 21 / 255]);
  }, [isDarkMode]);

  return (
    <motion.div style={{ y }} className="absolute top-0 left-0 w-full h-[600px] z-0">
      <Threads
        color={threadColor}
        amplitude={1.5}
        distance={0}
        enableMouseInteraction={true}
      />
    </motion.div>
  );
};

export default AnimatedThreads;
