import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import { paymentService } from "./payment.service";
import { stripe } from "../../lib/stripe";
import config from "../../config";

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

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const endpointSecret = config.stripe_webhook_secret;
    let event = req.body;

    const signature = req.headers["stripe-signature"];

    const result = await paymentService.handleWebhook(
      event,
      signature as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Webhook triggered successfully",
      data: null,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
};
