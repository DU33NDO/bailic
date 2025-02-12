"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
import { Socket, io } from "socket.io-client";
import { usePathname } from "next/navigation";
import SingleMessageComponent from "@/components/SingleMessageComponent";
import ModalModeratorInput from "@/components/ModalModeratorInput";
import ModalModerator from "@/components/ModalModerator";
import ModalConnectPopUp from "@/components/ModalConnectPopUp";
import ModalConnectAsked from "@/components/ModalConnectAsked";
import ModalConnectAnswer from "@/components/ModalConnectAnswer";
import ModalConnectOthers from "@/components/ModalConnectOthers";
import ModalResults from "@/components/ModalResults";
import ModalConnectGameOver from "@/components/ModalConnectGameOver";
import ModalConnectModeratorCase from "@/components/ModalConnectModeratorCase";
import ModalResultsSecond from "@/components/ModalResultsSecond";
import "../../../../../for_scroll.css";
import { useAudio } from "@/context/AudioContext";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/hooks/useLanguage";
import { useMounted } from "@/hooks/useMounted";

interface Message {
  userId: string;
  username: string;
  userPhoto: string;
  content: string;
  timestamp: string;
  messageId: string;
  isExpiring?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [moderatorMessages, setModeratorMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);
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
  const [showNoContact, setShowNoContact] = useState(false);
  const [showClickedModeratorSecond, setShowClickedModeratorSecond] =
    useState(false);
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
  const [allWordsSecond, setAllWordsSecond] = useState<{
    moderatorWord: string;
    askedWord: string;
    moderatorUserName: string;
    moderatorUserPhoto: string;
    secretWord: string;
  } | null>(null);
  const [showAllWords, setShowAllWords] = useState(false);
  const [showAllWordsSecond, setShowAllWordsSecond] = useState(false);
  const [countLetter, setCountLetter] = useState(1);
  const [isGameWonByUsers, setIsGameWonByUsers] = useState(false);
  const [showAskedUserSecond, setShowAskedUserSecond] = useState(false);
  const [showOtherUsersSecond, setShowOtherUsersSecond] = useState(false);
  const [storedWords, setStoredWords] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [hasShownConnectPopUp, setHasShownConnectPopUp] = useState(false);
  const [hasShownConnectModeratorCase, setHasShownConnectModeratorCase] =
    useState(false);
  const [askedUserIdState, setAskedUserIdState] = useState("");
  const [clickedUserIdState, setClickedUserIdState] = useState("");
  const [closeImmediately, setCloseImmediately] = useState(false);
  const [closeImmediatelySecond, setCloseImmediatelySecond] = useState(false);
  const [difficultyLevelState, setDifficultyLevelState] = useState("");
  const difficultyLevelRef = useRef("");
  const [areaOfVocabState, setAreaOfVocabState] = useState("");
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [showAIconnect, setShowAIconnect] = useState(false);
  const showAIconnectRef = useRef(false);
  const moderatorIDRef = useRef("");
  const languageRef = useRef("");
  const [locale] = useLanguage();
  const translations = useTranslations(locale.language);
  const mounted = useMounted();

  const aiPhoto = "/avatar/aiPhoto.jpg";
  const router = useRouter();

  const { isPlaying, toggleAudio, setAudioSource } = useAudio();

