import { prisma } from "../../lib/prisma";

import slugify from "slugify";

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
      slug: slugify(payload.name, {
        lower: true,
        strict: true,
        trim: true,
      }),
    },
  });

  return category;
};

const getAllCategory = async () => {
  return await prisma.categories.findMany();
};

const getSingleCategory = async (slug: string) => {
  const category = await prisma.categories.findUniqueOrThrow({
    where: {
      slug,
    },
    include: {
      gearItems: true,
    },
  });

  return category;
};

const updateCategory = async (
  slug: string,
  payload: {
    name?: string;
    description?: string | null;
  },
) => {
  const category = await prisma.categories.findFirstOrThrow({
    where: {
      slug,
    },
  });

  const result = await prisma.categories.update({
    where: {
      id: category.id,
    },
    data: payload,
  });

  return result;
};

export const categoryService = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory
};
