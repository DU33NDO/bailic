import { Router } from "express";
import GameController from "./game-controller";

const router = Router();

router.post("/set-moderator", GameController.setModerator);
router.get("/get-moderator/:roomId", GameController.getModerator);
router.post("/create", GameController.createGame);
router.post("/update", GameController.updateGame);

export default router;
