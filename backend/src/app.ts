import { config } from "dotenv";
import express from "express";
import morgan from "morgan"
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
config();
const app= express();

//middlewares
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// used only under development mode
app.use(morgan("dev"));

app.use('/api/v1', appRouter)

export default app;
