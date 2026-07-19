import { prisma } from "../../lib/prisma"
import { IBookingPayload } from "./booking.interface"

const createBooking = async (userId: string, payload: IBookingPayload) => {

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


    const service = await prisma.service.findUniqueOrThrow({
        where: { id: payload.serviceId }
    })

    let availability = await prisma.availability.findUnique({
        where: {
            technicianId_date: {
                technicianId: service.technicianId,
                date: new Date(payload.bookingDate)
            }
        }
    })

    // updated
    if (!availability) {
        availability = {
            bookedSlot: [],
        } as any;
    }

    const dbSlot = availability?.bookedSlot as number[];
    const duplicateSlots = payload.slot.filter(slot => dbSlot.includes(slot));
    if (duplicateSlots.length > 0) {
        throw new Error(`These slots are already booked: ${duplicateSlots.join(", ")}`);
    }
    const updatedSlots = [...dbSlot, ...payload.slot];


    if (availability?.id) {
        await prisma.availability.update({
            where: {
                technicianId_date: {
                    technicianId: service.technicianId,
                    date: new Date(payload.bookingDate),
                },
            },
            data: {
                bookedSlot: updatedSlots,
            },
        });
    } else {
        await prisma.availability.create({
            data: {
                technicianId: service.technicianId,
                date: new Date(payload.bookingDate),
                bookedSlot: updatedSlots,
            },
        });
    }
    // ---------

    const booking = await prisma.booking.create({
        data: {
            bookingDate: new Date(payload.bookingDate),
            slot: payload.slot,
            address: payload.address,
            notes: payload.notes,

            totalAmount: service.price * payload.slot.length * 2,
            technicianId: service.technicianId,
            customerId: userId,
            serviceId: service.id,
        }
    })

    return booking;
}

const getBookingDetails = async (userId: string, bookingId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    const profile = await prisma.technicianProfile.findUnique({
        where: { userId }
    })

    const booking = await prisma.booking.findUniqueOrThrow({
        where: { id: bookingId }
    })

    if (booking.customerId === userId || booking.technicianId === profile?.id || user?.role === "ADMIN") {
        return booking;
    }
    else {
        throw new Error("You are not authorized to visit this route")
    }
}

const getAllBookings = async () => {
    return await prisma.booking.findMany();
}

const getBookingForUser = async (userId: string) => {
    return await prisma.booking.findMany({
        where: { customerId: userId }
    })
}

const getBookingForTechnician = async (technicianId: string) => {
    return await prisma.booking.findMany({
        where: { technicianId }
    })
}

export const bookingService = {
    createBooking,
    getBookingDetails,
    getAllBookings,
    getBookingForUser,
    getBookingForTechnician
}