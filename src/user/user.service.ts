import { PrismaService } from "@app/prisma/prisma.service"
import { BadRequestException, Injectable } from "@nestjs/common"
import { createUserDto } from "./dto/create-user.dto"
import bcrypt from "bcrypt"
import { updateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(req: createUserDto) {
    const checkUser = await this.prismaService.users.findUnique({
      where: {
        email: req.email,
      },
    })

    if (!checkUser)
      throw new BadRequestException(
        `email with ${req.email} has been registered`,
      )

    const user = await this.prismaService.users.create({
      data: {
        email: req.email,
        password: await bcrypt.hash(req.password, 12),
        role: "USER",
        occupation: req.occupation,
      },
    })

    return user
  }

  async updateUser(id: number, req: updateUserDto) {
    const checkUser = await this.prismaService.users.findFirst({
      where: {
        id,
      },
    })

    if (!checkUser) {
      throw new BadRequestException(`id with ${id} not found`)
    }

    const user = await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        name: req.name,
        occupation: req.occupation,
      },
    })

    return user
  }

  async deleteUser(id: number) {
    const checkUser = await this.prismaService.users.findFirst({
      where: {
        id,
      },
    })

    if (!checkUser) {
      throw new BadRequestException(`id with ${id} not found`)
    }

    const user = await this.prismaService.users.delete({
      where: {
        id,
      },
    })

    return user
  }
}
