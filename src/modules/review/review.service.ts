import { prisma } from "../../lib/prisma";

interface IReview {
    rating: number;
    comment: string;
}

const createReview = async (bookingId: string, payload: IReview) => {
    const booking = await prisma.booking.findUniqueOrThrow({
        where: { id: bookingId }
    })

    const checkIfReviewPresentALready = await prisma.review.findUnique({
        where: { bookingId }
    })

    if (checkIfReviewPresentALready) {
        throw new Error("You already reviewed this booking!!")
    }
    else if (booking.status === "COMPLETED") {
        const review = await prisma.review.create({
            data: { ...payload, bookingId }
        })

        // update the technician rating
        await updateTechnicianRating(booking.technicianId);

        return review;
    }
    else {
        throw new Error("You can't review until the booking is completed")
    }
}

// dynamically updating the rating for technician
const updateTechnicianRating = async (technicianId: string) => {
    const stats = await prisma.review.aggregate({
        where: {
            booking: {
                technicianId
            }
        },
        _avg: {
            rating: true
        },
        _count: {
            rating: true
        }
    });

    await prisma.technicianProfile.update({
        where: { id: technicianId },
        data: {
            averageRating: stats._avg.rating ?? 0,
            totalReviews: stats._count.rating
        }
    });
}

export const reviewService = {
    createReview
}