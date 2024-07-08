import { Request, Response } from "express";
import GameService from "./game-service";
import { IGame } from "../models/Game";

class GameController {
  async setModerator(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.body;
      const { roomName } = req.body;
      const moderator = await GameService.getModerator(roomId);

      if (moderator) {
        console.log(`SEND A MODERATOR: ${moderator}`);
        res.status(200).json(moderator);
      } else {
        res.status(404).json({ message: "Room not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async createGame(req: Request, res: Response): Promise<void> {
    try {
      const { difficultyLevel, areaOfVocab, roomId, roomName } = req.body;
      const game = await GameService.createGame(
        difficultyLevel,
        areaOfVocab,
        roomId
      );
      if (game) {
        console.log(`ROOMNAME: ${roomName}`);
        res.status(200).json(game);
      } else {
        res.status(404).json("Error while creating a game");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateGame(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, secretWord, clickedMessage } = req.body;

      if (!roomId) {
        res.status(400).json({ message: "Room ID is required" });
        return;
      }

      const game = await GameService.getGameByRoomId(roomId);
      if (!game) {
        res.status(404).json({ message: "Game not found" });
        return;
      }

      const updates: Partial<IGame> = {};
      if (secretWord) updates.secretWord = secretWord;
      if (clickedMessage) updates.clickedMessage = clickedMessage;

      const updatedGame = await GameService.updateGame(roomId, updates);
      res.status(200).json(updatedGame);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

export default new GameController();
