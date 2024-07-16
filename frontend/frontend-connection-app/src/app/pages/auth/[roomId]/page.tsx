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
    <div className="px-5 py-3">
      {loading && <LoadingScreen />}
      <div className="flex justify-between">
        <FontAwesomeIcon icon={faBars} size="2x" color="#F24236" />
        <img src="/photos/logo.png" className="w-44 h-30 mt-8" alt="Artboard" />
        <FontAwesomeIcon
          icon={faCircleInfo}
          className="text-4xl"
          color="#F24236"
        />
      </div>
      <form action="" onSubmit={onSubmitAuth}>
        <div className="flex flex-col justify-center mt-32 items-center gap-24 relative">
          <div className="w-[300px] h-[230px] bg-[#E2D5D0] flex flex-col items-center justify-between px-4 py-6 rounded-xl">
            <div className="w-[120px] h-[120px] rounded-[80px] bg-white relative">
              <img
                src={userPhoto}
                alt="user photo"
                className="w-full h-full rounded-full"
              />
              <button
                className="bg-black absolute text-white right-[-10px] top-[80px] rounded-3xl w-8 h-8"
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
          <div className="flex justify-center bg-[#E2D5D0] px-4 py-4 rounded-xl bg-opacity-40">
            <p className="text-xl text-black font-bold opacity-70">
              псс правила?
            </p>
          </div>
          <button
            type="submit"
            className="w-[150px] h-[40px] bg-[#EB3A53] rounded-xl text-right px-6 py-2 text-lg flex gap-4 items-center"
          >
            <FontAwesomeIcon
              icon={faPlay}
              style={{ fontSize: "1.3em" }}
              className=""
            />
            Начать
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
