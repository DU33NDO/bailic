import React, { useState } from "react";

const AreaVocab = ({ setSelectedOptionAreaVocab }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    setSelectedOptionAreaVocab(option);
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
        className={getDivClasses("All Include")}
        onClick={() => handleSelect("All Include")}
      >
        <div className="w-[70px] h-[70px] rounded-xl text-[50px]">😄</div>
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">All Include</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("Medicine")}
        onClick={() => handleSelect("Medicine")}
      >
        <div className="w-[70px] h-[70px] rounded-xl text-[50px]">💊</div>
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Medicine</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("Sport")}
        onClick={() => handleSelect("Sport")}
      >
        <div className="w-[70px] h-[70px] rounded-xl text-[50px]">🏀</div>
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Sport</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div className={getDivClasses("IT")} onClick={() => handleSelect("IT")}>
        <div className="w-[70px] h-[70px] rounded-xl text-[50px]">🖥️</div>
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">IT</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
    </div>
  );
};

export default AreaVocab;
