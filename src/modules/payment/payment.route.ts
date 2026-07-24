import express, { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/:orderId",
  auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

router.get(
  "/my-payments",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getMyPayments,
);

router.get(
  "/provider",
  auth(Role.PROVIDER, Role.ADMIN),
  paymentController.getProviderPayments,
);

router.get(
  "/:paymentId",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  paymentController.getSinglePayment,
);

router.get("/", auth(Role.ADMIN), paymentController.getAllPayments);

export const paymentRouter = router;
