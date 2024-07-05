import { Router } from "express";
import GameController from "./game-controller";

const router = Router();

router.post("/roomId", GameController.setModerator);
router.post("/create", GameController.createGame);
router.post("/update", GameController.updateGame);

export default router;
