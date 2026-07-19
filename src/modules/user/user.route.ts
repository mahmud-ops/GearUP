import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.createUser);
router.get("/me",auth());

export const userRouter = router;
