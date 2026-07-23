import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/:orderId",
  auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

export const paymentRouter = router;
