import { Router } from "express";
import openAIController from "./openAI-controller";
import openAIService from "./openAI-service";

const router = Router();

router.post("/sendMessageToAI/:roomId", openAIController.handleAIRequest);
router.post(
  "/sendConnectMessage/:roomId",
  openAIController.handleAIRequestConnect
);
router.post("/sendSecretWord/:roomId", openAIController.setSecretWord);

export default router;
