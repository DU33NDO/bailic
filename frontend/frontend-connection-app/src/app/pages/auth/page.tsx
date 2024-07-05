"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faBars,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";

const Auth: React.FC = () => {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string>(
    "https://wp-s.ru/wallpapers/16/17/364199592708062/siluet-xameleona-iz-multika.jpg"
  );
  const [roomId, setRoomId] = useState<string>("");

  const handlePhotoChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const avatars = [
      "https://i.pinimg.com/originals/36/fe/14/36fe14c1732b4315af4c46b142fa29a8.jpg",
      "https://sneg.top/uploads/posts/2023-06/1687601562_sneg-top-p-avatarka-negra-krasivo-54.jpg",
      "https://wp-s.ru/wallpapers/16/17/364199592708062/siluet-xameleona-iz-multika.jpg",
      "https://wallpapers.com/images/hd/weird-profile-pictures-k7dzvlzmlq8q6eib.jpg",
    ];
    const randomIndex = Math.floor(Math.random() * avatars.length);
    setUserPhoto(avatars[randomIndex]);
  };

  const generateRoomId = () => {
    const newRoomId = Math.random().toString(36).substr(2, 9);
    setRoomId(newRoomId);
  };

  useEffect(() => {
    generateRoomId();
  }, []);

  const onSubmitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const username = data.get("username") as string;

    try {
      const response = await axios.post("http://localhost:3005/auth/login", {
        username,
        userPhoto,
      });
      console.log("Success:", response.data);

      localStorage.setItem("userId", response.data.userId)

      if (response) {
        router.push(`/pages/settings/${roomId}`);
        console.log();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="px-5 py-3">
      <div className="flex justify-between">
        <FontAwesomeIcon icon={faBars} size="2x" />
        <p className="text-2xl font-bold mt-8">Word Nerd</p>
        <FontAwesomeIcon icon={faCircleInfo} className="text-4xl" />
      </div>
      <form action="" onSubmit={onSubmitAuth}>
        <div className="flex flex-col justify-center mt-32 items-center gap-40 relative">
          <div className="w-[300px] h-[230px] bg-gray-200 flex flex-col items-center justify-between px-4 py-6 rounded-xl">
            <div className="w-[120px] h-[120px] rounded-[80px] bg-white relative">
              <img
                src={userPhoto}
                alt="user photo"
                className="w-full h-full rounded-full"
              />
              <button
                className="bg-black absolute right-[-10px] top-[80px] rounded-3xl w-8 h-8"
                onClick={handlePhotoChange}
              >
                Go
              </button>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              id="username"
              className="w-[100%] h-[35px] px-3 py-3 text-black rounded-xl"
              required
            />
          </div>
          <button
            type="submit"
            className="w-[150px] h-[40px] bg-gray-700 rounded-xl relative text-right px-8 py-2"
          >
            Начать
            <FontAwesomeIcon
              icon={faPlay}
              style={{ fontSize: "1.5em" }}
              className="absolute left-[15px]"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
