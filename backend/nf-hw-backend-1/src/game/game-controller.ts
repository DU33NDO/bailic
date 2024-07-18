import { Request, Response } from "express";
import GameService from "./game-service";
import { IGame } from "../models/Game";

class GameController {
  async setModerator(req: Request, res: Response): Promise<any> {
    try {
      const { roomId } = req.body;
      if (!roomId) {
        return res.status(400).json({ message: "Room ID is required" });
      }

      const moderator = await GameService.createModerator(roomId);
      const moderatorId = moderator._id;
      console.log(`АЙДИ модератора - ${moderator}`);
      if (!moderator) {
        return res.status(404).json({ message: "No users found in the room" });
      }

      const updatedGame = await GameService.updateGame(roomId, { moderatorId });

      if (updatedGame) {
        console.log(`Moderator set: ${moderator.username}`);
        res.status(200).json(updatedGame);
      } else {
        res.status(404).json({ message: "Room not found" });
      }
    } catch (error) {
      console.error("Error setting moderator:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  async getModerator(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const game = await GameService.getGameByRoomId(roomId);

      if (game && game.moderatorId) {
        res.status(200).json(game.moderatorId);
      } else {
        res.status(404).json({ message: "Moderator not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async createGame(req: Request, res: Response): Promise<void> {
    try {
      const { difficultyLevel, areaOfVocab, roomId } = req.body;
      const game = await GameService.createGame(
        difficultyLevel,
        areaOfVocab,
        roomId
      );

      if (game) {
        console.log(`Game created for room: ${roomId}`);
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

  async getGame(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const game = await GameService.getGameByRoomId(roomId);
      if (game) {
        res.status(200).json(game);
      } else {
        res.status(404).json({ message: "Game was not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new GameController();
