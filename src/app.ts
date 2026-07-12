import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import HttpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/enums";

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
app.post("/api/users/register", async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, profileImage, phone, address, city, role } = req.body;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })
    if (isUserExist) {
        throw new Error("User with this email already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_round));

    const createdUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, profileImage, phone, address, city, role }
    })
    if (role === Role.TECHNICIAN) {
        await prisma.technicianProfile.create({
            data: { userId: createdUser.id }
        })
    }

    const user = await prisma.user.findUnique({
        where: { id: createdUser.id },
        omit: { password: true }
    })


    res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "User registered successfully",
        data: { user }
    })
})


export default app;