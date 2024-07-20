"use client";
import React, { useEffect, useRef, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import UsersTop from "@/components/UsersTop";
import AreaVocab from "@/components/AreaVocab";
import Difficulty from "@/components/Difficulty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import UsersTopDesktop from "./UsersTopDesktop";
import { useRouter } from "next/navigation";
import { useAudio } from "../context/AudioContext";

interface DesktopSettingsProps {
  loading: boolean;
  combinedUsers: any;
  active: string;
  handleClick: (section: string) => void;
  handleCopyUrl: () => void;
  handlePlay: () => void;
  setSelectedOptionAreaVocab: (option: any) => void;
  setSelectedOptionDifficulty: (option: any) => void;
  roomName: string;
}

const DesktopSettings: React.FC<DesktopSettingsProps> = ({
  loading,
  combinedUsers,
  active,
  handleClick,
  handleCopyUrl,
  handlePlay,
  setSelectedOptionAreaVocab,
  setSelectedOptionDifficulty,
  roomName,
}) => {
  const { isPlaying, toggleAudio, setAudioSource } = useAudio();

  useEffect(() => {
    setAudioSource("/music/background_music_1.m4a");
  }, [setAudioSource]);

  const handleBackClick = () => {
    window.location.href = `/pages/auth/${roomName}`;
  };

  const defaultStyle = { fontSize: "18px", color: "gray", fontWeight: "400" };
  const activeStyle = { fontSize: "20px", color: "#BA3B3A", fontWeight: "900" };

  return (
    <div className="px-6 py-4">
      {loading && <LoadingScreen />}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBackClick}
          className="flex items-center px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          BACK
        </button>
        <img src="/photos/logo.png" className="w-52" alt="" />
        <button onClick={toggleAudio} className="focus:outline-none w-16">
          <img src={isPlaying ? "/photos/audio.png" : "/photos/mute.png"} />
        </button>
      </div>
      <div className="flex gap-4 items-start mt-10">
        <UsersTopDesktop
          combinedUsers={combinedUsers}
          handleCopyUrl={handleCopyUrl}
        />
        <div className="w-[60%] h-[70%] bg-[#E9DED9] overflow-auto rounded-xl overflow-x-hidden">
          <div className="flex justify-between sticky top-0 bg-[#E9DED9] z-10 ">
            <div
              className={`w-[49%] h-[40px] rounded-xl flex justify-center items-center cursor-pointer ${
                active === "difficulty"
                  ? "border-solid border-4 border-[#FFF9E3] ml-[-5px]"
                  : ""
              }`}
              onClick={() => handleClick("vocabArea")}
            >
              <p style={active === "vocabArea" ? activeStyle : defaultStyle}>
                Difficulty
              </p>
            </div>
            <div
              className={`w-[49%] h-[40px] rounded-xl flex justify-center items-center cursor-pointer ${
                active === "vocabArea"
                  ? "border-solid border-4 border-[#FFF9E3] mr-[-5px]"
                  : ""
              }`}
              onClick={() => handleClick("difficulty")}
            >
              <p style={active === "difficulty" ? activeStyle : defaultStyle}>
                Vocabulary
              </p>
            </div>
          </div>
          <div className="mt-4">
            {active === "difficulty" && (
              <AreaVocab
                setSelectedOptionAreaVocab={setSelectedOptionAreaVocab}
              />
            )}
            {active === "vocabArea" && (
              <Difficulty
                setSelectedOptionDifficulty={setSelectedOptionDifficulty}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex text-black gap-4 justify-center mt-8">
        <button
          className="font-bold text-2xl bg-[#F24236] w-[150px] h-[40px] rounded-xl text-white"
          onClick={handleCopyUrl}
        >
          Invite
        </button>
        <button
          className="font-bold text-2xl bg-[#F24236] w-[150px] h-[40px] rounded-xl text-white"
          onClick={handlePlay}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default DesktopSettings;
