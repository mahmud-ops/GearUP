import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalOrdersService } from "./rentalOrder.service";
import type { TUpdateOrderStatus } from "./rentalOrder.interface";

const createRentalOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalOrdersService.createRentalOrder(
      req.body,
      req.user?.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental order created successfully.",
      data: result,
    });
  },
);

const getMyRentalOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalOrdersService.getMyRentalOrders(req.user?.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental orders retrieved successfully.",
      data: result,
    });
  },
);

const getProviderOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalOrdersService.getProviderOrders(req.user?.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Provider orders retrieved successfully.",
      data: result,
    });
  },
);

const getAllRentalOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalOrdersService.getAllRentalOrders();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental orders retrieved successfully.",
      data: result,
    });
  },
);

const getSingleRentalOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await rentalOrdersService.getSingleRentalOrder(
      id as string,
      req.user?.id,
      req.user.role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental order retrieved successfully.",
      data: result,
    });
  },
);

const updateRentalOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await rentalOrdersService.updateRentalOrder(
      id as string,
      req.body,
      req.user?.id,
      req.user?.role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental order updated successfully.",
      data: result,
    });
  },
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const statusPayload = req.body as TUpdateOrderStatus;

    const result = await rentalOrdersService.updateOrderStatus(
      id as string,
      statusPayload,
      req.user?.id,
      req.user?.role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Order status updated successfully.",
      data: result,
    });
  },
);

const deleteRentalOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await rentalOrdersService.deleteRentalOrder(
      id as string,
      req.user?.id,
      req.user?.role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental order deleted successfully.",
      data: {
        "order id": result.id,
      },
    });
  },
);

export const rentalOrdersController = {
  createRentalOrder,
  getMyRentalOrders,
  getProviderOrders,
  getAllRentalOrders,
  getSingleRentalOrder,
  updateRentalOrder,
  updateOrderStatus,
  deleteRentalOrder,
};
