import React, { useEffect } from "react";

interface ModalConnectPopUpProps {
  onClose: () => void;
}

const ModalConnectPopUp: React.FC<ModalConnectPopUpProps> = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 py-5 px-3 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-300 p-10 py-15 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#CC0B0D] p-4 rounded-xl flex items-center justify-center mb-4">
          <p className="text-3xl font-bold text-white">ЕСТЬ КОНТАКТ</p>
        </div>
      </div>
    </div>
  );
};

export default ModalConnectPopUp;
