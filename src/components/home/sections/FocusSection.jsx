import React from "react";
import TrueFocus from "../../animations/TrueFocus/TrueFocus";

const FocusSection = ({ isDarkMode }) => {
  return (
    <div className="relative flex items-center justify-center h-full w-fit p-4 rounded-lg border-[1px] border-[--dark-color] dark:border-[--light-color] pt-8">
      <h1 className="text-[--dark-color] dark:text-[--light-color] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] text-5xl font-bold text-center absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[50%] capitalize px-4 py-2 rounded-lg leading-10 whitespace-nowrap">
        focus on
      </h1>
      <TrueFocus
        sentence="Goals HardWork Success Future"
        manualMode={false}
        blurAmount={5}
        borderColor={isDarkMode ? "--light-color" : "--dark-color"}
        animationDuration={2}
        pauseBetweenAnimations={1}
      />
    </div>
  );
};

export default FocusSection;
