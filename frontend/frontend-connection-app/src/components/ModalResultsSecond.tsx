import React, { useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

interface ModalResultsSecondProps {
  moderatorUsername: string;
  moderatorUserPhoto: string;
  moderatorWord: string;
  targetWord: string;
  onClose: () => void;
}

const ModalResultsSecond: React.FC<ModalResultsSecondProps> = ({
  moderatorUsername,
  moderatorUserPhoto,
  moderatorWord,
  targetWord,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

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
              <p className="text-red-700 font-bold ">{moderatorUsername}</p>
              <p className="bg-black text-white rounded-full px-4 py-2 w-[100%]">
                {moderatorWord}
              </p>
            </div>
          </div>
        </div>
        {targetWord === moderatorWord ? (
          <p className="text-black font-bold text-center text-2xl mt-6">
            {translations.hostWasRight}{" "}
            <span className="text-red-700">{targetWord}</span>
          </p>
        ) : (
          <p className="text-black font-bold text-center text-2xl mt-6">
            {translations.hostWasNotRight}
          </p>
        )}
      </div>
    </div>
  );
};

export default ModalResultsSecond;
