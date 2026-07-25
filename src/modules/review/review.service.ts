import type { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { ICreateReview, IUpdateReview } from "./review.interface";

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

const getMyReview = async (userId: string, role: Role) => {
  if (role === "CUSTOMER") {
    const result = await prisma.reviews.findMany({
      where: { customerId: userId },
      include: {
        gearItem: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        order: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });
    return result;
  }

  if (role === "PROVIDER") {
    const result = await prisma.reviews.findMany({
      where: {
        order: {
          providerId: userId,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gearItem: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        order: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });
    return result;
  }

  const result = await prisma.reviews.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      order: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });
  return result;
};

const getReviewById = async (id: string) => {
  const result = await prisma.reviews.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      order: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });
  return result;
};

const updateReview = async (
  id: string,
  payload: IUpdateReview,
  userId: string,
) => {
  const review = await prisma.reviews.findUnique({
    where: { id },
  });

  if (!review) throw new Error("Review not found.");

  if (userId !== review.customerId) {
    throw new Error("You can't update this review.");
  }

  const updatedReview = await prisma.reviews.update({
    where: { id },
    data: payload,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      order: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  return updatedReview;
};

export const reviewService = {
  createReview,
  getAllReview,
  getMyReview,
  getReviewById,
  updateReview,
};
