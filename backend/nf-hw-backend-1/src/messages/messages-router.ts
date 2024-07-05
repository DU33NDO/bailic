import express from "express";
import Message from "../models/Message";

const router = express.Router();

router.get("/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
