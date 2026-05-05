import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql"
import { Category } from "../models/category.model"
import { isAuthenticated } from "../middlewares/auth.middleware"
import { GqlUser } from "../graphql/decorators/user.decorator"
import type { User } from "../models/user.model"
import { CategoryInput } from "../dtos/input/category.input"
import { CategoryService } from "../services/category.service"
import { TransactionService } from "../services/transaction.service"
import { CategoryOutput } from "../dtos/output/category.output"

@Resolver(() => Category)
@UseMiddleware(isAuthenticated)
export class CategoryResolver {
  constructor(
    private categoryService = new CategoryService(),
    private transactionService = new TransactionService()
  ) { }

  @FieldResolver(() => Int)
  transactionsCount(@Root() category: any) {
    return category.transactionsCount ?? category._count?.transactions ?? 0
  }

  @FieldResolver(() => Number)
  transactionsAmount(@Root() category: Category) {
    if (!category.transactions) return 0
    return category.transactions.reduce((acc: number, t: any) => acc + t.amountInCents, 0) / 100
  }

  @Query(() => CategoryOutput)
  async categories(@GqlUser() user: User) {
    const items = await this.categoryService.findByUserId(user.id)
    const totalCategoriesCount = await this.categoryService.countByUserId(user.id)
    const totalTransactionsCount = await this.transactionService.countByUserId(user.id)
    const mostUsedCategory = await this.categoryService.findMostUsedCategory(user.id)

    return {
      items,
      totalCategoriesCount,
      totalTransactionsCount,
      mostUsedCategory
    }
  }

  @Mutation(() => Category)
  async createCategory(@Arg("request", () => CategoryInput) request: CategoryInput, @GqlUser() user: User) {
    return this.categoryService.create(request, user.id)
  }

  @Query(() => Category)
  async category(@Arg("categoryId", () => String) categoryId: string, @GqlUser() user: User) {
    return this.categoryService.findById(categoryId, user.id)
  }

  @Mutation(() => Category)
  async updateCategory(@Arg("categoryId", () => String) categoryId: string, @Arg("request", () => CategoryInput) request: CategoryInput, @GqlUser() user: User) {
    return this.categoryService.update(categoryId, request, user.id)
  }

  @Mutation(() => Category)
  async deleteCategory(@Arg("categoryId", () => String) categoryId: string, @GqlUser() user: User) {
    return this.categoryService.delete(categoryId, user.id)
  }
}