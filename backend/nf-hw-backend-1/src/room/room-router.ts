import { Router } from "express";
import RoomController from "./room-controller";

const router = Router();

router.post("/create", RoomController.createRoom);
router.get("/:roomId", RoomController.getRoom);
router.post("/join/:roomName", RoomController.joinRoom);
router.post("/leave/:roomName", RoomController.leaveRoom);

export default router;
