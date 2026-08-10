import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/:orderId",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  reviewController.createReview,
);

router.get("/", auth(Role.ADMIN), reviewController.getAllReview);

router.get(
  "/my-reviews",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  reviewController.getMyReview,
);

router.get(
  "/gear/:gearItemId",
  reviewController.getReviewByGearId,
);

router.get("/:id", auth(Role.ADMIN), reviewController.getReviewById);

router.patch(
  "/:id",
  auth(Role.CUSTOMER),
  reviewController.updateReview,
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.CUSTOMER),
  reviewController.deleteReview,
);

export const reviewRouter = router;
