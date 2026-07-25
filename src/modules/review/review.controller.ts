import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import type { Role } from "../../../generated/prisma/enums";
import { reviewService } from "./review.service";
import type { IUpdateReview } from "./review.interface";

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

const getMyReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getMyReview(
      req.user?.id,
      req.user?.role as Role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Fetched your reviews successfully.",
      data: result,
    });
  },
);

const getReviewById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getReviewById(req.params.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Fetched review successfully.",
      data: result,
    });
  },
);

const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.updateReview(
      req.params.id as string,
      req.body as IUpdateReview,
      req.user?.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Review updated successfully.",
      data: result,
    });
  },
);

const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.deleteReview(
      req.params.id as string,
      req.user?.id,
      req.user?.role as Role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Review deleted successfully.",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
  getAllReview,
  getMyReview,
  getReviewById,
  updateReview,
  deleteReview,
};
