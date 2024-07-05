import React, { useState } from "react";

const Difficulty = ({ setSelectedOptionDifficulty }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    setSelectedOptionDifficulty(option);
    setSelected(option);
  };

  const getDivClasses = (option: string) => {
    return `flex gap-6 px-2 py-2 w-[90%] justify-center items-center rounded-xl cursor-pointer ${
      selected === option ? "bg-blue-500" : "bg-blue-400 hover:bg-blue-500"
    }`;
  };

  return (
    <div className="flex flex-col gap-10 items-center mt-8">
      <div
        className={getDivClasses("Easy")}
        onClick={() => handleSelect("Easy")}
      >
        <div className="w-[70px] h-[70px] bg-green-300 hover:bg-green-400 rounded-xl"></div>
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Easy</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("Medium")}
        onClick={() => handleSelect("Medium")}
      >
        <div className="w-[70px] h-[70px] bg-yellow-300 hover:bg-yellow-400 rounded-xl"></div>
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Medium</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("Hard")}
        onClick={() => handleSelect("Hard")}
      >
        <div className="w-[70px] h-[70px] bg-red-300 hover:bg-red-400 rounded-xl"></div>
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Hard</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("No AI")}
        onClick={() => handleSelect("No AI")}
      >
        <div className="w-[70px] h-[70px] bg-black hover:bg-gray-800 rounded-xl"></div>
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">No AI</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
    </div>
  );
};

export default Difficulty;
