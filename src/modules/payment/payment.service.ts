import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"



const createCheckoutSession = async (bookingId: string, userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUniqueOrThrow({
            where: { id: bookingId },
            include: { service: true }
        })
        const user = await tx.user.findUniqueOrThrow({
            where: { id: userId }
        })

        // customer id
        let stripeCustomerId = user.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            })

            stripeCustomerId = customer.id
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `${booking.service.title}`,
                            description: `Booking #${booking.service.description}`,
                        },
                        unit_amount: Math.round(Number(booking.totalAmount) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/paymentSuccessPage`,
            cancel_url: `${config.app_url}/paymentFailedPage`,
            metadata: { userId: user.id }
        })
        return session.url
    })


    return {
        paymentUrl: transactionResult
    }
}

export const paymentService = {
    createCheckoutSession
}