import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import connectDB from "./db";
import { logger } from "./logger";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import Message from "./models/Message";
import User from "./models/User";
import messagesRouter from "../src/messages/messages-router";
import authRouter from "./users/auth-router";
import roomRouter from "./room/room-router";
import gameRouter from "./game/game-router";
import "./types/express-session";
import RoomService from "./room/room-service";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

connectDB();

app.use(logger);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "mySecterkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  console.log("LETS GOOOOOOOOO");
});

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/messages", messagesRouter);
app.use("/rooms", roomRouter);
app.use("/game", gameRouter);

const userRooms = new Map<string, { room: string; userId: string }>();

let gameData = {
  moderatorWord: null,
  askedWord: null,
  clickedWord: null,
  moderatorUserName: null,
  moderatorUserPhoto: null,
  clickedUserName: null,
  clickedUserPhoto: null,
  secretWord: null,
};

io.on("connection", (socket) => {
  console.log(`user connected with socket id ${socket.id}`);

  socket.on("join-room", async (roomName, userId, username) => {
    console.log(`User with ID ${userId} (${username}) joined room ${roomName}`);
    try {
      const room = await RoomService.joinRoom(roomName, userId);
      if (!room) {
        console.error("Error: Room not found or could not be created");
        return;
      }
      socket.join(roomName);
      io.to(roomName).emit("userJoined", {
        userId: userId,
        userName: username,
      });

      socket.emit("getRoomId", room._id);
      console.log(`roomd._id: ${room._id}`);
      const roomId: any = room._id;

      userRooms.set(socket.id, { room: roomId, userId: userId });
      const users = io.sockets.adapter.rooms.get(roomId);
      console.log(users);
      if (users) {
        io.to(roomId).emit("NumberOfUsers", { len: users.size });
      }
    } catch (error: any) {
      console.error("Error joining room:", error.message);
    }
  });

  socket.on("sendMessage", async (message, roomName) => {
    const userRoom = userRooms.get(socket.id);
    if (!userRoom) {
      console.error("Error: Room or username not found for the socket");
      return;
    }
    const { room, userId } = userRoom;

    try {
      const newMessage = new Message({
        roomId: room,
        userId: message.userId,
        username: message.username,
        userPhoto: message.userPhoto,
        content: message.text,
        timestamp: new Date(),
      });
      await newMessage.save();
      console.log("Message saved to the database");
      console.log(`MessageId - ${newMessage._id}`);

      io.to(roomName).emit("newMessage", {
        userId: message.userId,
        username: message.username,
        userPhoto: message.userPhoto,
        content: message.text,
        timestamp: newMessage.timestamp,
        messageId: newMessage._id,
      });
    } catch (err) {
      console.error("Error saving message to the database!!!!", err);
    }
  });

  socket.on("play-game", (roomName, url) => {
    console.log(`Starting game in room ${roomName}; url: ${url}`);
    io.to(roomName).emit("start-game", url);
  });

  socket.on("secretWord", (data) => {
    console.log(
      `SECRET WORD - ${data.word}, ROOM ID - ${data.roomId}, ROOM NAME - ${data.roomName}`
    );
    io.to(data.roomName).emit("setSecretWord", data.word);
  });

  socket.on("ExpiredMessage", (message, roomName) => {
    console.log("ExpiredMessage received:", message);
    socket.emit("DeleteMessage", message); // not working with io.to(roomName) need to update this line
  });

  socket.on("DeleteFromDB", async (message) => {
    try {
      await Message.deleteOne({ _id: message.messageId });
      console.log(`Message with ID ${message.messageId} deleted from DB`);
    } catch (error) {
      console.error(`Failed to delete message from DB: ${error}`);
    }
  });

  socket.on("connectStarts", (data) => {
    console.log("Connect starts received:", data);
    io.to(data.roomName).emit("connectToPlayers", {
      messageToAsked: "PRIVATE TO ASKED USER тот на кого нажали",
      messageToCkick: "PRIVATE TO CLICKED USER тот кто нажал",
      messageToModerator: "PRIVATE TO MODERATOR",
      askedUserId: data.askedUserId,
      clickedUserId: data.clickedUserId,
    });
  });

  socket.on("sendTargetWord", (data) => {
    console.log("Received target word:", data.word);
    gameData.askedWord = data.word;
    checkAndEmitGameData(io, socket, data.roomName);
  });

  socket.on("sendModeratorWordGame", (data) => {
    console.log("Received moderator word:", data.word);
    gameData.moderatorWord = data.word;
    gameData.moderatorUserName = data.userName;
    gameData.moderatorUserPhoto = data.userPhoto;
    gameData.secretWord = data.secretWord;
    checkAndEmitGameData(io, socket, data.roomName);
  });

  socket.on("sendClickedUserWord", (data) => {
    console.log("Received clicked user word:", data.word);
    gameData.clickedWord = data.word;
    gameData.clickedUserName = data.userName;
    gameData.clickedUserPhoto = data.userPhoto;
    checkAndEmitGameData(io, socket, data.roomName);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const userRoom = userRooms.get(socket.id);
    if (userRoom) {
      const { room, userId } = userRoom;
      socket.to(room).emit("userLeft", userId);
      userRooms.delete(socket.id);
    }
  });
});

const checkAndEmitGameData = (io, socket, roomName) => {
  console.log(
    `checkAndEmitGameData CHECK: ${gameData.moderatorWord}; ${gameData.askedWord}, ${gameData.clickedWord}`
  );
  if (
    gameData.moderatorWord &&
    gameData.askedWord &&
    gameData.clickedWord &&
    gameData.moderatorUserName &&
    gameData.moderatorUserPhoto &&
    gameData.clickedUserName &&
    gameData.clickedUserPhoto
  ) {
    io.to(roomName).emit("allWords", gameData);
    gameData = {
      moderatorWord: null,
      askedWord: null,
      clickedWord: null,
      moderatorUserName: null,
      moderatorUserPhoto: null,
      clickedUserName: null,
      clickedUserPhoto: null,
      secretWord: null,
    };
  }
};

server.listen(3005, () => {
  console.log("server running at http://localhost:3005");
});
export { io };
