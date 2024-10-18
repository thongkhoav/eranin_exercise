import { PrismaClient } from "@prisma/client";
import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

const prisma = new PrismaClient();

// Secret keys for JWT
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

router.post("/register", async (req, res): Promise<void> => {
  try {
    const { email, password, fullname } = req.body;
    if (!email || !password || !fullname) {
      res
        .status(400)
        .json({ message: "Email, password, and fullname are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    // console.log(req.body);
    // console.log(existingUser);
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullname,
      },
    });
    const { password: _, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user" });
  }
});

// Login endpoint
router.post("/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user && (await bcrypt.compare(password, user?.password))) {
      const { password: _, ...userWithoutPassword } = user;
      // console.log(ACCESS_TOKEN_EXPIRES_IN);
      const accessToken = jwt.sign(userWithoutPassword, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      // console.log(accessToken);
      const refreshToken = jwt.sign(userWithoutPassword, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
      await prisma.loginSession.create({
        data: {
          user: {
            connect: {
              id: userWithoutPassword?.id,
            },
          },
          refreshToken,
        },
      });

      res.json({ accessToken, refreshToken });
      return;
    }

    res.status(400).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while logging in" });
  }
});

router.post("/logout", async (req, res): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  try {
    await prisma.loginSession.updateMany({
      where: {
        refreshToken,
      },
      data: {
        isLoggedOut: true,
      },
    });
    res.json({ message: "Logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while logging out" });
  }
});

// Refresh token endpoint
router.post("/refresh-token", async (req, res): Promise<void> => {
  const { refreshToken } = req.body;

  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    async (err: any, user: any): Promise<void> => {
      if (err) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
      }

      const loginSession = await prisma.loginSession.findFirst({
        where: {
          refreshToken,
          userId: user?.id,
          isLoggedOut: false,
        },
        include: {
          user: true,
        },
      });

      if (!loginSession) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
      }

      const { password: _, ...tokenUser } = loginSession.user;

      const accessToken = jwt.sign(tokenUser, ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
      });
      res.json({ accessToken });
    }
  );
});

export default router;