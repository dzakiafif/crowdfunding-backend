import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { envSchema } from "./dto/common.dto"
import { AuthService } from "@app/auth/auth.service"
import { PrismaService } from "@app/prisma/prisma.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      validate: envSchema.parse,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: `${configService.get<string>("JWT_EXPIRESIN")}s`,
        },
      }),
    }),
  ],
  providers: [AuthService, PrismaService],
})
export class CommonModule {}
