"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import React from "react";
import { Socket, io } from "socket.io-client";
import { usePathname } from "next/navigation";
import MessageComponent from "@/components/MessageComponent";
import ModalModeratorInput from "@/components/ModalModeratorInput";
import ModalModerator from "@/components/ModalModerator";
import ModalConnectPopUp from "@/components/ModalConnectPopUp";
import ModalConnectAsked from "@/components/ModalConnectAsked";
import ModalConnectAnswer from "@/components/ModalConnectAnswer";
import ModalConnectOthers from "@/components/ModalConnectOthers";
import ModalResults from "@/components/ModalResults";
import ModalConnectGameOver from "@/components/ModalConnectGameOver";

interface Message {
  userId: string;
  username: string;
  userPhoto: string;
  content: string;
  timestamp: string;
  messageId: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [moderatorMessages, setModeratorMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [moderator, setModerator] = useState<{
    username: string;
    userPhoto: string;
    userId: string;
  } | null>(null);
  const [showModeratorInput, setShowModeratorInput] = useState(false);
  const [showModeratorModal, setShowModeratorModal] = useState(false);
  const [moderatorId, setModeratorId] = useState<string | null>(null);
  const [secretWord, setSecretWord] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const pathname = usePathname();
  const roomName = pathname.split("/").pop();
  const [showContact, setShowContact] = useState(false);
  const [showAskedUser, setShowAskedUser] = useState(false);
  const [showClickedUser, setShowClickedUser] = useState(false);
  const [showClickedModerator, setShowClickedModerator] = useState(false);
  const [showOtherUsers, setShowOtherUsers] = useState(false);
  const [allWords, setAllWords] = useState<{
    moderatorWord: string;
    askedWord: string;
    clickedWord: string;
    moderatorUserName: string;
    moderatorUserPhoto: string;
    clickedUserName: string;
    clickedUserPhoto: string;
    secretWord: string;
  } | null>(null);
  const [showAllWords, setShowAllWords] = useState(false);
  const [countLetter, setCountLetter] = useState(1);
  const [isGameWonByUsers, setIsGameWonByUsers] = useState(false);

  // Initialize user and room information
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRoomId = localStorage.getItem("roomId");
    const storedModeratorId = localStorage.getItem("moderatorId");
    const storedSecretWord = localStorage.getItem("secretWord");

    if (storedUserId) setUserId(storedUserId);
    if (storedRoomId) setRoomId(storedRoomId);
    if (storedModeratorId) setModeratorId(storedModeratorId);
    if (storedSecretWord) setSecretWord(storedSecretWord.toLowerCase());
  }, []);

  // Initialize socket connection and event listeners
  useEffect(() => {
    if (userId && roomId && !socketRef.current) {
      const fetchUserDetails = async (userId: string) => {
        try {
          const response = await axios.get(
            `http://localhost:3005/auth/user/${userId}`
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

      fetchUserDetails(userId).then((user) => {
        if (user) {
          setUsername(user.username);
          setUserPhoto(user.userPhoto);
          const socket = io("http://localhost:3005", {
            transports: ["websocket"],
          });
          socketRef.current = socket;

          socket.emit("join-room", roomName, userId, user.username);

          socket.on("newModerator", (moderator: any) => {
            setModerator({
              username: moderator.username,
              userPhoto: moderator.userPhoto,
              userId: moderator._id,
            });

            localStorage.setItem("moderatorId", moderator._id);
            setModeratorId(moderator._id);
            setShowModeratorModal(true);
            console.log(`New host: ${moderator.username}; ${moderator.userId}`);
          });

          socket.on("setSecretWord", (word) => {
            localStorage.setItem("secretWord", word);
            setSecretWord(word.toLowerCase());
          });

          socket.on("newMessage", (data: any) => {
            console.log("New message received:", data);

            if (data.userId === moderatorId) {
              setModeratorMessages((prevModeratorMessages) => [
                ...prevModeratorMessages,
                data,
              ]);
            } else {
              setMessages((prevMessages) => [...prevMessages, data]);
            }

            setTimeout(() => {
              socket.emit("ExpiredMessage", { ...data, roomName });
            }, 10000);
          });

          socket.on("connectToPlayers", (data) => {
            setShowContact(true);
            console.log(
              `ASKED USER ID: ${data.askedUserId}, CLICKED USER: ${data.clickedUserId}`
            );
            if (data.askedUserId === userId) {
              setShowAskedUser(true);
              console.log(data.messageToAsked);
            }

            if (data.clickedUserId === userId) {
              setShowClickedUser(true);
              console.log(data.messageToCkick);
            }

            if (moderatorId === userId) {
              setShowClickedModerator(true);
              console.log(data.messageToModerator);
            }

            if (
              data.askedUserId !== userId &&
              data.clickedUserId !== userId &&
              moderatorId !== userId
            ) {
              setShowOtherUsers(true);
            }
          });

          socket.on("DeleteMessage", (targetMessage) => {
            console.log(`DELETE MESSAGE FROM FRONT: ${targetMessage}`);
            setMessages((prevMessages) =>
              prevMessages.filter(
                (message) => message.messageId !== targetMessage.messageId
              )
            );
            setModeratorMessages((prevModeratorMessages) =>
              prevModeratorMessages.filter(
                (message) => message.messageId !== targetMessage.messageId
              )
            );
            socket.emit("DeleteFromDB", targetMessage);
          });

          socket.on("allWords", (data) => {
            console.log(
              `checkAndEmitGameData CHECK: ${data.moderatorWord}; ${data.askedWord}, ${data.clickedWord}`
            );
            setAllWords({
              moderatorWord: data.moderatorWord.toLowerCase(),
              askedWord: data.askedWord.toLowerCase(),
              clickedWord: data.clickedWord.toLowerCase(),
              moderatorUserName: data.moderatorUserName,
              moderatorUserPhoto: data.moderatorUserPhoto,
              clickedUserName: data.clickedUserName,
              clickedUserPhoto: data.clickedUserPhoto,
              secretWord: data.secretWord,
            });
            if (
              data.secretWord &&
              data.askedWord.toLowerCase() === data.clickedWord.toLowerCase() &&
              data.askedWord.toLowerCase() === data.secretWord.toLowerCase() &&
              data.clickedWord.toLowerCase() === data.secretWord.toLowerCase()
            ) {
              if (
                data.moderatorWord.toLowerCase() ===
                  data.secretWord.toLowerCase() ||
                data.moderatorWord.toLowerCase() !==
                  data.secretWord.toLowerCase()
              ) {
                setIsGameWonByUsers(true);
                console.log(`Game is over congr`);
                // alert(`GAME IS OVER !!!!!`);
              }
            } else if (
              data.askedWord.toLowerCase() ===
                data.moderatorWord.toLowerCase() &&
              data.askedWord.toLowerCase() === data.clickedWord.toLowerCase()
            ) {
              setCountLetter((prevCount) => prevCount);
            } else if (
              data.askedWord.toLowerCase() === data.clickedWord.toLowerCase() &&
              data.askedWord.toLowerCase() !== data.moderatorWord.toLowerCase()
            ) {
              setCountLetter((prevCount) => prevCount + 1);
              console.log(`COUNT LETTER: ${countLetter} `);
            } else {
              setCountLetter((prevCount) => prevCount);
            }
          });

          axios
            .get(`http://localhost:3005/messages/${roomId}`)
            .then((response) => {
              setMessages(response.data);
            });

          return () => {
            socket.off("newModerator");
            socket.off("newMessage");
            socket.off("DeleteMessage");
            socket.disconnect();
          };
        }
      });
    }
  }, [userId, roomId, roomName, moderatorId, secretWord]);

  useEffect(() => {
    if (allWords) {
      setShowAllWords(true);
    }
  }, [allWords]);

  useEffect(() => {
    if (secretWord && countLetter >= secretWord.length) {
      setIsGameWonByUsers(true);
    }
  }, [countLetter, secretWord]);

  const onSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const messageContent = data.get("message") as string;

    if (socketRef.current) {
      const message = {
        text: messageContent,
        roomId,
        userPhoto,
        username,
        userId,
        roomName,
      };
      socketRef.current.emit("sendMessage", message, roomName);
    }

    form.reset();
  };

  const onCloseModerator = (moderator: any) => {
    setShowModeratorModal(false);
    if (moderator.userId === userId) {
      setShowModeratorInput(true);
    }
  };

  const handleModeratorSubmit = (word: string) => {
    if (socketRef.current) {
      socketRef.current.emit("secretWord", { word, roomId, roomName });
    }
    setShowModeratorInput(false);
  };

  const handleClickMessage = (message: any) => {
    if (message.userId !== userId) {
      setIsClicked(true);
      if (isClicked === true && socketRef.current && moderatorId) {
        socketRef.current.emit("connectStarts", {
          roomId: roomId,
          roomName: roomName,
          askedUserId: message.userId,
          clickedUserId: userId,
          moderatorId: moderatorId,
        });
      } else {
        console.log("No moderator or isClicked or websocket");
      }
    }
  };

  const handleCloseModalAsked = () => {
    setShowAskedUser(false);
  };

  const handleCloseModalAllWords = () => {
    setShowAllWords(false);
  };

  const closeIsGameOver = () => {
    setIsGameWonByUsers(false);
    window.location.reload();
  };

  const handleSubmitWord = (word: string) => {
    if (socketRef.current) {
      socketRef.current.emit("sendTargetWord", {
        word: word.toLowerCase(),
        roomName: roomName,
        userName: username,
        userPhoto: userPhoto,
      });
    }
  };

  const handleCloseModalAnswerModerator = (word: string) => {
    setShowClickedModerator(false);
    if (socketRef.current) {
      socketRef.current.emit("sendModeratorWordGame", {
        word: word,
        roomName: roomName,
        userName: username,
        userPhoto: userPhoto,
        secretWord: secretWord,
      });
    }
  };

  const handleCloseModalAnswerUser = (word: string) => {
    setShowClickedUser(false);
    if (socketRef.current) {
      socketRef.current.emit("sendClickedUserWord", {
        word: word,
        roomName: roomName,
        userName: username,
        userPhoto: userPhoto,
      });
    }
  };

  return (
    <div className="px-5 py-3">
      {showModeratorModal && moderator && (
        <ModalModerator
          username={moderator.username}
          userPhoto={moderator.userPhoto}
          onClose={() => {
            onCloseModerator(moderator);
          }}
        />
      )}
      {showModeratorInput && (
        <ModalModeratorInput
          onClose={() => setShowModeratorInput(false)}
          onSubmit={handleModeratorSubmit}
        />
      )}
      {showContact && (
        <ModalConnectPopUp onClose={() => setShowContact(false)} />
      )}
      {showAskedUser && showContact === false && secretWord && (
        <ModalConnectAsked
          onClose={handleCloseModalAsked}
          onSubmit={handleSubmitWord}
          revealedLetters={secretWord.slice(0, countLetter)}
        />
      )}
      {showClickedUser && showContact === false && secretWord && (
        <ModalConnectAnswer
          onClose={handleCloseModalAnswerUser}
          revealedLetters={secretWord.slice(0, countLetter)}
        />
      )}
      {showClickedModerator && showContact === false && secretWord && (
        <ModalConnectAnswer
          onClose={handleCloseModalAnswerModerator}
          revealedLetters={secretWord.slice(0, countLetter)}
        />
      )}
      {showOtherUsers && showContact === false && (
        <ModalConnectOthers onClose={() => setShowOtherUsers(false)} />
      )}
      {showAllWords && allWords && (
        <ModalResults
          moderatorUsername={allWords.moderatorUserName}
          moderatorUserPhoto={allWords.moderatorUserPhoto}
          moderatorWord={allWords.moderatorWord}
          clickedUserName={allWords.clickedUserName}
          clickedUserPhoto={allWords.clickedUserPhoto}
          clickedWord={allWords.clickedWord}
          targetWord={allWords.askedWord}
          onClose={handleCloseModalAllWords}
        />
      )}
      {isGameWonByUsers && (
        <ModalConnectGameOver onClose={() => closeIsGameOver()} />
      )}
      <div className="flex justify-center mt-6">
        <div className="flex bg-gray-300 w-80 h-[60px] items-center justify-center rounded-xl">
          <p className="text-black font-bold text-center text-5xl tracking-[.25em]">
            {secretWord && secretWord.slice(0, countLetter)}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-12">
        <div className="w-[50%] h-[90px] bg-white rounded-[21px]">
          {moderatorMessages.map((message, index) => (
            <p className="text-black text-xl px-5 py-2" key={index}>
              {message.content}
            </p>
          ))}
        </div>
        <div className="w-[120px] h-[120px] rounded-[80px] bg-red-700">
          {moderator && (
            <img
              className="w-full h-full object-cover rounded-[80px]"
              src={moderator.userPhoto}
              alt="Moderator"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[24px] mt-14 w-[100%] h-[40vh] bg-gray-400 rounded-xl overflow-scroll py-3">
        {messages.map((message, index) => (
          <div className="" key={index}>
            <MessageComponent
              message={message}
              onClick={handleClickMessage}
            ></MessageComponent>
          </div>
        ))}
      </div>
      <div className="flex">
        <form action="" onSubmit={onSubmitMessage} className="mt-10">
          <input
            type="text"
            name="message"
            id="message"
            placeholder="text: "
            className="text-gray-700 w-[75%] h-10 rounded-xl px-5 py-4"
          />
          <button type="submit" className="ml-4 ">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
