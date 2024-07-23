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
  const [active, setActive] = useState<string | null>("vocabArea");
  const [selectedOptionDifficulty, setSelectedOptionDifficulty] = useState<
    string | null
  >("");
  const [selectedOptionAreaVocab, setSelectedOptionAreaVocab] = useState<
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
      router.push(`/pages/auth/${roomName}`); //кажется не работает на деплой версии
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
          console.log(`ЭТО ИНФА ПРО ЮЗЕРА -${user.userPhoto}`);
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

      // socket.emit("userLeftRoom", (userId, roomId,))

      // socket.on("userLeft", (userId) => {
      //   console.log(`выход произошел со стороны фронтенда!`);
      // });
    }
  }, [socket, roomName, username, userId, userPhoto]);

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

  console.log(
    `Difficulty: ${selectedOptionDifficulty}, areaOfVocab: ${selectedOptionAreaVocab}`
  );

  const handlePlay = async () => {
    if (userId !== hostId) {
      alert("Only the host can start the game.");
      return;
    }
    if (socket) {
      try {
        setLoading(true); // LOADING
        socket.emit("loadingTrue", roomName);
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/create`, {
          difficultyLevel: selectedOptionDifficulty,
          areaOfVocab: selectedOptionAreaVocab,
          roomId: roomId,
          roomName: roomName,
        });

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

  const combinedUsersMap = new Map();
  [...waitingUsers, ...joinedUserArray].forEach((user) => {
    combinedUsersMap.set(user.userId || user._id, user);
  });
  const combinedUsers = Array.from(combinedUsersMap.values());

  useEffect(() => {
    const currentRoomName = localStorage.getItem("currentRoomName");
    if (currentRoomName && currentRoomName !== roomName) {
      localStorage.removeItem("hostId");
    }
    localStorage.setItem("currentRoomName", roomName);
  }, [roomName]);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  if (isDesktopOrLaptop && active) {
    return (
      <div className="px-5 py-3 h-screen md:px-64 md:mt-8">
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
            roomName={roomName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-3 h-screen md:px-64 md:mt-8">
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
      <div className="flex text-black gap-4 justify-center mt-8">
        <button
          className="font-bold text-2xl bg-[#F24236] w-[150px] h-[40px] rounded-xl text-white hover:bg-[#d1382e] active:bg-[#b33027] hover:bg-[#FF0200]"
          onClick={handleCopyUrl}
        >
          Invite
        </button>
        <button
          className="font-bold text-2xl bg-[#F24236] w-[150px] h-[40px] rounded-xl text-white hover:bg-[#d1382e] active:bg-[#b33027] hover:bg-[#FF0200]"
          onClick={handlePlay}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default Settings;
