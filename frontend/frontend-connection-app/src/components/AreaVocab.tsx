import React, { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

const AreaVocab = ({ setSelectedOptionAreaVocab }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    setSelectedOptionAreaVocab(option);
    setSelected(option);
  };

  const getDivClasses = (option: string) => {
    return `flex gap-6 px-8 py-4 w-full justify-start items-center rounded-xl cursor-pointer ${
      selected === option
        ? "bg-[#E1E1E1] border-solid border-2 border-[#E78173]"
        : "bg-white hover:bg-[#E1E1E1]"
    }`;
  };

  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();

  return (
    <div className="flex flex-col gap-6 items-center mt-8 mb-6 lg:grid lg:grid-cols-2 lg:gap-6 md:h-auto px-6">
      <div
        className={getDivClasses("All Include")}
        onClick={() => handleSelect("All Include")}
      >
        <img
          src="/photos/all_include_vocab.svg"
          className="rounded-xl"
          alt=""
        />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">
            {translations.AllInclude}
          </p>
          <p className="text-black">{translations.AllIncludeText}</p>
        </div>
      </div>
      <div
        className={getDivClasses("Food")}
        onClick={() => handleSelect("Food")}
      >
        <img src="/photos/food_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">{translations.Food}</p>
          <p className="text-black">{translations.FoodText}</p>
        </div>
      </div>
      <div
        className={getDivClasses("Sport")}
        onClick={() => handleSelect("Sport")}
      >
        <img src="/photos/sport_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">{translations.Sport}</p>
          <p className="text-black">{translations.SportText} </p>
        </div>
      </div>
      <div
        className={getDivClasses("Music")}
        onClick={() => handleSelect("Music")}
      >
        <img src="/photos/music_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">{translations.Music}</p>
          <p className="text-black">{translations.MusicText}</p>
        </div>
      </div>
      <div
        className={getDivClasses("Academic")}
        onClick={() => handleSelect("Academic")}
      >
        <img src="/photos/academic_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">
            {translations.Academic}
          </p>
          <p className="text-black">{translations.AcademicText}</p>
        </div>
      </div>
      {/* <div
        className={getDivClasses("Travel")}
        onClick={() => handleSelect("Travel")}
      >
        <img src="/photos/music_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Travel</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("Health")}
        onClick={() => handleSelect("Health")}
      >
        <img src="/photos/music_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Health</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("Medicine")}
        onClick={() => handleSelect("Medicine")}
      >
        <img src="/photos/music_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Medicine</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("business")}
        onClick={() => handleSelect("business")}
      >
        <img src="/photos/music_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Business</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div>
      <div
        className={getDivClasses("fashion")}
        onClick={() => handleSelect("fashion")}
      >
        <img src="/photos/music_vocab.svg" className="rounded-xl" alt="" />
        <div className="flex flex-col gap-2 ">
          <p className="text-black font-bold text-2xl">Fashion</p>
          <p className="text-black">Description of this mode</p>
        </div>
      </div> */}
    </div>
  );
};

export default AreaVocab;
