import { PrismaService } from "@app/prisma/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { loginDto } from "./dto/login.dto";
import { users } from "@prisma/client";
import { registerDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(req: loginDto): Promise<users> {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: req.email,
      },
    });

    if (!user) {
      throw new HttpException(
        `data with email ${req.email} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkPassword = await bcrypt.compare(req.password, user.password);
    if (!checkPassword) {
      throw new HttpException("password not match", HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async register(req: registerDto): Promise<users> {
    const user = await this.prismaService.users.create({
      data: {
        email: req.email,
        password: await bcrypt.hash(req.email, 12),
        name: req.name,
      },
    });

    return user;
  }
}
