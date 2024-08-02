import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

interface ModalModeratorInputProps {
  onClose: () => void;
  onSubmit: (word: string) => void;
}

const ModalModeratorInput: React.FC<ModalModeratorInputProps> = ({
  onClose,
  onSubmit,
}) => {
  const [word, setWord] = useState("");

  const handleSubmit = () => {
    if (word) {
      onSubmit(word);
      onClose();
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [word]);

  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 py-5 px-3 z-50">
      <div
        className="bg-white p-6 rounded-lg flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black font-bold text-center text-xl mb-4">
          {translations.asHost}
        </p>
        <input
          type="text"
          placeholder={translations.asHostPlaceholder}
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="bg-[#FFD2CB] text-black font-bold text-center py-4 px-6 rounded-lg mb-4 outline-none focus:shadow-custom"
        />
        <button
          onClick={handleSubmit}
          className={`bg-[#E43027] text-white font-bold py-2 px-4 rounded-lg ${
            !word ? " cursor-not-allowed" : ""
          }`}
          disabled={!word}
        >
          {translations.letsgo}
        </button>
      </div>
    </div>
  );
};

export default ModalModeratorInput;
