import type { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { ICreateReview } from "./review.interface";

const createReview = async (
  userId: string,
  orderId: string,
  payload: ICreateReview,
) => {
  const rentalOrder = await prisma.rental_orders.findUnique({
    where: {
      id: orderId,
    },
    include: {
      rentalOrderItems: {
        include: {
          item: {
            select: {
              id: true,
              name: true,
              dailyRate: true,
            },
          },
        },
      },
    },
  });

  if (!rentalOrder) throw new Error("Order not found");

  const isItemExist = rentalOrder.rentalOrderItems.some(
    (i) => i.id === payload.gearItemId,
  );

  if (!isItemExist)
    throw new Error("One or more items does not exist in this order.");

  if (userId !== rentalOrder.customerId)
    throw new Error("You can't access this order.");

  if (payload.rating > 5 && payload.rating < 0)
    throw new Error("Rating must be within a valid range (0–5)");

  const result = await prisma.reviews.create({
    data: {
      customerId: userId,
      gearItemId: payload.gearItemId,
      orderId: orderId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return result;
};

const getAllReview = async () => {
  const result = await prisma.reviews.findMany();
  return result;
};

export const reviewService = {
  createReview,
  getAllReview,
};
