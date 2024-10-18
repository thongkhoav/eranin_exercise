import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
dotenv.config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// require("dotenv").config();
// const authRouter = require("./routes/authRouter");
// const userRouter = require("./routes/userRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
