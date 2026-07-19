import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string
    const result = await bookingService.createBooking(userId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Booking created successfully",
        data: result
    })
})

const getBookingDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string
    const bookingId = req.params.bookingId as string;
    const result = await bookingService.getBookingDetails(userId, bookingId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking details extracted successfully",
        data: result
    })
})


const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await bookingService.getAllBookings();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All bookings extracted",
        data: result
    })
})


const getBookingForUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId as string;
    const result = await bookingService.getBookingForUser(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All bookings for user extracted",
        data: result
    })
})


const getBookingForTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.params.technicianId as string;
    const result = await bookingService.getBookingForTechnician(technicianId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All bookings for technician extracted",
        data: result
    })
})



export const bookingController = {
    createBooking,
    getBookingDetails,
    getAllBookings,
    getBookingForUser,
    getBookingForTechnician
}