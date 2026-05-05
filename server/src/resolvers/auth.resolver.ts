import { Arg, Mutation, Resolver } from "type-graphql";

import { LoginInput, RegisterInput } from "../dtos/input/auth.input";
import { LoginOutput, RegisterOutput } from "../dtos/output/auth.output";
import { AuthService } from "../services/auth.service";

@Resolver()
export class AuthResolver {
  constructor(private authService = new AuthService()) { }

  @Mutation(() => LoginOutput)
  async login(
    @Arg("data", () => LoginInput) data: LoginInput
  ) {
    const user = await this.authService.login(data)

    return this.authService.generateTokens(user)
  }

  @Mutation(() => RegisterOutput)
  async register(
    @Arg("data", () => RegisterInput) data: RegisterInput
  ) {
    const user = await this.authService.register(data)

    return this.authService.generateTokens(user)
  }
}