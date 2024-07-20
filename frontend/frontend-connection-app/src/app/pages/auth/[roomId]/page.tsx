"use client";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faBars,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FormEvent } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import LoadingScreen from "@/components/LoadingScreen";

const Auth: React.FC = () => {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string>("/avatar/userPhoto.jpg");
  const [roomId, setRoomId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const pathname = usePathname();
  const roomName = pathname.split("/").pop();
  const [loading, setLoading] = useState<boolean>(false);

  console.log(`ROOMNAME - ${roomName}`);

  const avatars = [
    "/avatar/userPhoto2.jpg",
    "/avatar/userPhoto3.jpg",
    "/avatar/userPhoto4.jpg",
    "/avatar/userPhoto5.jpg",
    "/avatar/userPhoto6.jpg",
    "/avatar/userPhoto7.jpg",
    "/avatar/userPhoto8.jpg",
    "/avatar/userPhoto9.jpg",
    "/avatar/userPhoto10.jpg",
    "/avatar/userPhoto11.jpg",
    "/avatar/userPhoto.jpg",
  ];

  const handlePhotoChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const nextIndex = (currentIndex + 1) % avatars.length;
    setCurrentIndex(nextIndex);
    setUserPhoto(avatars[nextIndex]);
  };

  const generateRoomId = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  };

  useEffect(() => {
    localStorage.clear();
    generateRoomId();
  }, []);

  const onSubmitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const username = data.get("username") as string;

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          username,
          userPhoto,
        }
      );
      console.log("Success:", response.data);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("hostId", response.data.userId);

      const redirectTo =
        roomName === ""
          ? `/pages/settings/${roomId}`
          : `/pages/settings/${roomName}`;
      router.push(redirectTo);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-3 md:px-28 md:py-3">
      {loading && <LoadingScreen />}
      <div className="flex justify-between">
        <img
          src="/photos/red_bar_menu.svg"
          className="w-10 h-10 md:w-20 md:h-20"
          alt=""
        />
        <img
          src="/photos/logo.png"
          className="w-44 h-30 mt-8 md:w-72 "
          alt="Artboard"
        />
        <img
          src="/photos/red_circle_icon.svg"
          className="w-10 h-10 md:w-20 md:h-20"
          alt=""
        />
      </div>
      <form action="" onSubmit={onSubmitAuth}>
        <div className="flex flex-col justify-center mt-32 items-center gap-24 relative">
          <div className="relative w-[300px] md:w-[500px] h-[230px] md:h-[320px] bg-[#E2D5D0] flex flex-col gap-6 items-center justify-between px-4 py-6 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[40px] md:h-[50px] flex">
              <div className="flex-1 bg-[#477370]"></div>
              <div className="flex-1 bg-[#BA3B3A]"></div>
              <div className="flex-1 bg-[#E4A63A]"></div>
              <div className="flex-1 bg-[#FEFEFE]"></div>
              <div className="flex-1 bg-[#020100]"></div>
            </div>
            <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-[80px] bg-white relative mt-[20px] md:mt-[30px]">
              <img
                src={userPhoto}
                alt="user photo"
                className="w-full h-full rounded-full"
              />
              <button
                className="bg-black absolute text-white right-[-10px] top-[80px] rounded-3xl w-8 h-8 md:w-12 md:h-12 md:top-[110px] md:text-2xl"
                onClick={handlePhotoChange}
              >
                Go
              </button>
            </div>
            <input
              type="text"
              placeholder="Username"
              maxLength={20}
              name="username"
              id="username"
              className="w-[100%] h-[35px] md:h-[50px] px-3 py-3 text-black rounded-xl"
              required
            />
          </div>
          <div className="flex justify-center bg-[#E2D5D0] px-4 py-4 rounded-xl bg-opacity-40 md:px-8 md:py-4">
            <p className="text-xl text-black font-bold opacity-70 md:text-3xl">
              псс правила?
            </p>
          </div>
          <button
            type="submit"
            className="w-[150px] md:w-[250px] h-[40px] md:h-[50px] bg-[#BA3B3A] rounded-xl text-center px-6 py-2 text-lg  md:text-3xl relative"
          >
            Начать
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
