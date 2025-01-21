import { PrismaService } from "@app/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { loginDto } from "./dto/login.dto";
import { users } from "@prisma/client";
import { registerDto } from "./dto/register.dto";
import { NewUser } from "@app/types";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(req: loginDto): Promise<NewUser> {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: req.email,
      },
      select: { id: true, email: true, role: true, password: true },
    });

    if (!user) {
      throw new BadRequestException(`data with email ${req.email} not found`);
    }

    const checkPassword = await bcrypt.compare(req.password, user.password);
    if (!checkPassword) {
      throw new BadRequestException("password not match");
    }

    const { password, ...newUser } = user;

    const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const userData = {
      ...newUser,
      token: null,
    };

    userData.token = this.jwtService.sign(jwtPayload);

    return userData;
  }

  async register(req: registerDto): Promise<users> {
    const user = await this.prismaService.users.create({
      data: {
        email: req.email,
        password: await bcrypt.hash(req.password, 12),
        name: req.name,
        role: "USER",
      },
    });

    return user;
  }
}
