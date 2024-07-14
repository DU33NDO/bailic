import React, { useEffect, useState } from "react";
import axios from "axios";

interface ModalConnectPopUpProps {
  onClose: () => void;
  askedUserId: string;
  clickedUserId: string;
}

const ModalConnectPopUp: React.FC<ModalConnectPopUpProps> = ({
  onClose,
  askedUserId,
  clickedUserId,
}) => {
  const [timerComplete, setTimerComplete] = useState(false);
  const [askedUserPhoto, setAskedUserPhoto] = useState<string | null>(null);
  const [clickedUserPhoto, setClickedUserPhoto] = useState<string | null>(null);
  const [askedUserName, setAskedUserName] = useState<string | null>(null);
  const [clickedUserName, setClickedUserName] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerComplete(true);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user/${userId}`
      );
      if (response.data.success) {
        return response.data.user;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const askedUserDetails = await fetchUserDetails(askedUserId);
      const clickedUserDetails = await fetchUserDetails(clickedUserId);

      if (askedUserDetails) {
        setAskedUserPhoto(askedUserDetails.userPhoto);
        setAskedUserName(askedUserDetails.username);
      }

      if (clickedUserDetails) {
        setClickedUserPhoto(clickedUserDetails.userPhoto);
        setClickedUserName(clickedUserDetails.username);
      }
    };

    getUserDetails();
  }, [askedUserId, clickedUserId]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 py-5 px-3 z-50"
      onClick={() => timerComplete && onClose()}
    >
      <div
        className="bg-gray-300 p-10 py-15 rounded-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              {askedUserPhoto ? (
                <img
                  src={askedUserPhoto}
                  alt="Asked User"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <p className="text-black"></p>
              )}
            </div>
            <p className="text-black mt-2">{askedUserName}</p>
          </div>
          <div className="w-32 h-1 bg-red-500 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              {clickedUserPhoto ? (
                <img
                  src={clickedUserPhoto}
                  alt="Clicked User"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <p className="text-black"></p>
              )}
            </div>
            <p className="text-black mt-2">{clickedUserName}</p>
          </div>
        </div>
        <div className="bg-[#CC0B0D] p-4 rounded-xl flex items-center justify-center">
          <p className="text-3xl font-bold text-white">ЕСТЬ КОНТАКТ</p>
        </div>
      </div>
    </div>
  );
};

export default ModalConnectPopUp;
