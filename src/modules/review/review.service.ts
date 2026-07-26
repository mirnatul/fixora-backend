import { prisma } from "../../lib/prisma";

interface IReview {
    rating: number;
    comment: string;
}

const createReview = async (bookingId: string, payload: IReview) => {
    const checkBookingComplete = await prisma.booking.findUniqueOrThrow({
        where: { id: bookingId }
    })

    const checkIfReviewPresentALready = await prisma.review.findUnique({
        where: { bookingId }
    })

    if (checkIfReviewPresentALready) {
        throw new Error("You already reviewed this booking!!")
    }
    else if (checkBookingComplete.status === "COMPLETED") {
        const review = await prisma.review.create({
            data: { ...payload, bookingId }
        })
        return review;
    }
    else {
        throw new Error("You can't review until the booking is completed")
    }
}

export const reviewService = {
    createReview
}