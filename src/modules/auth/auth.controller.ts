import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import { authService } from "./auth.service";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accessToken } = await authService.loginUser(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // set `true` in production
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User logged in successfully.",
      data: accessToken,
    });
  },
);

export const authController = {
  loginUser,
};
