import { Field, GraphQLISODateTime, ID, Int, ObjectType } from "type-graphql"
import { Transaction } from "./transaction.model"
import { User } from "./user.model"


@ObjectType()
export class Category {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  description!: string

  @Field(() => String)
  icon!: string

  @Field(() => String)
  color!: string

  @Field(() => ID)
  userId!: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field(() => User)
  user!: User

  @Field(() => [Transaction])
  transactions!: Transaction[]

  @Field(() => Int)
  transactionsCount!: number

  @Field(() => Number)
  transactionsAmount!: number
}