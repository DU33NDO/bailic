import React, { useState, useEffect, FormEvent } from "react";

interface ModalConnectAskedProps {
  onClose: () => void;
  onSubmit: (word: string) => void;
  revealedLetters: string;
  revealedWords: string[]; // Add revealedWords prop
}

const ModalConnectAsked: React.FC<ModalConnectAskedProps> = ({
  onClose,
  onSubmit,
  revealedLetters,
  revealedWords, 
}) => {
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          handleSubmit();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleSubmit = (event?: FormEvent) => {
    if (event) event.preventDefault();
    const lowerCaseWord = word.toLowerCase();

    if (!lowerCaseWord.startsWith(revealedLetters.toLowerCase())) {
      setError(`The word must start with "${revealedLetters}"`);
    } else if (revealedWords.includes(lowerCaseWord)) {
      setError(
        `The word "${word}" has already been used. Please choose another word.`
      );
    } else {
      onSubmit(word);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50"
      onClick={onClose}
    >
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
            className="text-gray-700 w-full h-10 rounded-l-xl px-5 py-2"
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
