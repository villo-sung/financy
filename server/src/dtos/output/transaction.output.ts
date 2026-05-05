import { Field, Int, ObjectType } from "type-graphql";
import { Transaction } from "../../models/transaction.model";

@ObjectType()
export class TransactionsOutput {
  @Field(() => [Transaction])
  items!: Transaction[]

  @Field(() => Int)
  totalCount!: number
}
