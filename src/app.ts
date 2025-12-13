import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// All Route imports
import authRoutes from "./routes/auth.routes";

export const app = express();

// middleware for express json limit
app.use(express.json({ limit: "16kb" }));

// middleware for cors origin
app.use(
  cors({
    origin: Bun.env.CORS_ORIGIN,
    credentials: true,
  })
);

// middleware for Url Encoding - example - this change the link in the browser like akhil+nagpal or akhil%20nagpal
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// middleware for cookie-parser
app.use(cookieParser());

// All Routes implemented
app.use("/api/v1/auth", authRoutes);
