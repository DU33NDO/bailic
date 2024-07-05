"use client";
import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import Difficulty from "@/components/Difficulty";
import AreaVocab from "@/components/AreaVocab";
import UsersTop from "@/components/UsersTop";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  userId: string | null;
  userName: string | null;
}

interface UserW {
  userId: string | null;
  username: string | null;
  _id: string | null;
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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const pathname = usePathname();
  const roomName = pathname.split("/").pop();
  const router = useRouter();
  const [joinedUserId, setJoinedUserId] = useState(null);
  const [joinedUserName, setJoinedUserName] = useState(null);
  const [joinedUserPhoto, setJoinedUserPhoto] = useState(null);
  const [joinedUserArray, setJoinedUserArray] = useState<User[]>([]);
  const [waitingUsers, setWaitingUsers] = useState<UserW[]>([]);
  const [roomId, setRoomId] = useState("");

  const fetchUsername = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3005/auth/username/${userId}`
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
      const response = await axios.get(`http://localhost:3005/auth/${userId}`);
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUsername(userId).then((username) => {
        if (username) {
          setUsername(username);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (username) {
      const newSocket: any = io("http://localhost:3005", {
        transports: ["websocket"],
      });
      setSocket(newSocket);
      localStorage.setItem("websocket", newSocket);

      newSocket.on("getRoomId", (roomId: string) => {
        localStorage.setItem("roomId", roomId);
        setRoomId(roomId);
        console.log(`Room ID received: ${roomId}`);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [username]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (socket && roomName && username) {
      socket.emit("join-room", roomName, userId, username);
      socket.on("userJoined", (data) => {
        setJoinedUserArray((prevArray) => [
          ...prevArray,
          { userId: data.userId, userName: data.userName },
        ]);
      });
    }
  }, [socket, roomName, username]);

  const fetchRoomDetails = async () => {
    if (roomId) {
      try {
        const response = await axios.get(
          `http://localhost:3005/rooms/${roomId}`
        );
        const room = response.data;
        const userDetailsPromises = room.users.map((userId: string) =>
          fetchUserDetails(userId)
        );
        const userDetails = await Promise.all(userDetailsPromises);
        setWaitingUsers(userDetails);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  useEffect(() => {
    if (joinedUserArray) {
      console.log(
        `JOINED USERS: ${joinedUserArray.map((user) => user.userName)}`
      );
    }
  }, [joinedUserArray]);

  const handleClick = (element: string) => {
    setActive((prevActive) => (prevActive === element ? null : element));
  };

  useEffect(() => {
    if (socket) {
      socket.on("start-game", (url) => {
        console.log(url, "Это был url");
        router.push(url);
      });
    }
  }, [socket]);

  console.log(
    `Difficulty: ${selectedOptionDifficulty}, areaOfVocab: ${selectedOptionAreaVocab}`
  );

  const handlePlay = () => {
    if (socket && roomId) {
      axios.post("http://localhost:3005/game/create", {
        difficultyLevel: selectedOptionDifficulty,
        areaOfVocab: selectedOptionAreaVocab,
        roomId: roomId,
        roomName: roomName,
      });

      socket.emit("play-game", roomName, `/pages/chat/${roomName}`);
    }
  };

  const defaultStyle = { fontSize: "18px", color: "black", fontWeight: "bold" };
  const activeStyle = { fontSize: "20px", color: "yellow", fontWeight: "bold" };

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

  // {joinedUserArray.map((joinedUser, index) => (
  //   <div key={index}>
  //     <p>{joinedUser.userName}</p>
  //     <p>{joinedUser.userId}</p>
  //   </div>
  // ))}
  // {waitingUsers.map((joinedUser, index) => (
  //   <div key={index}>
  //     <p>{joinedUser.username}</p>
  //     {/* <p>{joinedUser.userId}</p> */}
  //   </div>
  // ))}
  return (
    <div className="px-5 py-3 h-screen">
      <UsersTop />
      <div className="w-[100%] h-[70%] bg-[#f7f7f7] mt-10 overflow-auto rounded-xl">
        <div className="flex justify-between bg-red-700 ">
          <div
            className="bg-gray-400 w-[49%] h-[40px] rounded-t-xl flex justify-center items-center cursor-pointer"
            onClick={() => handleClick("vocabArea")}
          >
            <p style={active === "vocabArea" ? activeStyle : defaultStyle}>
              Difficulty level
            </p>
          </div>
          <div
            className="bg-gray-400 w-[49%] h-[40px] rounded-t-xl flex justify-center items-center cursor-pointer"
            onClick={() => handleClick("difficulty")}
          >
            <p style={active === "difficulty" ? activeStyle : defaultStyle}>
              Area of vocab
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
          className="font-bold text-2xl bg-gray-700 w-[150px] h-[40px] rounded-xl"
          onClick={handleCopyUrl}
        >
          Invite
        </button>
        <button
          className="font-bold text-2xl bg-gray-700 w-[150px] h-[40px] rounded-xl"
          onClick={handlePlay}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default Settings;
