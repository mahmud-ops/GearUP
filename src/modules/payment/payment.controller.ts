import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { orderId } = req.params;

    if (typeof orderId !== "string") throw new Error("Invalid order id");

    const result = await paymentService.createCheckoutSession(userId, orderId);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Checkout session created successfully.",
      data: {
        paymentUrl: result,
      },
    });
  },
);

export const paymentController = {
  createCheckoutSession,
};
