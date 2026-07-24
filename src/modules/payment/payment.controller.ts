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

const getAllPayments = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  const result = await paymentService.getAllPayments();

  sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Fetched all payments successfully.",
      data: result,
    });
})

const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentService.getMyPayments(req.user?.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Your payments fetched successfully.",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { paymentId } = req.params;

  const result = await paymentService.getSinglePayment(
    paymentId as string,
    req.user?.id as string,
    req.user?.role as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Payment fetched successfully.",
    data: result,
  });
});

const getProviderPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentService.getProviderPayments(req.user?.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Provider payments fetched successfully.",
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getAllPayments,
  getMyPayments,
  getSinglePayment,
  getProviderPayments,
};
