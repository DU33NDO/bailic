import mongoose, { Document, Schema } from "mongoose";

interface IRoom extends Document {
  roomName: string;
  users: string[]; // Array of user IDs
  // createdAt: { type: Date; default: Date.now; expires: 86400 };
}

const RoomSchema: Schema = new Schema({
  roomName: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Room = mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
export { IRoom };
