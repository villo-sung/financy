import { Field, ObjectType } from "type-graphql";
import { User } from "../../models/user.model";

@ObjectType()
export class RegisterOutput {
  @Field(() => String)
  token!: string

  @Field(() => String)
  refreshToken!: string

  @Field(() => User)
  user!: User
}

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  token!: string

  @Field(() => String)
  refreshToken!: string

  @Field(() => User)
  user!: User
}