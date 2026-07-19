import type { Request, Response } from "express";
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
})

export const userController = {
  createUser,
};
