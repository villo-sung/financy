import { Arg, Query, Resolver, UseMiddleware } from "type-graphql"

import { User } from "../models/user.model"
import { isAuthenticated } from "../middlewares/auth.middleware"

import { UserService } from "../services/user.service"

@Resolver(() => User)
@UseMiddleware(isAuthenticated)
export class UserResolver {
  constructor(private userService = new UserService()) { }

  @Query(() => User)
  async getById(@Arg("id", () => String) id: string) {
    return this.userService.findById(id)
  }
}