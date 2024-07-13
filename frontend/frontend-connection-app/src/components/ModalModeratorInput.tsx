import React, { useState, useEffect } from "react";

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

  const handleClose = () => {
    if (word) {
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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 py-5 px-3 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white p-6 rounded-lg flex flex-col items-center"
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
          className="bg-[#FFD2CB] text-black font-bold text-center py-4 px-6 rounded-lg mb-4 outline-none focus:shadow-custom"
        />
        <button
          onClick={handleSubmit}
          className={`bg-[#E43027] text-white font-bold py-2 px-4 rounded-lg ${
            !word ? " cursor-not-allowed" : ""
          }`}
          disabled={!word}
        >
          Поехали
        </button>
      </div>
    </div>
  );
};

export default ModalModeratorInput;
