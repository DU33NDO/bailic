import React from "react";

interface ModalModeratorProps {
  username: string;
  userPhoto: string; 
  onClose: () => void;
}

const ModalModerator: React.FC<ModalModeratorProps> = ({
  username,
  userPhoto,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-300 p-6 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black font-bold text-center text-3xl mb-4">
          Ведущий был выбран
        </p>
        <div className="bg-black w-60 h-60 rounded-xl flex items-center justify-center mb-4 flex flex-col gap-4">
          <img
            src={userPhoto}
            alt="User Photo"
            className="bg-gray-400 w-32 h-32 rounded-full"
          />
          <p className="text-white font-bold text-3xl">{username}</p>
        </div>
      </div>
    </div>
  );
};

export default ModalModerator;
