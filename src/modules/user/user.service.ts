import AppError from "../../middlewares/appError";
import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import type { ICreateUser } from "./user.interface";
import { Role } from "../../../generated/prisma/enums";

const createUser = async (payload: ICreateUser) => {
  const { name, email, password, role } = payload;

  if (payload.role === "ADMIN")
    throw new AppError(
      403,
      "Admin accounts cannot be created through the registration endpoint.",
    );

  const isUserExist = await prisma.users.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new AppError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role ?? "CUSTOMER",
    },
  });

  const user = await prisma.users.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const getCurrentUser = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      gearItems: true,
      customerOrders: true,
      providerOrders: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return user;
};

const getAllUsers = async () => {
  const users = await prisma.users.findMany({
    omit: {
      password: true,
    },
  });
  return users;
};

const updateCurrentUser = async (
  userId: string,
  payload: {
    name: string;
    email: string;
    password: string;
  },
) => {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const updatedUser = await prisma.users.update({
    where: {
      id: userId,
    },
    data: payload,
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const getUserById = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return user;
};

const suspendUser = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const updatedUser = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      status: "SUSPENDED",
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

export const userService = {
  createUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateCurrentUser,
  suspendUser,
};
