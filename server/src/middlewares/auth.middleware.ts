import { MiddlewareFn } from "type-graphql";
import { GraphQLContext } from "../graphql/context";

export const isAuthenticated: MiddlewareFn<GraphQLContext> = ({ context }, next) => {
  if (!context.userId) {
    throw new Error("Unauthorized")
  }

  return next()
}