import Room from "../models/Room";
import Game, { IGame } from "../models/Game";

class GameService {
  async createModerator(roomId: string): Promise<any> {
    const currentRoom: any = await Room.findById(roomId).populate("users");
    if (currentRoom) {
      const allUsers = currentRoom.users;
      const randomNum = Math.floor(Math.random() * allUsers.length);
      console.log(`MODERATOR!!!! - ${allUsers[randomNum]}`);
      return allUsers[randomNum];
    } else {
      return null;
    }
  }

  async createGame(
    difficultyLevel: string,
    areaOfVocab: string,
    roomId: string
  ): Promise<IGame> {
    const existingRoom = await Game.findOne({ roomId });
    if (existingRoom) {
      return existingRoom;
    }
    const game = new Game({
      difficultyLevel,
      areaOfVocab,
      roomId,
    });
    return await game.save();
  }

  async getGameByRoomId(roomId: string): Promise<IGame | null> {
    const targetRoom = await Game.findOne({ roomId });
    if (targetRoom) {
      return targetRoom;
    } else {
      return null;
    }
  }

  async updateGame(
    roomId: string,
    updates: Partial<IGame>
  ): Promise<IGame | null> {
    const updatedGame = await Game.findOneAndUpdate(
      { roomId },
      { $set: updates },
      { new: true }
    );
    return updatedGame;
  }
}

export default new GameService();
