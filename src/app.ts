import express, {
  urlencoded,
  type Application,
  type Request,
  type Response,
} from "express";

import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

// predefined middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/users", userRouter);

//error handlers
app.use(globalErrorHandler);

export default app;
