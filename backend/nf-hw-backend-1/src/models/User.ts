import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  userPhoto: string;
}
const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  userPhoto: { type: String },
});

export default mongoose.model<IUser>("User", UserSchema);
