import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface User {
  userId: string | null;
  userName: string | null;
  username: string | null;
  userPhoto: string | null;
  _id: string | null;
}

interface UserW {
  userId: string | null;
  userName: string | null;
  username: string | null;
  _id: string | null;
  userPhoto: string | null;
}

interface UsersTopProps {
  combinedUsers: (User | UserW)[];
}

const UsersTop: React.FC<UsersTopProps> = ({ combinedUsers }) => {
  const handleClickPushMessage = () => {};

  return (
    <div>
      <div className="flex gap-6 relative">
        {combinedUsers.map((user, index) => (
          <div
            key={user.userId || user._id || index}
            className="flex flex-col gap-1 items-center"
          >
            <div className="w-[40px] h-[40px] rounded-[80px] bg-[#9A7B6E]">
              <img
                src={user.userPhoto || ""}
                alt={user.userName || user.username || ""}
                className="w-full h-full rounded-full"
              />
            </div>
            <p className="text-[10px] text-[#9A7B6E] font-extrabold">{user.userName || user.username}</p>
          </div>
        ))}
        <FontAwesomeIcon
          icon={faPlus}
          style={{ fontSize: "1.5em" }}
          className="absolute right-[10px] top-[15px] text-[#F24236] cursor-pointer"
          onClick={handleClickPushMessage}
        />
      </div>
    </div>
  );
};

export default UsersTop;
