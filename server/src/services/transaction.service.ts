import { Prisma } from "@prisma/client"
import { prisma } from "../../prisma/prisma"
import { TransactionInput } from "../dtos/input/transaction.input"
import { TransactionType } from "../models/transaction.model"

export class TransactionService {
  async create(request: TransactionInput, userId: string) {
    return prisma.transaction.create({
      data: {
        description: request.description,
        amountInCents: request.amount * 100,
        date: request.date,
        type: request.type,
        categoryId: request.categoryId,
        userId,
      },
    })
  }

  async findByUserId(
    userId: string,
    skip: number = 0,
    take: number = 10,
    search?: string,
    type?: TransactionType,
    categoryId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const where: Prisma.TransactionWhereInput = {
      userId,
      description: search ? { contains: search } : undefined,
      type,
      categoryId,
      date: (startDate || endDate) ? {
        gte: startDate,
        lte: endDate
      } : undefined
    }

    const [items, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take,
        orderBy: {
          date: 'desc',
        },
        select: {
          id: true,
          description: true,
          amountInCents: true,
          date: true,
          type: true,
          category: {
            select: {
              id: true,
              title: true,
              icon: true,
              color: true,
            },
          },
        },
      }),
      prisma.transaction.count({
        where,
      }),
    ])

    return { items, totalCount }
  }

  async findRecentByUserId(userId: string, take: number = 5) {
    return prisma.transaction.findMany({
      where: { userId },
      take,
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        description: true,
        amountInCents: true,
        date: true,
        type: true,
        category: {
          select: {
            id: true,
            title: true,
            icon: true,
            color: true,
          },
        },
      },
    })
  }

  async calculateTotalAmount(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: {
        amountInCents: true,
        type: true,
      },
    })

    return transactions.reduce((acc, transaction) => transaction.type === TransactionType.REVENUE ? acc + transaction.amountInCents : acc - transaction.amountInCents, 0) / 100
  }

  async calculateMonthExpensesAmount(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
      select: {
        amountInCents: true,
      },
    })

    return transactions.reduce((acc, transaction) => acc + transaction.amountInCents, 0) / 100
  }

  async calculateMonthRevenuesAmount(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: TransactionType.REVENUE,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
      select: {
        amountInCents: true,
      },
    })

    return transactions.reduce((acc, transaction) => acc + transaction.amountInCents, 0) / 100
  }

  async countByUserId(userId: string) {
    return prisma.transaction.count({
      where: { userId },
    })
  }

  async findById(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        description: true,
        amountInCents: true,
        date: true,
        type: true,
        userId: true,
        categoryId: true
      },
    })

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    if (transaction.userId !== userId) {
      throw new Error("You are not the owner of this transaction")
    }

    return transaction
  }

  async update(transactionId: string, request: TransactionInput, userId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    if (transaction.userId !== userId) {
      throw new Error("You are not the owner of this transaction")
    }

    return prisma.transaction.update({
      where: { id: transactionId },
      data: {
        description: request.description,
        amountInCents: request.amount * 100,
        date: request.date,
        type: request.type,
        categoryId: request.categoryId,
      },
    })
  }

  async delete(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    if (transaction.userId !== userId) {
      throw new Error("You are not the owner of this transaction")
    }

    return prisma.transaction.delete({
      where: { id: transactionId },
    })
  }
}