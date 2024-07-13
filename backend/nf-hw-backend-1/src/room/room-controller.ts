import { Request, Response } from "express";
import RoomService from "./room-service";
import { io } from "../index"; 

class RoomController {
  async joinRoom(req: Request, res: Response): Promise<void> {
    const { roomName } = req.params;
    const { userId } = req.body;

    try {
      const room: any = await RoomService.joinRoom(roomName, userId);
      if (room) {
        const roomId = room._id.toString(); 
        const users = room.users as unknown as string[]; 
        // io.to(roomName).emit("topUsersUpdated", users); 
        res.json(room);
      } else {
        res.status(404).send("Room not found");
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async leaveRoom(req: Request, res: Response): Promise<void> {
    const { roomName } = req.params;
    const { userId } = req.body;

    try {
      const room: any = await RoomService.leaveRoom(roomName, userId);
      if (room) {
        const roomId = room._id.toString();
        const users = room.users as unknown as string[]; 
        // io.to(roomName).emit("topUsersUpdated", users); 
        res.json(room);
      } else {
        res.status(404).send("Room not found");
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async createRoom(req: Request, res: Response): Promise<void> {
    const { roomName } = req.body;

    try {
      const room = await RoomService.createRoom(roomName);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getRoom(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;

    console.log(`Request received for roomId: ${roomId}`);

    try {
      const room = await RoomService.getRoom(roomId);

      console.log(`Room retrieved: ${room}`);

      if (room) {
        res.json(room);
      } else {
        res.status(404).send("Room not found");
      }
    } catch (error: any) {
      console.error(`Error retrieving room: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new RoomController();
