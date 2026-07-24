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

  await prisma.payment.create({
    data: {
      customerId: userId,
      orderId: rentalOrder.id,
      providerId: rentalOrder.providerId,
      stripeSessionId: session.id,
      amount: rentalOrder.totalAmount,
      status: "PENDING",
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
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") break;

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent && typeof session.payment_intent === "object"
            ? (session.payment_intent as Stripe.PaymentIntent).id
            : null;

      console.log(
        `Processing checkout.session.completed for session: ${session.id}, paymentIntent: ${paymentIntentId}, orderId: ${session.metadata?.orderId}`,
      );

      await prisma.payment.upsert({
        where: {
          stripeSessionId: session.id,
        },
        create: {
          stripeSessionId: session.id,
          orderId: session.metadata?.orderId || "",
          customerId: session.metadata?.customerId || "",
          providerId: session.metadata?.providerId || "",
          transactionId: paymentIntentId,
          amount: 0,
          status: "COMPLETED",
          paidAt: new Date(),
        },
        update: {
          transactionId: paymentIntentId,
          status: "COMPLETED",
          paidAt: new Date(),
        },
      });

      console.log("Payment updated");

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}.`);
  }
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
};
