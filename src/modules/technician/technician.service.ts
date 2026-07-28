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

const updateAvailability = async (userId: string, payload: IAvailability) => {


    // clean up befor today's availabiity
    // ----------------------------------------------------------
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.availability.deleteMany({
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

    const duplicateSlots = payloadSlot.filter(slot => dbSlot.includes(slot));

    if (duplicateSlots.length > 0) {
        throw new Error(`These slots are already booked: ${duplicateSlots.join(", ")}`);
    }

    const updatedSlots = [...dbSlot, ...payloadSlot];



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

const getTechnicianProfileWithReview = async (technicianId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            id: technicianId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    city: true,
                    profileImage: true,
                },
            },

            service: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },

            booking: {
                where: {
                    review: {
                        isNot: null,
                    },
                },
                include: {
                    review: true,

                    customer: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                        },
                    },
                },
            },
        },
    });

    return {
        ...technician,

        reviews: technician.booking
            .filter((booking) => booking.review)
            .map((booking) => ({
                id: booking.review!.id,
                rating: booking.review!.rating,
                comment: booking.review!.comment,

                customer: booking.customer,
            })),

        booking: undefined,
    };
};

export const technicianService = {
    getAllTechnician,
    getTechnicianProfile,
    updateTechnicianProfile,
    updateAvailability,
    getTechnicianProfileWithReview
}