import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearItemsService } from "./gearItems.service";

const createGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await gearItemsService.createGearItem(
      req.body,
      userId,
      role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear item created successfully.",
      data: result,
    });
  },
);

const getAllGearItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await gearItemsService.getAllGearItems();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear items retrieved successfully.",
      data: result,
    });
  },
);

//You see how I handle the getSingleGearItem parameter so we should handle the others like this. The thing is it's getting an error that's why I added id as string.
const getSingleGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await gearItemsService.getSingleGearItem(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear item retrieved successfully.",
      data: result,
    });
  },
);

const updateGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await gearItemsService.updateGearItem(
      id as string,
      req.body,
      userId,
      role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear item updated successfully.",
      data: result,
    });
  },
);

const deleteGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await gearItemsService.deleteGearItem(
      id as string,
      userId,
      role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear item deleted successfully.",
      data: result,
    });
  },
);

export const gearItemsController = {
  createGearItem,
  getAllGearItems,
  getSingleGearItem,
  updateGearItem,
  deleteGearItem,
};
