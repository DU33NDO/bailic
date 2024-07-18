import { Request, Response } from "express";
import OpenAIservice from "./openAI-service";

class openAIController {
  handleAIRequest = async (req: Request, res: Response) => {
    const { message, secretWord, countLetter } = req.body;
    const { roomId } = req.params;

    try {
      const aiResponse = await OpenAIservice.getAIResponse(
        roomId,
        secretWord,
        countLetter
      );
      res.json({ aiResponse });
    } catch (error) {
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  };

  handleAIRequestConnect = async (req: Request, res: Response) => {
    const { secretWord, countLetter, contentAskedUser } = req.body;
    const { roomId } = req.params;

    try {
      const aiResponse = await OpenAIservice.getAIResponseOnMessage(
        roomId,
        secretWord,
        countLetter,
        contentAskedUser
      );
      res.json({ aiResponse });
    } catch (error) {
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  };

  setSecretWord = async (req: Request, res: Response) => {
    const { areaOfVocab } = req.body;
    const { roomName } = req.params;

    try {
      const aiSecretWord = await OpenAIservice.createAISecretWord(areaOfVocab);
      res.json({ aiSecretWord });
    } catch (error) {
      res.status(500).json({ error: "Failed to get secret word from AI" });
    }
  };
}

export default new openAIController();
