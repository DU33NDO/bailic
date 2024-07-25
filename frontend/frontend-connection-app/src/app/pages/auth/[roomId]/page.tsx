"use client";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faBars,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FormEvent } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import LoadingScreen from "@/components/LoadingScreen";
import ImageTextSlider from "@/components/ImageSlider";
import ModalShowRules from "@/components/ModalShowRules";
import ReactGA from "react-ga";

const Auth: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 1530 });
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string>("/avatar/userPhoto.jpg");
  const [roomId, setRoomId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const pathname = usePathname();
  const roomName = pathname.split("/").pop();
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

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
    "/avatar/userPhoto12.jpg",
    "/avatar/userPhoto13.jpg",
    "/avatar/userPhoto14.jpg",
    "/avatar/userPhoto15.jpg",
    "/avatar/userPhoto16.jpg",
    "/avatar/userPhoto17.jpg",
    "/avatar/userPhoto18.jpg",
    "/avatar/userPhoto19.jpg",
    "/avatar/userPhoto20.jpg",
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

  useEffect(() => {
    ReactGA.initialize("G-LJJPTGCY1M");
  }, []);

  const trackButtonClick = () => {
    ReactGA.event({
      category: "User",
      action: "Clicked Start Button",
    });
  };

  const onSubmitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackButtonClick();
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

      if (roomName) {
        localStorage.removeItem("hostId");
      }

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

  const showRules = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className="px-5 py-3 md:px-28 md:py-3">
      {showModal && <ModalShowRules onClose={closeModal} />}
      {loading && <LoadingScreen />}
      <div className="flex justify-between items-center">
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
        {isDesktop && (
          <img
            src="/photos/discord.svg"
            className="md:w-20 cursor-pointer transition-shadow duration-300 hover:shadow-custom-hover"
            alt=""
            onClick={() => {
              router.push("https://discord.gg/JXhN7tBC4G");
            }}
          />
        )}

        {!isDesktop && (
          <button className="w-10 h-10 md:w-20 md:h-20" onClick={showRules}>
            <img src="/photos/red_circle_icon.svg" className="" alt="" />
          </button>
        )}
      </div>
      <form action="" onSubmit={onSubmitAuth}>
        <div className="flex flex-col justify-center mt-12 items-center gap-24 relative">
          <div className="md:flex md:items-center md:gap-32 md:justify-center md:px-20 md:py-4">
            <div className="flex flex-col justify-center items-center gap-12 relative">
              <div className="relative w-[300px] md:w-[500px] h-[250px] md:h-[350px] bg-[#E2D5D0] flex flex-col gap-6 items-center justify-between px-4 py-6 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[40px] md:h-[50px] flex">
                  <div className="flex-1 bg-[#477370]"></div>
                  <div className="flex-1 bg-[#BA3B3A]"></div>
                  <div className="flex-1 bg-[#E4A63A]"></div>
                  <div className="flex-1 bg-[#FEFEFE]"></div>
                  <div className="flex-1 bg-[#020100]"></div>
                </div>
                <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-[80px]  bg-white relative mt-[20px] md:mt-[50px] mt-[25px]">
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
              {!isDesktop && (
                <div
                  className="flex justify-center bg-[#E2D5D0] px-4 py-4 rounded-xl bg-opacity-40 md:px-8 md:py-4"
                  onClick={() => setShowModal(true)}
                >
                  <p className="text-xl text-black font-bold opacity-70 md:text-3xl">
                    псс правила?
                  </p>
                </div>
              )}

              <button
                type="submit"
                onClick={trackButtonClick}
                className="w-[150px] md:w-[250px] h-[50px] md:h-[70px] bg-[#F24236] rounded-xl text-center font-bold px-6 py-2 text-xl  md:text-3xl hover:bg-red-700 relative"
              >
                Начать
              </button>
            </div>
            {isDesktop && <ImageTextSlider />}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Auth;
