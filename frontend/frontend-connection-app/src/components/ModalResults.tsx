import React, { useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

interface ModalResultsProps {
  moderatorUsername: string;
  moderatorUserPhoto: string;
  moderatorWord: string;
  clickedUserName: string;
  clickedUserPhoto: string;
  clickedWord: string;
  targetWord: string;
  onClose: () => void;
}

const ModalResults: React.FC<ModalResultsProps> = ({
  moderatorUsername,
  moderatorUserPhoto,
  moderatorWord,
  clickedUserName,
  clickedUserPhoto,
  clickedWord,
  targetWord,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-black w-16 h-16 rounded-full mr-2">
              <img
                src={moderatorUserPhoto}
                className="rounded-full w-16 h-16"
                alt=""
              />
            </div>
            <div className="">
              <p className="text-red-700 font-bold">{translations.Host}</p>
              <p className="bg-[#FFD2CB] text-black rounded-full font-bold px-4 py-2 w-[100%]">
                {moderatorWord.endsWith("didnotsend")
                  ? `${translations.userNoTIme}`
                  : moderatorWord}
              </p>
            </div>
            {targetWord === moderatorWord ? (
              <img src="/photos/done.svg" className="w-10 ml-6" alt="done" />
            ) : (
              <img src="/photos/cross.png" className="w-10 ml-6" alt="cross" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-black w-16 h-16 rounded-full mr-2">
              <img
                src={clickedUserPhoto}
                className="rounded-full w-16 h-16"
                alt=""
              />
            </div>
            <div>
              <p className="text-black font-bold opacity-70">
                {clickedUserName}
              </p>
              <p className="bg-[#FFD2CB] text-black font-bold rounded-full px-4 py-2">
                {clickedWord.endsWith("didnotsend")
                  ? `${translations.userNoTIme}`
                  : clickedWord}
              </p>
            </div>
            {targetWord === clickedWord ? (
              <img src="/photos/done.svg" className="w-10 ml-6" alt="done" />
            ) : (
              <img src="/photos/cross.png" className="w-10 ml-6" alt="cross" />
            )}
          </div>
        </div>
        <p className="text-black font-bold text-center text-2xl mt-6">
          {translations.results}{" "}
          <span className="text-red-700">
            {targetWord === "empty2280945"
              ? `${translations.userNoTIme}`
              : targetWord}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ModalResults;
