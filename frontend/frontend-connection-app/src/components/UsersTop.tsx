import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Socket, io } from "socket.io-client";

const UsersTop = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const fetchRoomDetails = async () => {
    const roomId = localStorage.getItem("roomId");
    if (roomId) {
      try {
        const response = await axios.get(
          `http://localhost:3005/rooms/${roomId}`
        );
        const room = response.data;
        setUsers(room.users);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:3005");
    setSocket(newSocket);

    newSocket.on("topUsersUpdated", (topUsers: any[]) => {
      setUsers(topUsers);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleClickPushMessage = () => {
  };

  return (
    <div>
      <div className="flex gap-6 relative">
        {users.map((user) => (
          <div key={user._id} className="flex flex-col gap-1 items-center">
            <div className="w-[40px] h-[40px] rounded-[80px] bg-white">
              <img
                src={user.userPhoto}
                alt={user.username}
                className="w-full h-full rounded-full"
              />
            </div>
            <p className="text-[10px]">{user.username}</p>
          </div>
        ))}
        <FontAwesomeIcon
          icon={faPlus}
          style={{ fontSize: "1.5em" }}
          className="absolute right-[10px] top-[15px] text-white cursor-pointer"
          onClick={handleClickPushMessage}
        />
      </div>
    </div>
  );
};

export default UsersTop;
