import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from 'http-status';
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";






const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully!",
        data: { user }
    })
})


// admin
const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const allUser = await userService.getAllUserFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully extract all user",
        data: allUser
    })
})

// update user status
const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId as string;
    const payload = req.body;
    console.log(userId, payload);

    const result = await userService.updateUserStatusInDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully extract all user",
        data: result
    })

    // const result = await userController.updateUserStatus(userId, payload)
})


export const userController = {
    registerUser,
    getAllUser,
    updateUserStatus
}
