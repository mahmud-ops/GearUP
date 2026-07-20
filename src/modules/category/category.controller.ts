import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await categoryService.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully.",
      data: result,
    });
  },
);

const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategory();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrieved all category successfully.",
      data: result,
    });
  },
);

const getSingleCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;

  if (typeof slug !== "string") {
    throw new Error("Invalid slug");
  }

  const result = await categoryService.getSingleCategory(slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieved successfully.",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;

  if (typeof slug !== "string") throw new Error("Invalid slug");

  const result = await categoryService.updateCategory(slug, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully.",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;

  if (typeof slug !== "string") throw new Error("Invalid slug");

  const result = await categoryService.deleteCategory(slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully.",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
