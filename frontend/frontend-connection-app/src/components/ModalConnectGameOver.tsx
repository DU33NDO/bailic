import React from "react";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

interface ModalConnectGameOverProps {
  onClose: () => void;
  onContinue: () => void;
  roomName: string;
  isHost: boolean;
  socket: Socket | null;
  roomId: any;
}

const ModalConnectGameOver: React.FC<ModalConnectGameOverProps> = ({
  onClose,
  onContinue,
  roomName,
  isHost,
  socket,
  roomId,
}) => {
  const router = useRouter();
  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();

  const handleContinue = () => {
    if (socket) {
      socket.emit("gameContinue", roomName, roomId);
    }
    onContinue();
  };

  const handleExitToSettings = () => {
    if (socket) {
      socket.emit("exitToSettings", roomName, roomId);
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
          {translations.gameOver}
        </p>
        {isHost && (
          <div className="flex gap-4 mt-4">
            <button
              className="bg-green-500 text-white h-10 rounded-xl px-4"
              onClick={handleContinue}
            >
              {translations.Continue}
            </button>
            <button
              className="bg-red-500 text-white h-10 rounded-xl px-4"
              onClick={handleExitToSettings}
            >
              {translations.exitToSettings}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalConnectGameOver;
