import AppError from "./appError";
import type { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import type { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwtUtil";
import { sendResponse } from "../utils/sendResponse";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!accessToken) {
      throw new AppError(401, "Invalid token.");
    }

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret as string,
    );

    if (typeof verifiedToken === "string") throw new AppError(401, verifiedToken);

    const { id, name, email, role } = verifiedToken;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      return sendResponse(res, {
        success: false,
        statusCode: httpstatus.FORBIDDEN,
        message: "you don't have access to this resource.",
        data: null,
      });
    }

    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new AppError(404, "User not found , please log in.");
    if (user.status === "SUSPENDED")
      throw new AppError(403, "Your account is suspended");

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  });
};
