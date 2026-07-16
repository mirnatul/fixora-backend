import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from './../../utils/sendResponse';
import httpStatus from 'http-status';
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await categoryService.createCategory(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: result
    })
})

const getAllCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category = await categoryService.getAllCategory();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category created successfully",
        data: category
    })
})


export const categoryController = {
    createCategory,
    getAllCategory
}