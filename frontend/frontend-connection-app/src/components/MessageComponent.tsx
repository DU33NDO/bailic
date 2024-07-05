import React from "react";

interface Message {
  userId: string;
  username: string;
  userPhoto: string;
  content: string;
  timestamp: string;
}

const MessageComponent: React.FC<{
  message: Message;
  onClick: (message: Message) => void;
}> = ({ message, onClick }) => {
  return (
    <div
      className="flex gap-[15px] items-center cursor-pointer px-2 py-2"
      onClick={() => onClick(message)}
    >
      <div className="w-[70px] h-[70px] rounded-full bg-white border-solid border-4 border-green-700 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={message.userPhoto}
          alt="user photo"
        />
      </div>
      <div className="w-72 h-12 bg-white rounded-[21px] px-6 py-3 relative">
        <p className="text-green-700 absolute bottom-12">{message.username}</p>
        <p className="text-black text-left">{message.content}</p>
      </div>
    </div>
  );
};

export default MessageComponent;
