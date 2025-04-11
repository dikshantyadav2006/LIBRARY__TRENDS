import React from "react";
import ScrollVelocity from "../../animations/ScrollVelocity/ScrollVelocity";
import RotatingText from "../../animations/RotatingText/RotatingText";

const VelocitySection = ({ scrollContainerRef }) => {
  const phrases = [
    "Create silence", "Create history", "Create focus", "Create knowledge", "Create change",
    "Create moments", "Create futures", "Create growth", "Create habits", "Create stories",
    "Create discipline", "Create dreams", "Create peace", "Create clarity", "Create purpose",
    "Create space", "Build focus", "Build knowledge", "Build character", "Build habits",
    "Discover yourself", "Discover silence", "Discover stories", "Unlock potential", "Unlock ideas",
    "Unlock discipline", "Explore thought", "Explore peace", "Explore time", "Explore knowledge",
    "Explore stories", "Shape the future", "Shape habits", "Shape minds", "Find purpose",
    "Find focus", "Learn deeply", "Learn silently", "Learn together",
  ];

  const phraseGroups = {};
  phrases.forEach((phrase) => {
    const [firstWord, ...rest] = phrase.split(" ");
    const secondPart = rest.join(" ");
    if (!phraseGroups[firstWord]) phraseGroups[firstWord] = [];
    phraseGroups[firstWord].push(secondPart);
  });

  const scrollingBlocks = Object.entries(phraseGroups).map(([firstWord, words]) => (
    <div
      key={firstWord}
      className="rotating-text relative flex flex-col sm:flex-row items-center justify-center h-full w-full sm:w-fit p-2 sm:p-4 rounded-lg border border-[--dark-color] dark:border-[--light-color] gap-3 sm:gap-2"
    >
      <h1 className="text-[--dark-color] dark:text-[--light-color] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] text-2xl sm:text-3xl md:text-5xl font-bold text-center uppercase px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap">
        {firstWord}
      </h1>
      <RotatingText
        texts={words}
        mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 min-w-[320px] text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg text-5xl font-bold text-center capitalize whitespace-nowrap"
        staggerFrom="last"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-120%" }}
        staggerDuration={0.025}
        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        rotationInterval={3000}
      />
    </div>
  ));

  const ScrollingContent = () => (
    <div className="relative flex items-center justify-center gap-2">
      {scrollingBlocks.map((block, index) => (
        <div key={index} className="flex items-center justify-center ml-2">
          {block}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={scrollContainerRef} className="relative my-[20vh]">
      <ScrollVelocity
        texts={[<ScrollingContent key="1" />, <ScrollingContent key="2" />]}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  );
};

export default VelocitySection;
