import { Role, type GearItems } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import AppError from "../../middlewares/appError";
import type {
  IUpdateRentalOrder,
  TCreateRentalOrder,
  TUpdateOrderStatus,
} from "./rentalOrder.interface";

const createRentalOrder = async (
  payload: TCreateRentalOrder,
  userId: string,
) => {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
  );

  const order = await prisma.$transaction(async (tx) => {
    const gearItems: GearItems[] = await tx.gearItems.findMany({
      where: {
        id: {
          in: payload.items.map((i: any) => i.gearItemId),
        },
      },
    });

    if (gearItems.length === 0) {
      throw new AppError(400, "No valid gear items found.");
    }

    const firstProviderId = gearItems[0]!.providerId;

    for (const gear of gearItems) {
      if (gear.providerId !== firstProviderId) {
        throw new AppError(
          500,
          "All gear items in a single order must belong to the same provider.",
        );
      }
    }

    let totalDailyRate = 0;

    for (const item of payload.items) {
      const gear = gearItems.find((g) => g.id === item.gearItemId);

      if (!gear) {
        throw new AppError(404, "Gear item not found.");
      }

      totalDailyRate += Number(gear.dailyRate) * item.quantity;
    }

    const totalPrice = totalDailyRate * days;

    return await tx.rental_orders.create({
      data: {
        customerId: userId,
        providerId: firstProviderId,
        startDate,
        endDate,
        totalAmount: totalPrice,

        rentalOrderItems: {
          create: payload.items.map((item: any) => {
            const gear = gearItems.find((g) => g.id === item.gearItemId)!;

            return {
              gearItemId: gear.id,
              quantity: item.quantity,
              dailyRate: gear.dailyRate,
              totalPrice: Number(gear.dailyRate) * item.quantity * days,
            };
          }),
        },
      },
      include: {
        customer: {
          omit: {
            password: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rentalOrderItems: {
          select: {
            item: {
              select: {
                id: true,
                name: true,
                image: true,
                dailyRate: true,
              },
            },
            quantity: true,
          },
        },
      },
    });
  });

  return order;
};

const getMyRentalOrders = async (userId: string) => {
  const orders = await prisma.rental_orders.findMany({
    where: {
      customerId: userId,
    },
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      rentalOrderItems: {
        select: {
          item: {
            select: {
              id: true,
              name: true,
              image: true,
              dailyRate: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  return orders;
};

const getAllRentalOrders = async () => {
  const orders = await prisma.rental_orders.findMany({
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      rentalOrderItems: {
        select: {
          item: true,
          quantity: true,
        },
      },
    },
  });

  return orders;
};

const getProviderOrders = async (userId: string) => {
  const orders = await prisma.rental_orders.findMany({
    where: {
      providerId: userId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      rentalOrderItems: {
        select: {
          item: {
            select: {
              id: true,
              name: true,
              image: true,
              dailyRate: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  return orders;
};

const getSingleRentalOrder = async (id: string, userId: string, role: Role) => {
  const order = await prisma.rental_orders.findUnique({
    where: {
      id: id,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      rentalOrderItems: {
        select: {
          item: true,
          quantity: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError(404, "Rental order not found.");
  }

  if (
    role !== "ADMIN" &&
    userId !== order.customerId &&
    userId !== order.providerId
  ) {
    throw new AppError(403, "You don't have access to this resource.");
  }

  return order;
};

const updateRentalOrder = async (
  id: string,
  payload: IUpdateRentalOrder,
  userId: string,
  role: Role,
) => {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const rentalOrder = await tx.rental_orders.findUnique({
      where: { id },
    });

    if (!rentalOrder) {
      throw new AppError(404, "Rental order not found.");
    }

    if (role !== Role.ADMIN && userId !== rentalOrder.customerId) {
      throw new AppError(403, "You can't update this rental order.");
    }

    const startDate = payload.startDate
      ? new Date(payload.startDate)
      : rentalOrder.startDate;

    const endDate = payload.endDate
      ? new Date(payload.endDate)
      : rentalOrder.endDate;

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
    );

    let totalDailyRate = 0;

    const updateData: any = {
      startDate,
      endDate,
    };

    if (payload.items) {
      const gearItems: GearItems[] = await tx.gearItems.findMany({
        where: {
          id: {
            in: payload.items.map((i) => i.gearItemId),
          },
        },
      });

      if (gearItems.length === 0) {
        throw new AppError(400, "No valid gear items found.");
      }

      const firstProviderId = gearItems[0]!.providerId;

      for (const gear of gearItems) {
        if (gear.providerId !== firstProviderId) {
          throw new AppError(
            500,
            "All gear items in a single order must belong to the same provider.",
          );
        }
      }

      for (const item of payload.items) {
        const gear = gearItems.find((g) => g.id === item.gearItemId);
        if (!gear) {
          throw new AppError(404, "Gear item not found.");
        }

        totalDailyRate += Number(gear.dailyRate) * item.quantity;
      }

      updateData.rentalOrderItems = {
        deleteMany: {},
        create: payload.items.map((item) => {
          const gear = gearItems.find((g) => g.id === item.gearItemId)!;

          return {
            gearItemId: gear.id,
            quantity: item.quantity,
            dailyRate: gear.dailyRate,
            totalPrice: Number(gear.dailyRate) * item.quantity * days,
          };
        }),
      };

      if (firstProviderId !== rentalOrder.providerId) {
        updateData.providerId = firstProviderId;
      }
    } else {
      const existingItems = await tx.rentalOrderItems.findMany({
        where: {
          orderId: id,
        },
      });

      for (const item of existingItems) {
        totalDailyRate += Number(item.dailyRate) * item.quantity;
      }
    }

    updateData.totalAmount = totalDailyRate * days;

    return await tx.rental_orders.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        customer: {
          omit: {
            password: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rentalOrderItems: {
          include: {
            item: true,
          },
        },
      },
    });
  });

  return updatedOrder;
};

const updateOrderStatus = async (
  id: string,
  payload: TUpdateOrderStatus,
  userId: string,
  role: Role,
) => {
  const order = await prisma.rental_orders.findUnique({
    where: { id },
  });

  if (!order) {
    throw new AppError(404, "Rental order not found.");
  }

  if (role !== Role.ADMIN && userId !== order.providerId) {
    throw new AppError(403, "You can't update this order status.");
  }

  const currentStatus = order.status;
  const nextStatus = payload.status;

  if (currentStatus === "CONFIRMED" && nextStatus === "PICKEDUP") {
    return await prisma.rental_orders.update({
      where: { id },
      data: { status: nextStatus },
    });
  }

  if (currentStatus === "PICKEDUP" && nextStatus === "RETURNED") {
    return await prisma.rental_orders.update({
      where: { id },
      data: { status: nextStatus },
    });
  }

  throw new AppError(
    400,  
    `Invalid status transition from ${currentStatus} to ${nextStatus}.`,
  );
};

const deleteRentalOrder = async (id: string, userId: string, role: string) => {
  const order = await prisma.rental_orders.findUnique({
    where: {
      id,
    },
  });

  if (!order) throw new AppError(404, "Rental order not found");

  if (role !== "ADMIN" && userId !== order.customerId) {
    throw new AppError(403, "You can't delete this rental order.");
  }

  const deletedOrder = await prisma.rental_orders.delete({
    where: {
      id,
    },
  });

  return deletedOrder;
};

export const rentalOrdersService = {
  createRentalOrder,
  getMyRentalOrders,
  getAllRentalOrders,
  getProviderOrders,
  getSingleRentalOrder,
  updateRentalOrder,
  updateOrderStatus,
  deleteRentalOrder,
};
