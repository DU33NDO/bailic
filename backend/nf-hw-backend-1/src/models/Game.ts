import mongoose, { Schema, Document } from "mongoose";

interface IGame extends Document {
  difficultyLevel: string;
  areaOfVocab: string | null;
  roomId: string;
  moderatorId: string | null; // user id
  secretWord: string | null;
  clickedMessage: string | null; // message id
  participants: string[]; // id user and moderator
  AskingId: string | null; // id user
}

const GameSchema: Schema = new Schema({
  difficultyLevel: { type: String, required: true },
  areaOfVocab: { type: String },
  roomId: { type: String },
  moderatorId: { type: String },
  secretWord: { type: String },
  clickedMessage: { type: String, default: null },
  participants: { type: [String], default: [] },
  AskingId: { type: String, default: null },
});

GameSchema.pre<IGame>("save", function (next) {
  const game = this as IGame;

  if (game.clickedMessage !== null) {
    if (game.participants.length === 0 || !game.AskingId) {
      const error = new Error(
        "Participants and AskingId must be set if clickedMessage is not null"
      );
      return next(error);
    }
  }

  next();
});

const Game = mongoose.model<IGame>("Game", GameSchema);

export default Game;
export { IGame };
