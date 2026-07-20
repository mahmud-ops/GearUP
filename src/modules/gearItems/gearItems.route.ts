import { Router } from "express";

import { gearItemsController } from "./gearItems.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.PROVIDER),
  gearItemsController.createGearItem,
);

router.get("/", gearItemsController.getAllGearItems);

router.get("/:id", gearItemsController.getSingleGearItem);

router.patch(
  "/:id",
  auth(Role.ADMIN, Role.PROVIDER),
  gearItemsController.updateGearItem,
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.PROVIDER),
  gearItemsController.deleteGearItem,
);

export const gearItemsRouter = router;