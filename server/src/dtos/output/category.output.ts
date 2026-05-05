import { Field, ID, Int, ObjectType } from "type-graphql"
import { Category } from "../../models/category.model"

@ObjectType()
export class CategoryOutput {
  @Field(() => [Category])
  items!: Category[]

  @Field(() => Int)
  totalCategoriesCount!: number

  @Field(() => Int)
  totalTransactionsCount!: number

  @Field(() => Category, { nullable: true })
  mostUsedCategory!: Category
}

@ObjectType()
export class CategorySummaryOutput {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  icon!: string

  @Field(() => String)
  color!: string

  @Field(() => Int)
  transactionsCount!: number

  @Field(() => Number)
  transactionsAmount!: number
}