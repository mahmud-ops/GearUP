import type { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await userService.createUser(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "User registered successfully.",
    data: result,
  });
});

const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await userService.getCurrentUser(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Fetched user successfully.",
      data: result,
    });
  },
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Fetched all users successfully.",
      data: result,
    });
  },
);

const updateCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await userService.updateCurrentUser(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User updated successfully.",
      data: result,
    });
  },
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (typeof userId !== "string") {
      throw new Error("Invalid user id.");
    }

    const result = await userService.getUserById(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Fetched user successfully.",
      data: result,
    });
  },
);

const suspendUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (typeof userId !== "string") {
      throw new Error("Invalid user id.");
    }

    const result = await userService.suspendUser(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User suspended successfully.",
      data: result,
    });
  },
);

export const userController = {
  createUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateCurrentUser,
  suspendUser
};
