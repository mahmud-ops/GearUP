import express, {
  urlencoded,
  type Application
} from "express";

import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
import { categoryRouter } from "./modules/category/category.route";
import { userRouter } from "./modules/user/user.route";
import { gearItemsRouter } from "./modules/gearItems/gearItems.route";

const app: Application = express();

// predefined middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/users", userRouter);
app.use("/api/auth",authRouter);
app.use("/api/categories",categoryRouter);
app.use("/api/gear_items",gearItemsRouter)

//error handlers
app.use(globalErrorHandler);

export default app;
