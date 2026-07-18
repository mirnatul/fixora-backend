import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"
import { IAvailability, payloadUpdateProfile, TechnicianQuery } from "./technician.interface"

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

// payload be like
// {
//     "date": "2026-07-21",
//     "slot": [1,2]
// }
const updateAvailability = async (userId: string, payload: IAvailability) => {


    // clean up befor today's availabiity
    // ----------------------------------------------------------
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await prisma.availability.deleteMany({
        where: {
            date: {
                lt: today,
            },
        },
    });
    // -----------------------------------------------------------



    const { id } = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    })

    // find the availability
    const availability = await prisma.availability.findFirst({
        where: {
            technicianId: id,
            date: new Date(payload.date)
        }
    })

    if (!availability) {
        return await prisma.availability.create({
            data: {
                technicianId: id,
                date: new Date(payload.date),
                bookedSlot: payload.slot,
            },
        });
    }

    const dbSlot = availability.bookedSlot;
    const payloadSlot = payload.slot;

    // Merge and remove duplicates
    const updatedSlots = [...new Set([...dbSlot, ...payloadSlot])];


    return await prisma.availability.update({
        where: {
            technicianId_date: {
                technicianId: id,
                date: new Date(payload.date),
            },
        },
        data: {
            bookedSlot: updatedSlots,
        },
    });
}

export const technicianService = {
    getAllTechnician,
    getTechnicianProfile,
    updateTechnicianProfile,
    updateAvailability
}