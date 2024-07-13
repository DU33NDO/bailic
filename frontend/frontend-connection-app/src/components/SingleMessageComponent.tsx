import React, { useState, useEffect } from "react";
import "../../circular-progress.css";

interface Message {
  userId: string;
  username: string;
  userPhoto: string;
  content: string;
  timestamp: string;
  messageId: string;
  isExpiring?: boolean;
}

const SingleMessageComponent: React.FC<{
  message: Message;
  onClick: (message: Message) => void;
}> = ({ message, onClick }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const userId = localStorage.getItem("userId");
  const isCurrentUser = message.userId === userId;

  useEffect(() => {
    if (message.isExpiring) {
      setAnimationComplete(true);
    }
  }, [message.isExpiring]);

  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`flex gap-[15px] items-center cursor-pointer mt-4 pl-2 py-2 relative ${
        animationComplete
          ? isCurrentUser
            ? "circular-progress-complete-right"
            : "circular-progress-complete"
          : ""
      } ${isCurrentUser ? "flex-row-reverse" : ""}`} // Add flex-row-reverse if the message is from the current user
      onClick={() => onClick(message)}
    >
      <div className="relative w-[70px] h-[70px]">
        <img
          className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
          src={message.userPhoto}
          alt="user photo"
        />
        <svg className="circular-progress overflow-visible">
          <circle
            className="progress-ring__circle"
            cx="35"
            cy="35"
            r={radius}
            style={{ strokeDasharray: `${circumference} ${circumference}` }}
          />
        </svg>
      </div>
      <div className="flex flex-col items-start gap-1 relative px-2">
        <p
          className={`absolute top-[-27px] ${
            isCurrentUser ? "right-5" : "left-5"
          } text-white`}
        >
          {isCurrentUser ? "You" : message.username}
        </p>
        <div className=" h-12 bg-white rounded-[21px] px-6 py-3">
          <p className="text-black text-left">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleMessageComponent;
