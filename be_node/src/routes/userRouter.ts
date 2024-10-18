import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
// import "./custom.d.ts";
dotenv.config();
const router = express.Router();

// Middleware to authenticate tokens
function authenticateToken(req: any, res: Response, next: NextFunction): void {
  const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(401);
    req.user = user as string | JwtPayload;
    next();
  });
}

// Protected resource endpoint
router.get("/", authenticateToken, (req: Request, res: Response) => {
  const user = (req as any)?.user;
  res.json({ message: "This is a protected resource!", user });
});

export default router;
