import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { envSchema } from "./dto/common.dto";

@Module({
  imports: [
    ConfigModule.forRoot({
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
})
export class CommonModule {}
