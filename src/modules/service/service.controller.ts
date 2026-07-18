import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { serviceService } from "./service.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';

const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string
    const result = await serviceService.createService(payload, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Service createed successfully",
        data: result
    })
})

const getService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceService.getService(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service extracted successfylly",
        data: result
    })
})


export const serviceController = {
    createService,
    getService
}