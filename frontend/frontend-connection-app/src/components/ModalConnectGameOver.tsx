import React from "react";

interface ModalConnectGameOverProps {
  onClose: () => void;
}

const ModalConnectGameOver: React.FC<ModalConnectGameOverProps> = ({
  onClose,
}) => {
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
          GAME IS OVER
        </p>
        <button
          className="bg-black text-white h-10 rounded-xl px-4 mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalConnectGameOver;
