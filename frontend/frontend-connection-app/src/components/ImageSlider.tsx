import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";
import { useSwipeable } from "react-swipeable";

const ImageTextSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slides = [
    {
      image: "/slider/1.jpg",
      text: `${translations.sliderText1}`,
      header: `1. ${translations.firstHeader}`,
    },
    {
      image: "/slider/2.webp",
      text: `${translations.sliderText2}`,
      header: `2. ${translations.secondHeader}`,
    },
    {
      image: "/slider/3new.png",
      text: `${translations.sliderText3}`,
      header: `3. ${translations.thirdHeader}`,
    },
    {
      image: "/slider/5.png",
      text: `${translations.sliderText4}`,
      header: `4. ${translations.fourthHeader}`,
    },
    {
      image: "/slider/6.jpg",
      text: `${translations.sliderText5}`,
      header: `5. ${translations.fifthHeader}`,
    },
    {
      image: "/slider/7.jpg",
      text: `${translations.sliderText6}`,
      header: `6. ${translations.sixthHeader}`,
    },
    {
      image: "/slider/8new.png",
      text: `${translations.sliderText7}`,
      header: `7. ${translations.seventhHeader}`,
    },
  ];

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
          return 0;
        }
        return prevProgress + 0.15;
      });
    }, 10);
  };

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    resetInterval();
  };

  const handleSwipe = (direction: "LEFT" | "RIGHT") => {
    if (direction === "LEFT") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    } else if (direction === "RIGHT") {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );
    }
    resetInterval();
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("LEFT"),
    onSwipedRight: () => handleSwipe("RIGHT"),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="bg-[#FFF9E3] rounded-3xl p-6 text-black w-[90%] h-[90%] md:w-[500px] md:h-[750px] border-2 border-black border-solid flex flex-col">
      <h2 className="text-4xl font-black mb-4 text-[#FFA200] text-center">
        {translations.howPlay}
      </h2>
      <div {...handlers} className="relative flex-grow flex flex-col">
        <img
          src={slides[currentIndex].image}
          alt="Как играть"
          className="w-full md:h-[450px] h-[270px] object-cover rounded-xl mb-4"
        />
        <h3 className="text-2xl font-bold mb-2 text-center">
          {slides[currentIndex].header}
        </h3>
        <div className="flex-grow overflow-y-auto">
          <p className="md:text-xl text-m text-center">
            {slides[currentIndex].text}
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {slides.map((_, index) => (
          <div
            key={index}
            className="relative w-6 h-6 mx-1 cursor-pointer"
            onClick={() => handleDotClick(index)}
          >
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="black"
                strokeWidth="2"
              />
              {index === currentIndex && (
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="red"
                  strokeWidth="2"
                  strokeDasharray="62.83"
                  strokeDashoffset={62.83 - (progress / 100) * 62.83}
                  transform="rotate(-90 12 12)"
                />
              )}
              <circle
                cx="12"
                cy="12"
                r="5"
                fill={index === currentIndex ? "red" : "#4a5568"}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTextSlider;
