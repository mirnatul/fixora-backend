import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status';
import { technicianService } from "./technician.service";

const getTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string

    const result = await technicianService.getTechnicianProfile(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully extract the technician profile",
        data: result
    })
})

const updateTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string

    const result = await technicianService.updateTechnicianProfile(userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully",
        data: result
    })
})

export const technicianController = {
    getTechnicianProfile,
    updateTechnicianProfile
}