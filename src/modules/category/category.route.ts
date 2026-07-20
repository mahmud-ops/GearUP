import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
router.get("/:slug", categoryController.getSingleCategory);
router.patch("/:slug", auth(Role.ADMIN), categoryController.updateCategory);
router.delete("/:slug",categoryController.deleteCategory);

export const categoryRouter = router;