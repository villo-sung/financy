import { Field, ObjectType } from "type-graphql";
import { Transaction } from "../../models/transaction.model";
import { Category } from "../../models/category.model";

@ObjectType()
export class DashboardOutput {
  @Field(() => Number)
  totalAmount!: number

  @Field(() => Number)
  monthExpensesAmount!: number

  @Field(() => Number)
  monthRevenuesAmount!: number

  @Field(() => [Transaction])
  recentTransactions!: Transaction[]

  @Field(() => [Category])
  categories!: Category[]
}