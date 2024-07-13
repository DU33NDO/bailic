import React from "react";

interface ModalResultsProps {
  moderatorUsername: string;
  moderatorUserPhoto: string;
  moderatorWord: string;
  clickedUserName: string;
  clickedUserPhoto: string;
  clickedWord: string;
  targetWord: string;
  onClose: () => void;
}

const ModalResults: React.FC<ModalResultsProps> = ({
  moderatorUsername,
  moderatorUserPhoto,
  moderatorWord,
  clickedUserName,
  clickedUserPhoto,
  clickedWord,
  targetWord,
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
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-black w-16 h-16 rounded-full mr-2">
              <img
                src={moderatorUserPhoto}
                className="rounded-full w-16 h-16"
                alt=""
              />
            </div>
            <div className="">
              <p className="text-red-700 font-bold ">Ведущий</p>
              <p className="bg-[#FFD2CB] text-black rounded-full font-bold px-4 py-2 w-[100%]">
                {moderatorWord}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-black opacity-70 w-160 h-16 rounded-full mr-2">
              <img
                src={clickedUserPhoto}
                className="rounded-full w-16 h-16"
                alt=""
              />
            </div>
            <div>
              <p className="text-black font-bold opacity-70">
                {clickedUserName}
              </p>
              <p className="bg-[#FFD2CB] text-black font-bold rounded-full px-4 py-2">
                {clickedWord}
              </p>
            </div>
          </div>
        </div>
        <p className="text-black font-bold text-center text-2xl mt-6">
          Загаданное слово: <span className="text-red-700">{targetWord}</span>
        </p>
      </div>
    </div>
  );
};

export default ModalResults;
