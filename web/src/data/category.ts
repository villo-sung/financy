import type { Transaction } from "./transaction"
import type { User } from "./user"

export enum Color {
  GREEN = "green",
  BLUE = "blue",
  PURPLE = "purple",
  PINK = "pink",
  RED = "red",
  ORANGE = "orange",
  YELLOW = "yellow",
}

export class Category {
  id: string
  title: string
  description: string
  icon: string
  color: Color
  userId: string
  createdAt: Date
  updatedAt: Date
  user: User
  transactions: Transaction[]
  transactionsCount: number
}