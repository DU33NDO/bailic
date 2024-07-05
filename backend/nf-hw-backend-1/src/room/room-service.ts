import mongoose from "mongoose";
import Room, { IRoom } from "../models/Room";

class RoomService {
  async createRoom(roomName: string): Promise<IRoom> {
    const existingRoom = await Room.findOne({ roomName });
    if (existingRoom) {
      return existingRoom;
    }
    const room = new Room({ roomName, users: [] });
    return await room.save();
  }

  async joinRoom(roomName: string, userId: string): Promise<IRoom | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }
    const room = await Room.findOneAndUpdate(
      { roomName },
      { $addToSet: { users: userId } },
      { new: true, upsert: true }
    ).populate("users");
    return room;
  }

  async leaveRoom(roomName: string, userId: string): Promise<IRoom | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }
    const room = await Room.findOneAndUpdate(
      { roomName },
      { $pull: { users: userId } },
      { new: true }
    ).populate("users");
    return room;
  }

  async getRoom(roomId: string): Promise<IRoom | null> {
    const room = await Room.findById(roomId).populate("users");
    return room;
  }

  // async updateTopUsers(
  //   roomId: string,
  //   usersInRoom: string[]
  // ): Promise<IRoom | null> {
  //   return await Room.findByIdAndUpdate(
  //     roomId,
  //     { usersInRoom },
  //     { new: true }
  //   ).populate("users");
  // }
}

export default new RoomService();
