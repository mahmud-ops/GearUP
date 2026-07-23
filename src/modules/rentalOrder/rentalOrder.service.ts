import { Role, type GearItems } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import type {
  IRentalOrderPayload,
  IUpdateRentalOrder,
} from "./rentalOrder.interface";

const createRentalOrder = async (
  payload: IRentalOrderPayload,
  userId: string,
) => {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
  );

  const order = await prisma.$transaction(async (tx) => {
    // Get all requested gear items
    const gearItems: GearItems[] = await tx.gearItems.findMany({
      where: {
        id: {
          in: payload.items.map((i) => i.gearItemId),
        },
      },
    });

    let totalDailyRate = 0;

    for (const item of payload.items) {
      const gear = gearItems.find((g) => g.id === item.gearItemId);

      if (!gear) {
        throw new Error("Gear item not found.");
      }

      totalDailyRate += Number(gear.dailyRate) * item.quantity;
    }

    const totalPrice = totalDailyRate * days;

    return await tx.rental_orders.create({
      data: {
        customerId: userId,
        startDate,
        endDate,
        totalAmount: totalPrice,

        rentalOrderItems: {
          create: payload.items.map((item) => {
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
        rentalOrderItems: {
          select: {
            item: true,
          },
        },
      },
    });
  });

  return order;
};

const getMyRentalOrders = async (userId: string) => {
  const order = await prisma.rental_orders.findMany({
    where: {
      customerId: userId,
    },
    include: {
      rentalOrderItems: {
        select: {
          item: {
            select: {
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

  return order;
};

const getAllRentalOrders = async () => {
  const orders = await prisma.rental_orders.findMany({
    include: {
      rentalOrderItems: true,
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
      rentalOrderItems: {
        select: {
          item: true,
        },
      },
    },
  });

  if (role !== "ADMIN" && userId !== order?.customerId) {
    throw new Error("You don't have access to this resource.");
    return null;
  }

  return order;
};

const updateRentalOrder = async (
  id: string,
  payload: IUpdateRentalOrder,
  userId: string,
  role: Role,
) => {
  // 1. Resolve updated dates.
  // 2. Calculate the rental duration.
  // 3. If new items are provided:
  //    - Validate gear items.
  //    - Replace existing order items.
  // 4. Recalculate the total amount.

  const udpatedOrder = await prisma.$transaction(async (tx) => {
    const rentalOrder = await tx.rental_orders.findUnique({
      where: { id },
    });

    if (!rentalOrder) {
      throw new Error("Rental order not found.");
    }

    if (role !== Role.ADMIN && userId !== rentalOrder.customerId) {
      throw new Error("You can't update this rental order.");
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

      for (const item of payload.items) {
        const gear = gearItems.find((g) => g.id === item.gearItemId);
        if (!gear) {
          throw new Error("Gear item not found.");
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
        rentalOrderItems: {
          include: {
            item: true,
          },
        },
      },
    });
  });

  return udpatedOrder;
};

const deleteRentalOrder = async (id: string, userId: string, role: string) => {
  // Admin
  // If user = owner of this order

  const order = await prisma.rental_orders.findUnique({
    where: {
      id,
    },
  });

  if (!order) throw new Error("Rental order not found");

  if (role !== "ADMIN" && userId !== order.customerId) {
    throw new Error("You can't delete this rental order.");
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
  getSingleRentalOrder,
  updateRentalOrder,
  deleteRentalOrder,
};
