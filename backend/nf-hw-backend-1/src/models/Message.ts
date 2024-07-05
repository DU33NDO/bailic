import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  roomId: string;
  userId: string;
  username: string;
  userPhoto: string;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema<IMessage>({
  roomId: { type: String, ref: "Room", required: true },
  userId: { type: String, ref: "User", required: true },
  username: { type: String, ref: "User", required: true },
  userPhoto: { type: String, ref: "User" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
