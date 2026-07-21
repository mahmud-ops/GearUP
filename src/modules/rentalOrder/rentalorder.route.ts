import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { rentalOrdersController } from "./rentalOrder.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  rentalOrdersController.createRentalOrder,
);

router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  rentalOrdersController.getMyRentalOrders,
);

router.get(
  "/",
  auth(Role.ADMIN),
  rentalOrdersController.getAllRentalOrders,
);

router.get(
  "/:id",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  rentalOrdersController.getSingleRentalOrder,
);

router.patch(
  "/:id",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  rentalOrdersController.updateRentalOrder,
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  rentalOrdersController.deleteRentalOrder,
);

export const rentalOrdersRouter = router;