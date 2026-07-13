import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";


const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(payload);


    // set the tokens to cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    })




    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login successfull",
        data: { accessToken, refreshToken }

    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const profile = await authService.getMyProfileFromDB(req.user?.id as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: { profile }
    })
})

export const authController = {
    loginUser,
    getMyProfile
}