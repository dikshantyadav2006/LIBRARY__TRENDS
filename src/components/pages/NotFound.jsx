import FuzzyText from "../animations/fuzzyText/FuzzyText";

const NotFound = ({ isDarkMode }) => {
  return (
    <div
      className={`relative min-h-screen w-full flex items-center justify-center transition-colors duration-500 ${
        isDarkMode
          ? "bg-[--dark-color]"
          : "bg-[--light-color]"
      }`}
    >
      <FuzzyText
        fontSize="clamp(5rem, 18vw, 16rem)" // 🔥 big & responsive
        fontWeight={900}
        enableHover
        baseIntensity={0.18}
        hoverIntensity={0.5}
        isDarkMode={isDarkMode}
      >
        404
      </FuzzyText>
    </div>
  );
};

export default NotFound;
