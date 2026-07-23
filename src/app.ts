import express, { urlencoded, type Application } from "express";

import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
import { categoryRouter } from "./modules/category/category.route";
import { userRouter } from "./modules/user/user.route";
import { gearItemsRouter } from "./modules/gearItems/gearItems.route";
import { rentalOrdersRouter } from "./modules/rentalOrder/rentalorder.route";
import { paymentRouter } from "./modules/payment/payment.route";
import config from "./config";
import { stripe } from "./lib/stripe";

const app: Application = express();
const endpointSecret = config.stripe_webhook_secret;

app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature as string,
          endpointSecret,
        );
      } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);

// predefined middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/gear_items", gearItemsRouter);
app.use("/api/rental_orders", rentalOrdersRouter);
app.use("/api/payment", paymentRouter);
//error handlers
app.use(globalErrorHandler);

export default app;
