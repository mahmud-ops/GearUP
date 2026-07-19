import { prisma } from "../../lib/prisma";

const createCategory = async (payload: {
  name: string;
  description?: string | null;
}) => {
  const isCategoryExist = await prisma.categories.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (isCategoryExist) {
    throw new Error("Category already exists.");
  }

  const category = await prisma.categories.create({
    data: {
      name: payload.name,
      description: payload.description ?? null,
    },
  });

  return category;
};

export const categoryService = {
  createCategory,
};
