"use client";
import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import Difficulty from "@/components/Difficulty";
import AreaVocab from "@/components/AreaVocab";
import UsersTop from "@/components/UsersTop";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingScreen from "@/components/LoadingScreen";
import DesktopSettings from "@/components/DesktopSettings";
import { useMediaQuery } from "react-responsive";
import ReactGA from "react-ga";
import Language from "@/components/Language";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

interface User {
  userId: string | null;
  userName: string | null;
  _id: string | null;
  userPhoto: string | null;
}

interface UserW {
  userId: string | null;
  username: string | null;
  _id: string | null;
  userPhoto: string | null;
}

const Settings = () => {
  const [active, setActive] = useState<string | null>("difficulty");
  const [selectedOptionDifficulty, setSelectedOptionDifficulty] = useState<
    string | null
  >("");
  const [selectedOptionAreaVocab, setSelectedOptionAreaVocab] = useState<
    string | null
  >("");
  const [selectedOptionLanguage, setSelectedOptionLanguage] = useState<
    string | null
  >("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const pathname = usePathname();
  const roomName: any = pathname.split("/").pop();
  const router = useRouter();
  const [joinedUserArray, setJoinedUserArray] = useState<User[]>([]);
  const [waitingUsers, setWaitingUsers] = useState<UserW[]>([]);
  const [roomId, setRoomId] = useState("");
  const [hostId, setHostId] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [combinedUsers, setCombinedUsers] = useState<any>([]);
  const rommHostIdRef = useRef("");
  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const fetchUsername = async (userId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/username/${userId}`
      );
      if (response.data.success) {
        return response.data.username;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user/${userId}`
      );
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    setIsMounted(true);

    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      //добавить проверку на существование юзера в базе данных
      router.push(`/pages/auth/${roomName}`);
      return;
    }

    setUserId(currentUserId);
    if (currentUserId) {
      fetchUsername(currentUserId).then((username) => {
        if (username) {
          setUsername(username);
        }
      });
    }

    const storedHostId = localStorage.getItem("hostId");
    if (storedHostId) {
      setHostId(storedHostId);
    }

    localStorage.removeItem("secretWord");
    setLoading(false);
  }, [roomName, router]);

  useEffect(() => {
    if (username) {
      const newSocket: any = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
        transports: ["websocket"],
      });
      setSocket(newSocket);
      localStorage.setItem("websocket", newSocket);

      newSocket.on("getRoomId", (roomId: string) => {
        localStorage.setItem("roomId", roomId);
        setRoomId(roomId);
        console.log(`THIS IS A ROOM ID -- ${roomId}`);
        console.log(`Room ID received: ${roomId}`);
        setLoading(false);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [username]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId).then((user) => {
        if (user) {
          setUserPhoto(user.userPhoto);
        }
      });
    }
  }, [userId]);

  useEffect(() => {
    if (socket && roomName && username && userId && userPhoto) {
      // const currentRoomName = localStorage.getItem("currentRoomName");
      // if (currentRoomName && currentRoomName !== roomName) {
      //   socket.emit("leave-room", currentRoomName);
      // }
      socket.emit("join-room", roomName, userId, username, userPhoto);
      localStorage.setItem("currentRoomName", roomName);

      // if (hostId) {
      //   console.log(`хост был отправлен всем`);
      //   socket.emit("roomHost", userId, roomName);
      // }

      // socket.on("userHostIdPls", (data) => {
      //   console.log(`${data} - userID of host room`);
      //   rommHostIdRef.current = data;
      //   console.log(`${rommHostIdRef.current} - new hostID`);
      // });

      socket.on("userJoined", (data) => {
        setJoinedUserArray((prevArray) => {
          const userExists = prevArray.some(
            (user) => user.userId === data.userId
          );
          if (!userExists) {
            return [
              ...prevArray,
              {
                userId: data.userId,
                userName: data.userName,
                userPhoto: data.userPhoto,
                _id: data.userId,
              },
            ];
          }
          return prevArray;
        });
      });

      socket.on("userLeft", (data) => {
        console.log("ПОЛЬЗОВАТЕЛЬ ВЫШЕЛ!!!");
        setJoinedUserArray((prevArray) => {
          const index = prevArray.findIndex(
            (user) => user.userId === data || user._id === data
          );
          if (index !== -1) {
            const newArray = [...prevArray];
            newArray.splice(index, 1);
            return newArray;
          }
          return prevArray;
        });

        setWaitingUsers((prevArray) => {
          const index = prevArray.findIndex(
            (user) => user.userId === data || user._id === data
          );
          if (index !== -1) {
            const newArray = [...prevArray];
            newArray.splice(index, 1);
            return newArray;
          }
          return prevArray;
        });
      });
    }
  }, [socket, roomName, username, userId, userPhoto]);

  useEffect(() => {
    ReactGA.initialize("G-LJJPTGCY1M");
  }, []);

  const trackButtonClick = () => {
    ReactGA.event({
      category: "User",
      action: "Clicked Play Button",
    });
  };

  const fetchRoomDetails = async () => {
    if (roomId) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}`
        );
        const room = response.data;
        const currentUserId = localStorage.getItem("userId");
        const filteredUsers = room.users.filter(
          (user: UserW) => user._id !== currentUserId
        );
        setWaitingUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    }
  };

  useEffect(() => {
    fetchRoomDetails();
    console.log(waitingUsers);
  }, [roomId]);

  useEffect(() => {
    if (joinedUserArray) {
      console.log(
        `JOINED USERS: ${joinedUserArray.map((user) => user.userName)}`
      );
    }
  }, [joinedUserArray]);

  const handleClick = (element: string) => {
    setActive(element);
  };

  useEffect(() => {
    if (socket) {
      socket.on("loadingEveryone", () => {
        setLoading(true);
      });
      socket.on("start-game", (url) => {
        setLoading(true);
        console.log(url, "Это был url");
        router.push(url);
      });
    }
  }, [socket]);

  useEffect(() => {
    const combinedUsersMap = new Map();
    [...waitingUsers, ...joinedUserArray].forEach((user) => {
      combinedUsersMap.set(user.userId || user._id, user);
    });
    setCombinedUsers(Array.from(combinedUsersMap.values()));
  }, [waitingUsers, joinedUserArray]);

  const handlePlay = async () => {
    if (userId !== hostId) {
      alert(translations.errorHostSettings);
      return;
    }
    if (socket && selectedOptionDifficulty) {
      if (
        (selectedOptionDifficulty !== "No AI" &&
          selectedOptionAreaVocab !== "" &&
          selectedOptionLanguage !== "") ||
        selectedOptionDifficulty === "No AI"
      ) {
        try {
          trackButtonClick();
          setLoading(true); // LOADING
          socket.emit("loadingTrue", roomName);
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/create`,
            {
              difficultyLevel: selectedOptionDifficulty,
              areaOfVocab: selectedOptionAreaVocab,
              language: selectedOptionLanguage,
              roomId: roomId,
              roomName: roomName,
            }
          );

          const moderatorResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/set-moderator`,
            {
              roomId: roomId,
            }
          );

          const moderator = moderatorResponse.data;

          socket.emit("play-game", roomName, `/pages/chat/${roomName}`);
          setLoading(false);
        } catch (error) {
          console.error("Error during game setup:", error);
          setLoading(false);
        }
      } else {
        alert(translations.errorAreaOfVocab);
      }
    } else {
      alert(translations.errorDifficultySet);
    }
  };

  const defaultStyle = { fontSize: "18px", color: "gray", fontWeight: "400" };
  const activeStyle = { fontSize: "20px", color: "#BA3B3A", fontWeight: "900" };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/pages/settings/${roomName}`;
    navigator.clipboard.writeText(url).then(
      () => {
        alert("Room URL copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy URL: ", err);
      }
    );
  };

  // const combinedUsersMap = new Map();
  // [...waitingUsers, ...joinedUserArray].forEach((user) => {
  //   combinedUsersMap.set(user.userId || user._id, user);
  // });
  // const combinedUsers = Array.from(combinedUsersMap.values());

  useEffect(() => {
    const currentRoomName = localStorage.getItem("currentRoomName");
    if (currentRoomName && currentRoomName !== roomName) {
      localStorage.removeItem("hostId");
    }
    localStorage.setItem("currentRoomName", roomName);
  }, [roomName]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handleUnload = () => {
      localStorage.setItem("reloading", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("reloading") === "true") {
      localStorage.removeItem("reloading");
      window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}`;
    }
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  if (isDesktopOrLaptop && active) {
    return (
      <div className="px-5 py-3 h-screen lg:px-32 md:px-32 lg:mt-8 md:mt-8">
        {loading && <LoadingScreen />}
        <div className="border-solid border-black border-2">
          <DesktopSettings
            loading={loading}
            combinedUsers={combinedUsers}
            active={active}
            handleClick={handleClick}
            handleCopyUrl={handleCopyUrl}
            handlePlay={handlePlay}
            setSelectedOptionAreaVocab={setSelectedOptionAreaVocab}
            setSelectedOptionDifficulty={setSelectedOptionDifficulty}
            setSelectedOptionLanguage={setSelectedOptionLanguage}
            roomName={roomName}
            hostId={rommHostIdRef.current}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-3 h-screen lg:px-32 md:px-32 lg:mt-8 md:mt-8">
      {loading && <LoadingScreen />}
      <UsersTop combinedUsers={combinedUsers} />
      <div className="w-[100%] h-[70%] bg-[#E9DED9] mt-10 overflow-auto rounded-xl overflow-x-hidden">
        <div className="flex justify-between sticky top-0 bg-[#E9DED9] z-10">
          <div
            className={`w-[49%] h-[40px] rounded-xl flex justify-center items-center cursor-pointer ${
              active === "difficulty"
                ? "border-solid border-4 border-[#FFF9E3] ml-[-5px]"
                : ""
            }`}
            onClick={() => handleClick("difficulty")}
          >
            <p style={active === "difficulty" ? activeStyle : defaultStyle}>
              {translations.Difficulty}
            </p>
          </div>
          <div
            className={`w-[49%] h-[40px] rounded-xl flex justify-center items-center cursor-pointer ${
              active === "vocabArea"
                ? "border-solid border-4 border-[#FFF9E3] mr-[-5px]"
                : ""
            }`}
            onClick={() => handleClick("vocabArea")}
          >
            <p style={active === "vocabArea" ? activeStyle : defaultStyle}>
              {translations.Vocabulary}
            </p>
          </div>
          <div
            className={`w-[49%] h-[40px] rounded-xl flex justify-center items-center cursor-pointer ${
              active === "language"
                ? "border-solid border-4 border-[#FFF9E3] mr-[-5px]"
                : ""
            }`}
            onClick={() => handleClick("language")}
          >
            <p style={active === "language" ? activeStyle : defaultStyle}>
              {translations.Language}
            </p>
          </div>
        </div>
        <div className="mt-4">
          {active === "vocabArea" && (
            <AreaVocab
              setSelectedOptionAreaVocab={setSelectedOptionAreaVocab}
            />
          )}
          {active === "difficulty" && (
            <Difficulty
              setSelectedOptionDifficulty={setSelectedOptionDifficulty}
            />
          )}
          {active === "language" && (
            <Language setSelectedOptionLanguage={setSelectedOptionLanguage} />
          )}
        </div>
      </div>
      <div className="flex text-black gap-4 justify-center mt-8">
        <button
          className="font-bold text-2xl bg-[#F24236] w-[150px] h-[40px] rounded-xl text-white hover:bg-[#d1382e] active:bg-[#b33027] hover:bg-[#FF0200]"
          onClick={handleCopyUrl}
        >
          {translations.inviteFriendMonble}
        </button>
        <button
          className="font-bold text-2xl bg-[#F24236] w-[150px] h-[40px] rounded-xl text-white hover:bg-[#d1382e] active:bg-[#b33027] hover:bg-[#FF0200]"
          onClick={handlePlay}
        >
          {translations.play}
        </button>
      </div>
    </div>
  );
};

export default Settings;
