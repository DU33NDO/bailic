import { Request, Response } from "express";
import AuthService from "./auth-service";
import User from "../models/User";

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { username, userPhoto } = req.body;
    console.log(
      `Received login request with username: ${username} and userPhoto: ${userPhoto}`
    );

    if (!username) {
      res.status(400).json({ error: "username is required" });
      return;
    }

    if (username) {
      let user = await AuthService.getUserByUsername(username);
      console.log(user);
      if (!user) {
        user = await AuthService.createUser(username, userPhoto);
        console.log(`New User created with ID: ${user._id}`);
      } else {
        console.log(
          `User already exists: ${user.username} with photo: ${user.userPhoto}`
        );
      }
      req.session.username = user.username;
      req.session.userPhoto = user.userPhoto;

      res.json({
        success: true,
        username: user.username,
        userPhoto: user.userPhoto,
        userId: user._id,
      });
    }
  }

  async getUsername(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    try {
      const username = await AuthService.getUsernameById(userId);
      if (username) {
        res.json({ success: true, username });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    try {
      const user = await User.findById(userId);
      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new AuthController();
