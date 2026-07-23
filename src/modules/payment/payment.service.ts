import { prisma } from "../../lib/prisma";

const createCheckoutSession = async (userId: string, orderId: string) => {
  const rentalOrder = await prisma.rental_orders.findUnique({
    where: {
      id: orderId,
    },
    include: {
      rentalOrderItems: {
        include: {
          item: true,
        },
      },
    },
  });

  if (!rentalOrder) throw new Error("Order not found.");

  if (rentalOrder.customerId !== userId)
    throw new Error("Forbidden! This order can't be accessed");

  return rentalOrder;
};
