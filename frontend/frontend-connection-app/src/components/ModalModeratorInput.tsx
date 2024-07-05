import React, { useState } from "react";

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
    onSubmit(word);
    onClose(); 
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-300 p-6 rounded-lg flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black font-bold text-center text-xl mb-4">
          В качестве ведущего...
        </p>
        <input
          type="text"
          placeholder="Введите слово для игроков!"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="bg-black text-white text-center py-2 px-4 rounded-lg mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-black text-white font-bold py-2 px-4 rounded-lg"
        >
          Поехали
        </button>
      </div>
    </div>
  );
};

export default ModalModeratorInput;
