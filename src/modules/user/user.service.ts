import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ICreateUser } from "./user.interface";
import config from "../../config";
import { use } from "react";

const createUser = async (payload: ICreateUser) => {
  const { name, email, password } = payload;

  const isUserExist = await prisma.users.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
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
      rentalOrders: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

export const userService = {
  createUser,
  getCurrentUser,
};
