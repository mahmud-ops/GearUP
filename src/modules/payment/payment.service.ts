import type Stripe from "stripe";
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
    line_items: rentalOrder.rentalOrderItems.map((orderItem) => ({
      price_data: {
        currency: "bdt",
        product_data: {
          name: orderItem.item.name,
          description: orderItem.item.description,
        },
        unit_amount: Number(orderItem.totalPrice) * 100,
      },
      quantity: 1,
    })),
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${config.app_url}payment?success=true`,
    cancel_url: `${config.app_url}payment?success=false`,
    metadata: {
      orderId: rentalOrder.id,
      customerId: userId,
      providerId: rentalOrder.providerId,
    },
  });

  return session.url;
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret as string,
  );

  switch (event.type) {
    case "checkout.session.completed":
      const session: Stripe.Checkout.Session = event.data.object;
      const sessionId = session.id;
      const transactionId = session.payment_intent;
      const userId = session.metadata?.customerId;
      const orderId = session.metadata?.orderId;
      const providerId = session.metadata?.providerId;
      const amount = (Number(session.amount_total) / 100).toFixed(2);
      const status =
        session.payment_status === "paid" ? "COMPLETED" : "PENDING";
      const paidAt = new Date(session.created * 1000);

      await prisma.payment.create({
        data: {
          // complete this block
        }
      })

      console.log(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
};
