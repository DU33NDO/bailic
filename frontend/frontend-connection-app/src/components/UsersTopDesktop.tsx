import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

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

interface UserListProps {
  combinedUsers: User[];
  handleCopyUrl: any;
  hostId: string | null;
}

const UserList: React.FC<UserListProps> = ({
  combinedUsers,
  handleCopyUrl,
  hostId,
}) => {
  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();
  return (
    <div className="w-[40%] bg-[#E9DED9] px-6 py-4 pb-6 rounded-2xl">
      <div className="flex flex-col gap-14 relative">
        <div className="flex flex-col gap-2 items-center px-16 py-2 rounded-3xl">
          <button className="flex items-center text-center justify-between w-full px-4 py-4 bg-[#217470] text-white font-bold rounded-lg border-2 border-[#71C0BC] hover:bg-[#25ABA5] focus:outline-none focus:ring-2 focus:ring-[#71C0BC">
            Add Bot
          </button>
          <button
            onClick={handleCopyUrl}
            className="flex items-center text-center justify-between w-full px-4 py-4 bg-[#E4A63A] text-white font-bold rounded-lg border-2 border-[#d7b476] hover:bg-[#ffa200] focus:outline-none focus:ring-2 focus:ring-[#F9A20A"
          >
            {translations.inviteFriend}
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {combinedUsers.map((user, index) => (
            <div
              key={user.userId || user._id || index}
              className="flex gap-4 items-center bg-[#477370] text-white px-4 py-2 rounded-lg"
            >
              <div className="relative w-[50px] h-[50px] rounded-full bg-[#9A7B6E] flex items-center justify-center">
                <img
                  src={user.userPhoto || ""}
                  alt={user.userName || user.username || ""}
                  className="w-full h-full rounded-full"
                />
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute bottom-0 right-0 bg-white text-red-500 rounded-full p-1"
                />
              </div>
              <p className="text-xl font-bold">
                {user.userName || user.username}
              </p>
              {(user._id === hostId || user.userId === hostId) && (
                <img
                  src="/photos/crown.png"
                  className="w-7 right-8 absolute"
                  alt="Host"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
