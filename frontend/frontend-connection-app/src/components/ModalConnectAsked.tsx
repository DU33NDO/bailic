import React, { useState, useEffect, useRef, FormEvent } from "react";

interface ModalConnectAskedProps {
  onClose: () => void;
  onSubmit: (word: string) => void;
  revealedLetters: string;
  revealedWords: string[];
}

const ModalConnectAsked: React.FC<ModalConnectAskedProps> = ({
  onClose,
  onSubmit,
  revealedLetters,
  revealedWords,
}) => {
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(8);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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
      setError(`Слово должно начинаться с "${revealedLetters}"`);
      return;
    } else if (revealedWords.includes(lowerCaseWord)) {
      setError(
        `Айайай, "${word.trim()}" уже было использовано! Напиши другое слово.`
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
    onSubmit(finalWord);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50">
      <div
        className="bg-white p-6 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black font-bold text-center text-3xl mb-4">
          Какое слово ты загадал?
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
