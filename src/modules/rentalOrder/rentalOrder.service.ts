import type { GearItems } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";

interface IRentalOrderPayload {
  startDate: string;
  endDate: string;
  items: {
    gearItemId: string;
    quantity: number;
  }[];
}

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

  // Get all requested gear items
  const gearItems: GearItems[] = await prisma.gearItems.findMany({
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

  const order = await prisma.rental_orders.create({
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
        include: {
          item: true,
        },
      },
    },
  });

  return order;
};

const getMyRentalOrders = async (userId: string, role: string) => {
  // TODO
};

const getAllRentalOrders = async () => {
  // TODO
};

const getSingleRentalOrder = async (
  id: string,
  userId: string,
  role: string,
) => {
  // TODO
};

const updateRentalOrder = async (
  id: string,
  payload: any,
  userId: string,
  role: string,
) => {
  // TODO
};

const deleteRentalOrder = async (id: string, userId: string, role: string) => {
  // TODO
};

export const rentalOrdersService = {
  createRentalOrder,
  getMyRentalOrders,
  getAllRentalOrders,
  getSingleRentalOrder,
  updateRentalOrder,
  deleteRentalOrder,
};
