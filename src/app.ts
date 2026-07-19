import express, {
  urlencoded,
  type Application,
  type Request,
  type Response,
} from "express";

import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
// import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();

// predefined middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/users", userRouter);
app.use("/api/auth",authRouter)

//error handlers
app.use(globalErrorHandler);

export default app;
