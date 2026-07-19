import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.createUser);
router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  userController.getCurrentUser,
);
router.get("/", auth(Role.ADMIN), userController.getAllUsers);
router.get("/:userId", auth(Role.ADMIN), userController.getUserById);
router.patch(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  userController.updateCurrentUser,
);
router.patch("/:userId", auth(Role.ADMIN), userController.suspendUser);
export const userRouter = router;
