import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
