import type { LoginInput, RegisterInput } from "../dtos/input/auth.input"
import { prisma } from "../../prisma/prisma"
import { comparePassword, hashPassword } from "../utils/hash"
import type { User } from "../models/user.model"
import { signJwt, verifyJwt } from "../utils/jwt"

export class AuthService {
  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    let isPasswordValid = false

    if (user.password) {
      isPasswordValid = await comparePassword(data.password, user.password)
    }

    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }

    return user
  }

  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (existingUser) {
      throw new Error("User already exists")
    }

    const hashedPassword = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })

    return user
  }

  generateTokens(user: User) {
    const token = signJwt(
      {
        id: user.id,
        email: user.email,
      },
      "15m"
    )

    const refreshToken = signJwt(
      {
        id: user.id,
        email: user.email,
      },
      "1d"
    )

    return {
      token,
      refreshToken,
      user,
    }
  }
}