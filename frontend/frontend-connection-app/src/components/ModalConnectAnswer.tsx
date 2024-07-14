import React, { useEffect, useState, useRef, FormEvent } from "react";

interface ModalConnectAnswerProps {
  onClose: (word: string) => void;
  revealedLetters: string;
  revealedWords: string[];
}

const ModalConnectAnswer: React.FC<ModalConnectAnswerProps> = ({
  onClose,
  revealedLetters,
  revealedWords,
}) => {
  const [word, setWord] = useState("");
  const [timer, setTimer] = useState(8);
  const [error, setError] = useState("");
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdownRef.current!);
          onClose(word.trim() === "" ? `${revealedLetters}didNotSend` : word);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current!);
  }, [onClose, revealedLetters, word]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const lowerCaseWord = word.toLowerCase();

    if (!lowerCaseWord.startsWith(revealedLetters)) {
      setError(`Слово должно начинаться с "${revealedLetters}"`);
    } else if (revealedWords.includes(lowerCaseWord)) {
      setError(`Айайай, "${word}" уже было использовано! Напиши другое слово.`);
    } else {
      clearInterval(countdownRef.current!);
      onClose(word);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50">
      <div
        className="bg-white p-6 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black font-bold text-center text-3xl mb-4">
          Быстрее вводи слово!!
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
