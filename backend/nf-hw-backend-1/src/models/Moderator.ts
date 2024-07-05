import mongoose, { Schema, Document } from "mongoose";

interface IModerator extends Document {
  username: string;
  userPhoto: string;
  secretWord: string;
}

const ModeratorScheme: Schema = new Schema({
  username: { type: String, required: true },
  userPhoto: { typea: String },
  secretWord: { type: String, required: true },
});

export default mongoose.model<IModerator>("Moderator", ModeratorScheme);
export { IModerator };
