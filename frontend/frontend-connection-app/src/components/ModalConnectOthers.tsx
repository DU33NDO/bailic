import React, { useEffect, useState } from "react";

interface ModalConnectOthersProps {
  onClose: () => void;
  closeImmediately: boolean;
}

const ModalConnectOthers: React.FC<ModalConnectOthersProps> = ({
  onClose,
  closeImmediately,
}) => {
  const [timer, setTimer] = useState(1);

  useEffect(() => {
    if (closeImmediately) {
      onClose();
      return;
    }
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer >= 8) {
          clearInterval(countdown);
          onClose();
          return 8;
        }
        return prevTimer + 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [onClose, closeImmediately]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 px-3 z-50">
      <div
        className="bg-white p-6 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#CC0B0D] w-60 h-60 rounded-xl flex items-center justify-center mb-4">
          <p className="text-white font-bold text-9xl">{timer}</p>
        </div>
      </div>
    </div>
  );
};

export default ModalConnectOthers;
