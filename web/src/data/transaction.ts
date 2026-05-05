import type { Category } from "./category"
import type { User } from "./user"

export enum TransactionType {
  EXPENSE = "EXPENSE",
  REVENUE = "REVENUE",
}

export class Transaction {
  id: string
  description: string
  type: TransactionType
  amount: number
  date: Date
  userId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
  category: Category
  user: User
}