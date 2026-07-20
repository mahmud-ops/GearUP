import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createGearItem = async (
  payload: any,
  userId: string,
  role: Role,
) => {
  let providerId: string;

  if (role === Role.ADMIN) {
    if (!payload.providerId) {
      throw new Error("Provider ID is required.");
    }

    providerId = payload.providerId;
  } else {
    providerId = userId;
  }

  const result = await prisma.gearItems.create({
    data: {
      name: payload.name,
      description: payload.description,
      dailyRate: payload.dailyRate,
      availableQuantity: payload.availableQuantity,
      image: payload.image,
      categoryId: payload.categoryId,
      providerId,
    },
  });

  return result;
};

const getAllGearItems = async () => {
  const result = await prisma.gearItems.findMany({
    include: {
      category: true,
    },
  });

  return result;
};

const getSingleGearItem = async (id: string) => {
  const result = await prisma.gearItems.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const updateGearItem = async (
  id: string,
  payload: Record<string, unknown>,
  userId: string,
  role: Role,
) => {
  const gearItem = await prisma.gearItems.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (role !== Role.ADMIN && gearItem.providerId !== userId) {
    throw new Error("You are not authorized to update this gear item.");
  }

  const result = await prisma.gearItems.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteGearItem = async (
  id: string,
  userId: string,
  role: Role,
) => {
  const gearItem = await prisma.gearItems.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (role !== Role.ADMIN && gearItem.providerId !== userId) {
    throw new Error("You are not authorized to delete this gear item.");
  }

  const result = await prisma.gearItems.delete({
    where: {
      id,
    },
  });

  return result;
};

export const gearItemsService = {
  createGearItem,
  getAllGearItems,
  getSingleGearItem,
  updateGearItem,
  deleteGearItem,
};