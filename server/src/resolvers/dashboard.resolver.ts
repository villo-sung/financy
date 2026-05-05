import { FieldResolver, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";
import { DashboardOutput } from "../dtos/output/dashboard.output";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { CategoryService } from "../services/category.service";
import { TransactionService } from "../services/transaction.service";

@Resolver(() => DashboardOutput)
@UseMiddleware(isAuthenticated)
export class DashboardResolver {
  constructor(
    private categoryService = new CategoryService(),
    private transactionService = new TransactionService()
  ) { }

  @Query(() => DashboardOutput)
  async dashboard(@GqlUser() user: User) {
    const recentTransactions = await this.transactionService.findRecentByUserId(user.id)
    const categories = await this.categoryService.findByUserId(user.id)
    const totalAmount = await this.transactionService.calculateTotalAmount(user.id)
    const monthExpensesAmount = await this.transactionService.calculateMonthExpensesAmount(user.id)
    const monthRevenuesAmount = await this.transactionService.calculateMonthRevenuesAmount(user.id)

    return {
      recentTransactions,
      categories,
      totalAmount,
      monthExpensesAmount,
      monthRevenuesAmount
    }
  }
}