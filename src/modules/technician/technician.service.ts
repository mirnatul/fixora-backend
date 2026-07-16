import { prisma } from "../../lib/prisma"
import { payloadUpdateProfile } from "./technician.interface"

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
    getTechnicianProfile,
    updateTechnicianProfile
}