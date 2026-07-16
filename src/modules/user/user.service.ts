import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import { RegisterUserPayload, UpdateStatusPayload } from "./user.interface";


const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, profileImage, phone, address, city, role } = payload;
    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })
    if (isUserExist) {
        throw new Error("User with this email already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_round));

    // user create and profile create (only if the user is technician)
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

    return user;
}

// admin only
const getAllUserFromDB = async () => {
    const [totalUsers, users] = await Promise.all([
        prisma.user.count(),
        prisma.user.findMany({
            omit: { password: true }
        }),
    ]);

    return {
        totalUsers,
        users,
    };
};

// admin only
const updateUserStatusInDB = async (userId: string, payload: UpdateStatusPayload) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: payload,
        omit: { password: true }
    })

    return user;
}

export const userService = {
    registerUserIntoDB,
    getAllUserFromDB,
    updateUserStatusInDB
}