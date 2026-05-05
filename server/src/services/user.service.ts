import { prisma } from "../../prisma/prisma"

export class UserService {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    })
  }
}