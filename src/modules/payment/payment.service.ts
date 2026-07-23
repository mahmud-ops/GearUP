import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

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

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "test gear",
            description: "stripe integration test",
          },
          unit_amount: 20000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${config.app_url}payment?success=true`,
    cancel_url: `${config.app_url}payment?success=false`,
    metadata: {
      orderId: rentalOrder.id,
      customerId: userId,
    },
  });

  return session.url;
};

export const paymentService = {
  createCheckoutSession,
};
