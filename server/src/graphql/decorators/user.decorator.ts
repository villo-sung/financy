import { createParameterDecorator } from "type-graphql"
import type { GraphQLContext } from "../context"
import { prisma } from "../../../prisma/prisma"

export const GqlUser = () => createParameterDecorator(async ({ context }: { context: GraphQLContext }) => {
  if (!context || !context.userId) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: context.userId,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    console.error(error)
    return null
  }
})