import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import HttpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/enums";
import { userRoutes } from "./modules/user/user.route";

const app: Application = express();

// middleware

// for cookies credentials true (learn more)
app.use(cors({ origin: config.app_url, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello, Prisma!");
})

// register
app.use("/api/users", userRoutes);


export default app;