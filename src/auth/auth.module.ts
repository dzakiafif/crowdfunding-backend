import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { PrismaModule } from "@app/prisma/prisma.module"
import { JwtModule } from "@nestjs/jwt"

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
