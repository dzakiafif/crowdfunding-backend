import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { CommonModule } from "./common/common.module"
import { AuthMiddleware } from "./common/auth/auth.middleware"
import { AuthModule } from "./auth/auth.module"
import { PrismaModule } from "./prisma/prisma.module"
import { UserModule } from "./user/user.module"

@Module({
  imports: [CommonModule, AuthModule, PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "auth/login", method: RequestMethod.POST },
        { path: "auth/register", method: RequestMethod.POST },
      )
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
