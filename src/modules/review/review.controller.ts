import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.createReview(
      req.user?.id,
      req.params?.orderId as string,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "Review created successfully.",
      data: result,
    });
  },
);

const getAllReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getAllReview();

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Fetched all review successfully.",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
  getAllReview
};
