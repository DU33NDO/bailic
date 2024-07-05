import { Router } from "express";
import authRouter from "./users/auth-router";

const globalRouter = Router();

globalRouter.use(authRouter);

export default globalRouter;
