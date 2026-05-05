import { prisma } from "../../prisma/prisma"
import { CategoryInput } from "../dtos/input/category.input"

export class CategoryService {
  async create(request: CategoryInput, userId: string) {
    return prisma.category.create({
      data: {
        ...request,
        userId,
      },
    })
  }

  async findById(categoryId: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: { userId, id: categoryId },
      include: {
        transactions: {
          select: {
            amountInCents: true,
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    })

    if (!category) {
      throw new Error("Category not found")
    }

    if (category.userId !== userId) {
      throw new Error("You are not the owner of this category")
    }

    return category
  }

  async findByUserId(userId: string) {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: {
        transactions: {
          _count: 'desc',
        },
      },
      include: {
        transactions: {
          select: {
            amountInCents: true,
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    })

    return categories
  }

  async countByUserId(userId: string) {
    return prisma.category.count({
      where: { userId },
    })
  }

  async findMostUsedCategory(userId: string) {
    return prisma.category.findFirst({
      where: { userId },
      include: {
        transactions: {
          select: {
            amountInCents: true,
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: {
        transactions: {
          _count: 'desc',
        },
      },
    })
  }

  async update(categoryId: string, request: CategoryInput, userId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw new Error("Category not found")
    }

    if (category.userId !== userId) {
      throw new Error("You are not the owner of this category")
    }

    return prisma.category.update({
      where: { id: categoryId },
      data: {
        ...request,
      },
    })
  }

  async delete(categoryId: string, userId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw new Error("Category not found")
    }

    if (category.userId !== userId) {
      throw new Error("You are not the owner of this category")
    }

    return prisma.category.delete({
      where: { id: categoryId },
    })
  }
}