  useEffect(() => {
    setAudioSource("/music/game_music.mp4");
  }, [setAudioSource]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRoomId = localStorage.getItem("roomId");
    // const storedModeratorId = localStorage.getItem("moderatorId");
    const storedSecretWord = localStorage.getItem("secretWord");
    const storedHostId = localStorage.getItem("hostId");

    if (storedUserId) setUserId(storedUserId);
    if (storedRoomId) setRoomId(storedRoomId);
    if (storedHostId) setHostId(storedHostId);
    // if (storedModeratorId) setModeratorId(storedModeratorId);
    if (storedSecretWord) setSecretWord(storedSecretWord.toLowerCase());
  }, []);

  const fetchRoomDetails = async (roomId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}`
      );
      return response.data.users; //array
    } catch (error) {
      console.error("Error fetching room details:", error);
      return null;
    }
  };

  const timerAIresponse = (difficultyLevel: string) => {
    switch (difficultyLevel) {
      case "Hard":
        return 1500;
      case "Medium":
        return 2500;
      case "Easy":
        return 4000;
      default:
        return 1500;
    }
  };

  const fetchGameDetails = async (roomId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/get-game/${roomId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching room details:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userId && roomId && !socketRef.current) {
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

      fetchRoomDetails(roomId).then((arrayOfUsers) => {
        console.log("ЭТО МАССИВ ЮЗЕРОВ -", arrayOfUsers);

        fetchUserDetails(userId).then((user) => {
          if (user) {
            setUsername(user.username);
            setUserPhoto(user.userPhoto);
            const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
              transports: ["websocket"],
            });
            socketRef.current = socket;

            socket.emit(
              "join-room",
              roomName,
              userId,
              user.username,
              userPhoto
            );
            console.log(`ROOM NAME !!!! - ${roomName}`);

            fetchGameDetails(roomId).then((gameDetails: any) => {
              if (gameDetails) {
                console.log(`GAME DIFFICULTY: ${gameDetails.difficultyLevel}`); //wfwf
                setDifficultyLevelState(gameDetails.difficultyLevel);
                difficultyLevelRef.current = gameDetails.difficultyLevel;
                languageRef.current = gameDetails.language;
                setAreaOfVocabState(gameDetails.areaOfVocab);

                if (gameDetails.difficultyLevel === "No AI") {
                  console.log("NO AI VERSION");
                  axios
                    .get(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/get-moderator/${roomId}`
                    )
                    .then((response) => {
                      const moderatorIdQuery = response.data;
                      console.log(moderatorIdQuery);

                      axios
                        .get(
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user/${moderatorIdQuery}`
                        )
                        .then((res: any) => {
                          setModerator({
                            username: res.data.user.username,
                            userPhoto: res.data.user.userPhoto,
                            userId: res.data.user._id,
                          });

                          localStorage.setItem(
                            "moderatorId",
                            res.data.user._id
                          );
                          setModeratorId(res.data.user._id);
                          moderatorIDRef.current = res.data.user._id;
                          console.log(
                            `ПРОВЕРКА ВЕДУЩЕГО - ${moderatorId};;; ${moderatorIDRef.current}`
                          );
                          setShowModeratorModal(true);
                        });
                    });
                } else {
                  socket.emit(
                    "NewWordFromBack",
                    gameDetails.areaOfVocab,
                    gameDetails.language,
                    roomName
                  );
                }
              }
            });

            socket.on("setSecretWordFromBack", (word) => {
              // from backend
              console.log(`ПРИШЛО ЛИ СЛОВО? ${word}`);
              localStorage.setItem("secretWord", word);
              setSecretWord(word.toLowerCase());
            });

            socket.on("newMessage", async (data: any) => {
              console.log("New message received:", data);
              console.log(`Проверка - ${data.userId} отправитель сообщения`);
              console.log(
                `${difficultyLevelRef.current} - 2проверка на уровень сложности!!!!`
              );

              const message = { ...data, isExpiring: false };

              if (difficultyLevelRef.current !== "No AI") {
                setMessages((prevMessages) => [...prevMessages, message]);
                console.log("WITH AI VERSION");
              } else {
                console.log(
                  `ВНИМАНИЕ! ПРОВЕРКА НА USER ID MODERATOR: ${data.userId} AND ${moderatorId}`
                );
                if (
                  // data.userId === moderatorId ||
                  data.userId === moderatorIDRef.current
                ) {
                  setModeratorMessages((prevModeratorMessages) => [
                    ...prevModeratorMessages,
                    message,
                  ]);
                } else {
                  setMessages((prevMessages) => [...prevMessages, message]);
                }
              }

              setTimeout(() => {
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.messageId === data.messageId
                      ? { ...msg, isExpiring: true }
                      : msg
                  )
                );

                setTimeout(() => {
                  setMessages((prevMessages) =>
                    prevMessages.filter(
                      (msg) => msg.messageId !== data.messageId
                    )
                  );
                  setModeratorMessages((prevModeratorMessages) =>
                    prevModeratorMessages.filter(
                      (msg) => msg.messageId !== data.messageId
                    )
                  );
                  socket.emit("ExpiredMessage", { ...data, roomName });
                }, 300);
              }, 8000);
            });

            socket.on("AI_message", (aiResponse: any) => {
              setModeratorMessages((prevModeratorAIMessages) => [
                ...prevModeratorAIMessages,
                aiResponse,
              ]);
              console.log(`AI moderator lis: ${moderatorMessages}`);
              console.log(`AI MESSAGE FROM FRONT 80%<: ${aiResponse}`);
            });

            // socket.on("AI_answer", (aiResponse: any) => {
            //   console.log(`${moderatorMessages} - ai moderator messages`);
            //   console.log(`AI ANSWER: ${aiResponse}`);
            // });

            socket.on("setSecretWord", (word) => {
              localStorage.setItem("secretWord", word);
              setSecretWord(word.toLowerCase());
            });

            socket.on("connectToPlayers", (data) => {
              // setShowContact(true);
              handleShowContact(data.askedUserId, data.clickedUserId);
              if (data.askedUserId === userId) {
                setShowAskedUser(true);
              }

              if (data.clickedUserId === userId) {
                setShowClickedUser(true);
              }

              if (data.moderatorId === userId) {
                setShowClickedModerator(true);
              }

              if (
                data.askedUserId !== userId &&
                data.clickedUserId !== userId &&
                data.moderatorId !== userId
              ) {
                setShowOtherUsers(true);
              }
            });

            socket.on("noConnectionData", (data) => {
              // setShowNoContact(true);
              handleShowNoContact(data.askedUserId); // хз как исправить()()()

              if (data.askedUserId === userId) {
                setShowAskedUserSecond(true);
              }
              if (data.moderatorId === userId) {
                setShowClickedModeratorSecond(true);
              }
              if (data.moderatorId !== userId && data.askedUserId !== userId) {
                setShowOtherUsersSecond(true);
              }
            });

            socket.on("connectToPlayersAI", async (data) => {
              showAIconnectRef.current = true;
              setShowAIconnect(true);
              // имбуличка 3
              try {
                setShowContact(true);
                console.log(
                  `connectToPlayersAI - ${data.askedUserId}; ${data.clickedUserId}; showContact: ${showContact}`
                );
                handleShowContact(data.askedUserId, data.clickedUserId);

                if (data.askedUserId === userId) {
                  setShowAskedUser(true);
                }

                if (data.clickedUserId === userId) {
                  setShowClickedUser(true);
                }

                if (
                  data.askedUserId !== userId &&
                  data.clickedUserId !== userId
                ) {
                  setShowOtherUsers(true);
                }
                console.log(
                  `setted roomID - ${roomId}, dataRoomId - ${data.roomId}; secretWord - ${data.secretWord}; countLetter - ${data.countLetter}; contentAskedUser: ${data.contentAskedUser}`
                );

                const aiResponse = await axios.post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/openAI/sendConnectMessage/${data.roomId}`,
                  {
                    secretWord: data.secretWord,
                    countLetter: data.countLetter,
                    contentAskedUser: data.contentAskedUser,
                    language: languageRef.current,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                const aiResponseWord = aiResponse.data.aiResponse
                  .split(";")[1]
                  .trim();

                console.log(`ПРОВЕРКА СЕКРЕТНОГО СЛОВА - ${secretWord}`);

                socket.emit("sendModeratorWordGame", {
                  word: aiResponseWord,
                  roomName: roomName,
                  userName: "AI",
                  userPhoto: aiPhoto,
                  secretWord: data.secretWord,
                });
              } catch (error) {
                console.error("Error handling connectToPlayersAI:", error);
              }
            });

            socket.on("receiveConnectionAITrue", (data) => {
              console.log(`ДА! ПРИШЛО ОПОВЕЩЕНИЕ О ПРИБЫТИИ КЛИКА`);
              showAIconnectRef.current = true;
              setShowAIconnect(true);
            });

            socket.on("AI_action", (aiResponse: any, askedUserId: any) => {
              setTimeout(() => {
                console.log(
                  `ПРОВЕРКА ${showContact}; showAIconnectRef - ${showAIconnectRef.current}, ${activeModal} - ACTIVE MODAL`
                );
                if (
                  !showContact && // не получается имбуличка
                  activeModal === null &&
                  !showAIconnectRef.current
                  // || (!showAIconnect && activeModal === null && !showContact)
                ) {
                  setTimeout(() => {
                    setShowNoContact(true);
                    setActiveModal("ModalConnectModeratorCase");

                    setTimeout(() => {
                      setShowNoContact(false);
                    }, 2000);

                    if (askedUserId === userId) {
                      setShowAskedUserSecond(true);
                    } else {
                      setShowOtherUsersSecond(true);
                    }

                    const extractedWord = aiResponse.split(";")[1]?.trim();

                    if (socketRef.current) {
                      socketRef.current.emit("sendModeratorWordGameSecond", {
                        word: extractedWord,
                        roomName: roomName,
                        userName: "AI",
                        userPhoto: aiPhoto,
                        secretWord: secretWord,
                      });
                    }

                    console.log(`AI moderator lis: ${moderatorMessages}`);
                    console.log(`AI MESSAGE FROM FRONT 80%>: ${aiResponse}`);
                    console.log(
                      `${difficultyLevelState} - проверка на уровень сложности!!!! 1`
                    );
                  }, timerAIresponse(difficultyLevelRef.current)); //changed
                } else {
                  const extractedWord = aiResponse.split(";")[1]?.trim();
                  console.log(
                    `${extractedWord} - должно было разорвать контакт с этим словом`
                  );
                  console.log("showContact or activModal are not appropriate");
                  aiResponse = null;
                }
              }, 3000);
            });

            // socket.on("DeleteMessage", (targetMessage) => {
            //   //потом удалю
            //   console.log(`DELETE MESSAGE FROM FRONT: ${targetMessage}`);
            //   setMessages((prevMessages) =>
            //     prevMessages.filter(
            //       (message) => message.messageId !== targetMessage.messageId
            //     )
            //   );
            //   setModeratorMessages((prevModeratorMessages) =>
            //     prevModeratorMessages.filter(
            //       (message) => message.messageId !== targetMessage.messageId
            //     )
            //   );
            //   socket.emit("DeleteFromDB", targetMessage);
            // });

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
                data.askedWord.toLowerCase() ===
                  data.clickedWord.toLowerCase() &&
                data.askedWord.toLowerCase() ===
                  data.secretWord.toLowerCase() &&
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
                  localStorage.removeItem("secretWord");
                  localStorage.removeItem("moderatorId");
                }
              } else if (
                data.askedWord.toLowerCase() ===
                  data.moderatorWord.toLowerCase() &&
                data.askedWord.toLowerCase() === data.clickedWord.toLowerCase()
              ) {
                setCountLetter((prevCount) => prevCount);
                if (data.askedWord === "empty2280945") {
                  setStoredWords((prevWords) => [...prevWords]);
                } else {
                  setStoredWords((prevWords) => [
                    ...prevWords,
                    data.askedWord.toLowerCase(),
                  ]);
                }
                console.log(`STORED WORDS: ${storedWords}`);
              } else if (
                data.askedWord.toLowerCase() ===
                  data.clickedWord.toLowerCase() &&
                data.askedWord.toLowerCase() !==
                  data.moderatorWord.toLowerCase()
              ) {
                if (data.askedWord === "empty2280945") {
                  setStoredWords((prevWords) => [...prevWords]);
                } else {
                  setStoredWords((prevWords) => [
                    ...prevWords,
                    data.askedWord.toLowerCase(),
                  ]);
                }
                console.log(`STORED WORDS: ${storedWords}`);
                setCountLetter((prevCount) => prevCount + 1);
                console.log(`COUNT LETTER: ${countLetter} `);
              } else {
                setCountLetter((prevCount) => prevCount);
              }
              // setShowAIconnect(false); //имбуличка???
            });

            socket.on("allWordsSecond", (data) => {
              console.log(
                `checkAndEmitGameData CHECK: ${data.moderatorWord}; ${data.askedWord}`
              );
              setAllWordsSecond({
                moderatorWord: data.moderatorWord.toLowerCase(),
                askedWord: data.askedWord.toLowerCase(),
                moderatorUserName: data.moderatorUserName,
                moderatorUserPhoto: data.moderatorUserPhoto,
                secretWord: data.secretWord,
              });
              if (
                data.askedWord.toLowerCase() === data.secretWord.toLowerCase()
              ) {
                setIsGameWonByUsers(true); // переделал для Германа
              } else if (
                (data.askedWord.toLowerCase() !== data.secretWord.toLowerCase(),
                data.askedWord.toLowerCase() ===
                  data.moderatorWord.toLowerCase())
              ) {
                console.log(`АГА связи не будет`);
                setStoredWords((prevWords) => [
                  ...prevWords,
                  data.askedWord.toLowerCase(),
                ]);
                console.log(`STORED WORDS: ${storedWords}`);
              } else {
                console.log(`о нет хост не так подумал(`);
              }
            });

            socket.on("continueToAll", (roomName) => {
              console.log(`socket reload from front to front??`);
              localStorage.removeItem("secretWord");

              router.push(`/pages/settings/${roomName}`);
            });

            socket.on("exitToAll", (roomName) => {
              console.log(`socket exit from front to front??`);
              router.push(`/pages/settings/${roomName}`); // ????
            });

            // socket.on("userLeft", (data) => {
            //   console.log(`он вышел с комнаты(((())))`);
            //   fetchUserDetails(data).then((user) => {
            //     Toastify({
            //       text: `User ${user.username} left`,
            //       duration: 3000,
            //       close: true,
            //       position: "right",
            //     });
            //   });
            // });

            axios
              .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${roomId}`)
              .then((response) => {
                setMessages(response.data);
              });

            return () => {
              if (socketRef.current) {
                socketRef.current.off("newModerator");
                socketRef.current.off("setSecretWord");
                socketRef.current.off("newMessage");
                socketRef.current.off("connectToPlayers");
                socketRef.current.off("DeleteMessage");
                socketRef.current.off("allWords");
                socketRef.current.off("AI_action");
                socketRef.current.off("connectToPlayersAI");
                socketRef.current.off("allWordsSecond");
                socketRef.current.off("noConnectionData");
                socketRef.current.off("continueToAll");
                socketRef.current.off("exitToAll");
                socketRef.current.disconnect();
              }
            };
          }
        });
      });
    }
  }, [userId, roomId, roomName, moderatorId, secretWord]);

  useEffect(() => {
    if (allWords) {
      setShowAllWords(true);
      setCloseImmediately(true);
      //hm, maybe set UserState
    }
  }, [allWords]);

  useEffect(() => {
    if (allWordsSecond) {
      setShowAllWordsSecond(true);
      setCloseImmediatelySecond(true);
    }
  }, [allWordsSecond]);

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
        roomId: roomId,
        userPhoto: userPhoto,
        username: username,
        userId: userId,
        roomName: roomName,
      };
      socketRef.current.emit(
        "sendMessage",
        message,
        roomName,
        secretWord,
        countLetter
      );
    }

    form.reset();
  };

  const handleShowContact = (askedUserId: string, clickedUserId: string) => {
    console.log(`PROVERKA - ${activeModal}, ${hasShownConnectPopUp}`);
    if (activeModal === null && !hasShownConnectPopUp) {
      setActiveModal("ModalConnectPopUp");
      setShowContact(true);
      setHasShownConnectPopUp(true);
      setAskedUserIdState(askedUserId);
      setClickedUserIdState(clickedUserId);
    }
  };

  const handleShowNoContact = (askedUserId: string) => {
    console.log(`asked UserId - ${askedUserId}`);
    if (activeModal === null && !hasShownConnectModeratorCase) {
      setActiveModal("ModalConnectModeratorCase");
      setShowNoContact(true);
      setHasShownConnectModeratorCase(true);
      setAskedUserIdState(askedUserId);
    }
  };

  const onCloseModerator = (moderator: any) => {
    setShowModeratorModal(false);
    if (moderator.userId === userId) {
      setShowModeratorInput(true);
    }
  };

  const handleCloseContact = () => {
    setShowContact(false);
    setActiveModal(null);
    setClickedUserIdState("");
    setAskedUserIdState("");
    setTimeout(() => {
      setHasShownConnectPopUp(false);
    }, 500);
  };

  const handleCloseNoContact = () => {
    setShowNoContact(false);
    setActiveModal(null);
    setClickedUserIdState("");
    setAskedUserIdState("");
    setTimeout(() => {
      setHasShownConnectModeratorCase(false);
    }, 500);
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
      // console.log(`DIFFICULTY LEVEL FRONT - ${difficultyLevelRef.current}`); // ref
      if (difficultyLevelRef.current === "No AI") {
        if (isClicked === true && socketRef.current && userId === moderatorId) {
          socketRef.current.emit("noConnectStarts", {
            roomId: roomId,
            roomName: roomName,
            askedUserId: message.userId,
            moderatorId: moderatorId,
          });
        } else if (
          isClicked === true &&
          socketRef.current &&
          moderatorId &&
          userId !== moderatorId
        ) {
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
      } else {
        if (isClicked && socketRef.current) {
          //имбуличка
          showAIconnectRef.current = true;
          setShowAIconnect(true);
          socketRef.current.emit("ConnectAITrue", roomName);
          setActiveModal("ModalConnectPopUp");
          setShowContact(true);
          // setHasShownConnectPopUp(true);
          console.log(
            `ASKEDUSER AI - ${message.userId}, CLICKED USED AI - ${userId}; secretWord: ${secretWord}; countLetter: ${countLetter}; showContact - ${showContact}`
          );

          socketRef.current.emit("connectStartsAI", {
            roomId: roomId,
            roomName: roomName,
            askedUserId: message.userId,
            clickedUserId: userId,
            contentAskedUser: message.content,
            secretWord: secretWord,
            countLetter: countLetter,
            language: languageRef.current,
          });

          setTimeout(() => {
            setShowContact(false);
          }, 1000);
        } else {
          console.log("isClicked or websocket not available");
        }
      }
    }
  };

  const handleCloseModalAsked = () => {
    setShowAskedUser(false);
  };

  const handleCloseModalAskedSecondCase = () => {
    setShowAskedUserSecond(false);
  };

  const handleCloseModalAnswerModeratorSecond = (word: string) => {
    setShowClickedModeratorSecond(false);
    if (socketRef.current) {
      socketRef.current.emit("sendModeratorWordGameSecond", {
        word: word,
        roomName: roomName,
        userName: username,
        userPhoto: userPhoto,
        secretWord: secretWord,
      });
    }
  };

  const handleCloseModalAllWords = () => {
    setShowAllWords(false);
    setCloseImmediately(false);
    setIsUserConnected(false);
    setIsClicked(false);
    setTimeout(() => {
      // showAIconnectRef.current = false;
      setShowAIconnect(false); // Если нужно обновить состояние
    }, 3000); // проверка имбулички
  };

  const handleCloseModalAllWordsSecond = () => {
    setShowAllWordsSecond(false);
    setCloseImmediatelySecond(false);
  };

  const closeIsGameOver = () => {
    if (secretWord) {
      localStorage.removeItem("secretWord");
    }
    setIsGameWonByUsers(false);
  };

  const closeShowUsers = () => {
    setShowOtherUsers(false);
    setCloseImmediately(false);
  };

  const closeShowUsersSecond = () => {
    setShowOtherUsersSecond(false);
    setCloseImmediatelySecond(false);
  };

  const handleGameContinue = async () => {
    if (secretWord) {
      localStorage.removeItem("secretWord");
      //need to delete from all users secret Word !!!!
    }
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/set-moderator`,
      {
        roomId: roomId,
      }
    );
    setIsGameWonByUsers(false);
  };

  const handleSubmitWord = (word: string) => {
    if (socketRef.current) {
      const wordToSend = word.endsWith("didNotSend")
        ? "empty2280945"
        : word.toLowerCase();
      socketRef.current.emit("sendTargetWord", {
        word: wordToSend,
        roomName: roomName,
        userName: username,
        userPhoto: userPhoto,
      });
    }
  };

  const handleSubmitWordSecondCase = (word: string) => {
    if (socketRef.current) {
      const wordToSendSecond = word.endsWith("didNotSend")
        ? "empty2280945"
        : word.toLowerCase();

      socketRef.current.emit("sendTargetWordSecondCase", {
        word: wordToSendSecond,
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

  return (
    <div className="px-5 md:px-20 md:py-0">
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
      {activeModal === "ModalConnectPopUp" && showContact && (
        <ModalConnectPopUp
          onClose={handleCloseContact}
          askedUserId={askedUserIdState}
          clickedUserId={clickedUserIdState}
        />
      )}
      {activeModal === "ModalConnectModeratorCase" && showNoContact && (
        <ModalConnectModeratorCase
          onClose={handleCloseNoContact}
          askedUserId={askedUserIdState}
          clickedUserId={moderatorId}
        />
      )}
      {showAskedUser && showContact === false && secretWord && (
        <ModalConnectAsked
          onClose={handleCloseModalAsked}
          onSubmit={handleSubmitWord}
          revealedLetters={secretWord.slice(0, countLetter)}
          revealedWords={storedWords}
          difficultyLevel={difficultyLevelState}
        />
      )}
      {showClickedUser && showContact === false && secretWord && (
        <ModalConnectAnswer
          onClose={handleCloseModalAnswerUser}
          revealedLetters={secretWord.slice(0, countLetter)}
          revealedWords={storedWords}
          difficultyLevel={difficultyLevelState}
        />
      )}
      {showClickedModerator && showContact === false && secretWord && (
        <ModalConnectAnswer
          onClose={handleCloseModalAnswerModerator}
          revealedLetters={secretWord.slice(0, countLetter)}
          revealedWords={storedWords}
          difficultyLevel={difficultyLevelState}
        />
      )}
      {showAskedUserSecond && showNoContact === false && secretWord && (
        <ModalConnectAsked
          onClose={handleCloseModalAskedSecondCase}
          onSubmit={handleSubmitWordSecondCase}
          revealedLetters={secretWord.slice(0, countLetter)}
          revealedWords={storedWords}
          difficultyLevel={difficultyLevelState}
        />
      )}
      {showClickedModeratorSecond && showNoContact === false && secretWord && (
        <ModalConnectAnswer
          onClose={handleCloseModalAnswerModeratorSecond}
          revealedLetters={secretWord.slice(0, countLetter)}
          revealedWords={storedWords}
          difficultyLevel={difficultyLevelState}
        />
      )}
      {showOtherUsers && showContact === false && (
        <ModalConnectOthers
          onClose={closeShowUsers}
          closeImmediately={closeImmediately}
        /> // closeShowUsers
      )}
      {showOtherUsersSecond && showNoContact === false && (
        <ModalConnectOthers
          onClose={closeShowUsersSecond}
          closeImmediately={closeImmediatelySecond}
        /> // closeShowUsersSecond
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
      {showAllWordsSecond && allWordsSecond && (
        <ModalResultsSecond
          moderatorUsername={allWordsSecond.moderatorUserName}
          moderatorUserPhoto={allWordsSecond.moderatorUserPhoto}
          moderatorWord={allWordsSecond.moderatorWord}
          targetWord={allWordsSecond.askedWord}
          onClose={handleCloseModalAllWordsSecond}
        />
      )}
      {isGameWonByUsers && roomName && (
        <ModalConnectGameOver
          onClose={closeIsGameOver}
          onContinue={handleGameContinue}
          roomName={roomName}
          roomId={roomId}
          isHost={userId === hostId}
          socket={socketRef.current}
        />
      )}
      <div className="h-[94vh] flex flex-col justify-between">
        <div>
          <div className="flex justify-center mt-6">
            <div className="flex bg-[#CC0B0D] w-80 md:w-[600px] px-6 py-4 items-center justify-center rounded-xl">
              <p className="text-[#fff] font-bold text-center text-5xl break-all tracking-[.25em] capitalize max-w-[10ch]">
                {!secretWord ? (
                  <span className="text-sm tracking-[.2em] opacity-50 block">
                    {translations.secretWord}
                  </span>
                ) : (
                  secretWord && secretWord.slice(0, countLetter)
                )}
              </p>
            </div>
            <button
              onClick={toggleAudio}
              className="focus:outline-none md:w-16 w-10"
            >
              <img src={isPlaying ? "/photos/audio.png" : "/photos/mute.png"} />
            </button>
          </div>

          <div className="flex justify-between items-center mt-12 relative">
            <p className="absolute text-xl text-black font-bold -top-4 left-4">
              {translations.Host}
            </p>
            <div className="w-[50%] h-auto max-h-[90px] bg-[#E2D5D0] rounded-[21px] overflow-y-auto hide-scrollbar">
              {moderatorMessages.map((message, index) => (
                <p
                  className="text-red-500 text-xl px-8 py-4 font-bold"
                  key={index}
                >
                  {message.content}
                </p>
              ))}
            </div>
            <div className="w-[120px] h-[120px] rounded-full bg-red-700">
              {difficultyLevelState === "No AI" ? (
                moderator && (
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={moderator.userPhoto}
                    alt="Moderator"
                  />
                )
              ) : (
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={aiPhoto}
                  alt="AI"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-[24px] mt-14 w-full h-full max-h-[40vh] bg-[#D4C0B8] rounded-xl overflow-y-auto py-5 px-5 md:px-8 hide-scrollbar">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-[20vh] text-[#F24236] font-black text-2xl text-center opacity-50 bg-[#EAE5E3] rounded-lg px-6 py-4">
                {translations.placeholderUser}
              </div>
            ) : (
              messages.map((message) => (
                <SingleMessageComponent
                  key={message.messageId}
                  message={message}
                  onClick={handleClickMessage}
                />
              ))
            )}
          </div>
        </div>
        <div className="w-full mb-6">
          <form
            onSubmit={onSubmitMessage}
            className="w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg md:max-w-full">
              <input
                type="text"
                name="message"
                id="message"
                maxLength={70} // good ne good xz
                placeholder="Send Message..."
                className="text-gray-700 w-full h-12 md:h-16 rounded-xl pl-5 pr-10 py-2 border focus:border-gray-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#EB3A53] text-2xl"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
