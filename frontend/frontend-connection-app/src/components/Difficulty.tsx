import React, { useState } from "react";

const Difficulty = ({ setSelectedOptionDifficulty }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    setSelectedOptionDifficulty(option);
    setSelected(option);
  };

  const getDivClasses = (option: string) => {
    return `flex gap-6 px-8 py-4 w-full justify-start items-center rounded-xl cursor-pointer ${
      selected === option
        ? "bg-[#E1E1E1] border-solid border-2 border-[#E78173]"
        : "bg-white hover:bg-[#E1E1E1]"
    }`;
  };

  return (
    <div className="flex flex-col gap-6 items-center mt-8 mb-6 lg:grid lg:grid-cols-2 lg:grid-rows-[repeat(6,auto)] lg:gap-6 lg:h-auto px-6">
      <div
        className={getDivClasses("Easy")}
        onClick={() => handleSelect("Easy")}
      >
        <img
          src="/photos/easy_mode.svg"
          className="rounded-xl w-[70px] h-[70px]"
          alt=""
        />
        <div className="flex flex-col gap-2">
          <p className="text-black font-bold text-2xl">Easy</p>
          <p className="text-black">AI mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("Medium")}
        onClick={() => handleSelect("Medium")}
      >
        <img
          src="/photos/medium_mode.svg"
          className="rounded-xl w-[70px] h-[70px]"
          alt=""
        />
        <div className="flex flex-col gap-2">
          <p className="text-black font-bold text-2xl">Medium</p>
          <p className="text-black">AI mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("Hard")}
        onClick={() => handleSelect("Hard")}
      >
        <img
          src="/photos/hard_mode.svg"
          className="rounded-xl w-[70px] h-[70px]"
          alt=""
        />
        <div className="flex flex-col gap-2">
          <p className="text-black font-bold text-2xl">Hard</p>
          <p className="text-black">AI mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("No AI")}
        onClick={() => handleSelect("No AI")}
      >
        <img
          src="/photos/no_ai_mode.svg"
          className="rounded-xl w-[70px] h-[70px]"
          alt=""
        />
        <div className="flex flex-col gap-2">
          <p className="text-black font-bold text-2xl">No AI</p>
          <p className="text-black">without AI</p>
        </div>
      </div>
    </div>
  );
};

export default Difficulty;
