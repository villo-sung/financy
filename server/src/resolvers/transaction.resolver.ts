import { Arg, FieldResolver, GraphQLISODateTime, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql"
import { Transaction, TransactionType } from "../models/transaction.model"
import { isAuthenticated } from "../middlewares/auth.middleware"
import { GqlUser } from "../graphql/decorators/user.decorator"
import type { User } from "../models/user.model"
import { TransactionInput } from "../dtos/input/transaction.input"
import { TransactionService } from "../services/transaction.service"
import { TransactionsOutput } from "../dtos/output/transaction.output"
import { Int } from "type-graphql"

@Resolver(() => Transaction)
@UseMiddleware(isAuthenticated)
export class TransactionResolver {
  constructor(private transactionService = new TransactionService()) { }

  @FieldResolver(() => Number)
  amount(@Root() transaction: Transaction) {
    return transaction.amountInCents / 100
  }

  @Mutation(() => Transaction)
  async createTransaction(@Arg("request", () => TransactionInput) request: TransactionInput, @GqlUser() user: User) {
    return this.transactionService.create(request, user.id)
  }

  @Query(() => TransactionsOutput)
  async transactions(
    @GqlUser() user: User,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("pageSize", () => Int, { defaultValue: 10 }) pageSize: number,
    @Arg("search", () => String, { nullable: true }) search?: string,
    @Arg("type", () => TransactionType, { nullable: true }) type?: TransactionType,
    @Arg("categoryId", () => String, { nullable: true }) categoryId?: string,
    @Arg("startDate", () => GraphQLISODateTime, { nullable: true }) startDate?: Date,
    @Arg("endDate", () => GraphQLISODateTime, { nullable: true }) endDate?: Date
  ) {
    const skip = (page - 1) * pageSize
    return this.transactionService.findByUserId(user.id, skip, pageSize, search, type, categoryId, startDate, endDate)
  }

  @Query(() => Transaction)
  async transaction(@Arg("transactionId", () => String) transactionId: string, @GqlUser() user: User) {
    return this.transactionService.findById(transactionId, user.id)
  }

  @Mutation(() => Transaction)
  async updateTransaction(@Arg("transactionId", () => String) transactionId: string, @Arg("request", () => TransactionInput) request: TransactionInput, @GqlUser() user: User) {
    return this.transactionService.update(transactionId, request, user.id)
  }

  @Mutation(() => Transaction)
  async deleteTransaction(@Arg("transactionId", () => String) transactionId: string, @GqlUser() user: User) {
    return this.transactionService.delete(transactionId, user.id)
  }
}