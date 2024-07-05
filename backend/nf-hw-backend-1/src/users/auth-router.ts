import { Router } from "express";
import AuthController from "./auth-controller";

const router = Router();

router.post("/login", AuthController.login);
router.get('/username/:userId', AuthController.getUsername);
router.get('/user/:userId', AuthController.getUser);

export default router;
