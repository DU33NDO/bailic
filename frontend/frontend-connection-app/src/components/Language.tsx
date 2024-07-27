import React, { useState } from "react";

const Language = ({ setSelectedOptionLanguage }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    setSelectedOptionLanguage(option);
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
      <div className={getDivClasses("Rus")} onClick={() => handleSelect("Rus")}>
        <img
          src="/lang/rus.png"
          className="rounded-xl w-[70px] h-[70px]"
          alt=""
        />
        <div className="flex flex-col gap-2">
          <p className="text-black font-bold text-2xl">Rus</p>
        </div>
      </div>
      <div className={getDivClasses("Eng")} onClick={() => handleSelect("Eng")}>
        <img
          src="/lang/eng.png"
          className="rounded-xl w-[70px] h-[70px]"
          alt=""
        />
        <div className="flex flex-col gap-2">
          <p className="text-black font-bold text-2xl">Eng</p>
        </div>
      </div>
      <div className={getDivClasses("Kz")} onClick={() => handleSelect("Kz")}>
        <img
          src="/lang/kz.png"
          className="rounded-xl w-[70px] h-[70px]"
          alt=""
        />
        <div className="flex flex-col gap-2">
          <p className="text-black font-bold text-2xl">Kz</p>
        </div>
      </div>
    </div>
  );
};

export default Language;
