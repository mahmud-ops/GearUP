import express, {
  urlencoded,
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
import { categoryRouter } from "./modules/category/category.route";
import { gearItemsRouter } from "./modules/gearItems/gearItems.route";
import { paymentRouter } from "./modules/payment/payment.route";
import { rentalOrdersRouter } from "./modules/rentalOrder/rentalorder.route";
import { userRouter } from "./modules/user/user.route";
import { paymentController } from "./modules/payment/payment.controller";
import { reviewRouter } from "./modules/review/review.route";
import { catchAsync } from "./utils/catchAsync";
import { sendResponse } from "./utils/sendResponse";
import httpstatus from "http-status";
import cors from 'cors'

const app: Application = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true,
  })
);

app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

// predefined middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get(
  "/",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Hello world.",
      data: {
        name: "Gear up backend API",
        author: "Abdullah Al Mahmud"
      }
    });
  }),
);

// routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/gear_items", gearItemsRouter);
app.use("/api/rental_orders", rentalOrdersRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/review", reviewRouter);

//error handlers
app.use(globalErrorHandler);

export default app;
