import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"
import { payloadUpdateProfile, TechnicianQuery } from "./technician.interface"

const getAllTechnician = async (query: TechnicianQuery) => {

    const andCondition: TechnicianProfileWhereInput[] = [];

    if (query.isAvailable) {
        andCondition.push({ isAvailable: Boolean(query.isAvailable) })
    }
    if (query.verified) {
        andCondition.push({ verified: Boolean(query.verified) })
    }
    if (query.experience) {
        andCondition.push({
            experience: {
                gte: Number(query.experience),
            },
        });
    }
    if (query.averageRating) {
        andCondition.push({
            averageRating: {
                gte: Number(query.averageRating),
            },
        });
    }


    const technicians = await prisma.technicianProfile.findMany({
        where: { AND: andCondition }
    });
    const totalCount = await prisma.technicianProfile.count({
        where: { AND: andCondition }
    })
    return {
        total: totalCount,
        data: technicians
    }
}

const getTechnicianProfile = async (userId: string) => {
    return await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    })
}

const updateTechnicianProfile = async (userId: string, payload: payloadUpdateProfile) => {
    return await prisma.technicianProfile.update({
        where: { userId },
        data: payload
    })
}

export const technicianService = {
    getAllTechnician,
    getTechnicianProfile,
    updateTechnicianProfile
}