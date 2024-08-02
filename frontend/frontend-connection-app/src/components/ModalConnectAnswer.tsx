import React, { useEffect, useState, useRef, FormEvent } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

interface ModalConnectAnswerProps {
  onClose: (word: string) => void;
  revealedLetters: string;
  revealedWords: string[];
  difficultyLevel: string;
}

const ModalConnectAnswer: React.FC<ModalConnectAnswerProps> = ({
  onClose,
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
  const [timer, setTimer] = useState(getInitialTimer(difficultyLevel));
  const [error, setError] = useState("");
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdownRef.current!);
          const trimmedWord = word.trim();
          onClose(
            trimmedWord === "" ? `${revealedLetters}didNotSend` : trimmedWord
          );
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current!);
  }, [onClose, revealedLetters, word]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const lowerCaseWord = word.trim().toLowerCase();

    if (!lowerCaseWord.startsWith(revealedLetters)) {
      setError(`${translations.errorWord} "${revealedLetters}"`);
    } else if (revealedWords.includes(lowerCaseWord)) {
      setError(
        `${translations.oioioi}, "${word.trim()}" ${translations.oioioiSecond}`
      );
    } else {
      clearInterval(countdownRef.current!);
      onClose(word.trim());
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50">
      <div
        className="bg-white p-6 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black font-bold text-center text-3xl mb-4">
          {translations.faster}
        </p>
        <form onSubmit={handleSubmit} className="flex items-center mb-4">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Введите слово"
            className="text-black w-full h-10 rounded-l-xl px-5 py-2"
          />
          <button
            type="submit"
            className="bg-[#CC0B0D] text-white h-10 rounded-r-xl px-4"
          >
            ➤
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <p className="text-red-500 font-bold text-3xl">{`00:0${timer}`}</p>
      </div>
    </div>
  );
};

export default ModalConnectAnswer;
