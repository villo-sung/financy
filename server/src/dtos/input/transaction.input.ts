import { Field, InputType, Int } from "type-graphql"
import { TransactionType } from "../../models/transaction.model"

@InputType()
export class TransactionInput {
  @Field(() => String)
  description!: string

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => Number)
  amount!: number

  @Field(() => Date)
  date!: Date

  @Field(() => String)
  categoryId!: string
}