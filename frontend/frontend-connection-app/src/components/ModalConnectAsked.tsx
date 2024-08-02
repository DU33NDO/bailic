import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

interface ModalConnectAskedProps {
  onClose: () => void;
  onSubmit: (word: string) => void;
  revealedLetters: string;
  revealedWords: string[];
  difficultyLevel: string;
}

const ModalConnectAsked: React.FC<ModalConnectAskedProps> = ({
  onClose,
  onSubmit,
  revealedLetters,
  revealedWords,
  difficultyLevel,
}) => {
  const getInitialTimer = (difficultyLevel: string) => {
    switch (difficultyLevel) {
      case "Hard":
        return 5;
      case "Medium":
        return 8;
      case "Easy":
        return 10;
      default:
        return 8;
    }
  };

  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(getInitialTimer(difficultyLevel));
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdownRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current!);
  }, []);

  const handleSubmit = (event?: FormEvent) => {
    if (event) event.preventDefault();
    const lowerCaseWord = word.trim().toLowerCase();

    if (!lowerCaseWord.startsWith(revealedLetters.toLowerCase())) {
      setError(`${translations.errorWord} "${revealedLetters}"`); // слово должно начинаться на..
      return;
    } else if (revealedWords.includes(lowerCaseWord)) {
      setError(
        `${translations.oioioi}, "${word.trim()}" ${translations.oioioiSecond}` //айайа уже было использовано
      );
      return;
    } else {
      clearInterval(countdownRef.current!);
      onSubmit(word.trim());
      onClose();
    }
  };

  const handleAutoSubmit = () => {
    const finalWord =
      word.trim() === "" ? `${revealedLetters}didNotSend` : word.trim();
    if (!finalWord.toLowerCase().startsWith(revealedLetters.toLowerCase())) {
      setError(`${translations.errorWord} "${revealedLetters}"`);
    } else if (revealedWords.includes(finalWord.toLowerCase())) {
      setError(
        `${translations.oioioi}, "${finalWord}" ${translations.oioioiSecond}`
      );
    } else {
      onSubmit(finalWord);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50">
      <div
        className="bg-white p-6 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black font-bold text-center text-3xl mb-4">
          {translations.whichword}
        </p>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Аватар"
            className="text-[#CC0B0D] w-full h-10 rounded-l-xl px-5 py-2"
          />
          <button
            type="submit"
            className="bg-black text-white h-10 rounded-r-xl px-4"
          >
            ➤
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <p className="text-red-500 font-bold text-3xl mt-4">{`00:0${timer}`}</p>
      </div>
    </div>
  );
};

export default ModalConnectAsked;
