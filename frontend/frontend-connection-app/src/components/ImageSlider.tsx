import React, { useState, useEffect, useRef } from "react";

const ImageTextSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slides = [
    {
      image: "/slider/1.jpg",
      text: "Собирайтесь с друзьями в голосовой канал",
      header: "1. НУЖНЫ ДРУЗЬЯ",
    },
    {
      image: "/slider/2.webp",
      text: "Вы хотите сыграть сами или против ИИ?",
      header: "2. ИИ?",
    },
    {
      image: "/slider/3.webp",
      text: "Ведущий выбирает случайное слово для игроков. Остальным игрокам известна только первая буква этого слова",
      header: "3. ВЕДУЩИЙ ВЫБИРАЕТ СЛОВО",
    },
    {
      image: "/slider/5.png",
      text: "Остальные игроки пишут в чат ассоциации на первую букву этого слова, не называя слово полностью",
      header: "4. ПИШИ В ЧАТ АССОЦИАЦИИ",
    },
    {
      image: "/slider/6.jpg",
      text: "Цель игроков — нажать на сообщение другого игрока, если они поняли его слово",
      header: "5. НАЖИМАЙ НА СООБЩЕНИЯ",
    },
    {
      image: "/slider/7.jpg",
      text: "Цель ведущего — раньше других понять слова игроков и нажимать на их сообщения, чтобы обрывать контакт.",
      header: "6. ОБРЫВАЙ КОНТАКТ",
    },
    {
      image: "/slider/7.jpg",
      text: "Игра заканчивается, когда игроки поймут слово ведущего",
      header: "7. ПОБЕДА",
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

  return (
    <div className="bg-[#FFF9E3] rounded-3xl p-6 text-black w-[90%] h-[90%] md:w-[500px] md:h-[750px] border-2 border-black border-solid flex flex-col">
      <h2 className="text-4xl font-black mb-4 text-[#FFA200] text-center">
        КАК ИГРАТЬ
      </h2>
      <div className="relative flex-grow flex flex-col">
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
