import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err)
        return res.status(401).json({ error: "Invalid or expired token" });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ error: "Authentication required" });
  }
}
