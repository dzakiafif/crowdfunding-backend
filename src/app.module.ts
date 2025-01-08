import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { AuthMiddleware } from "./common/auth/auth.middleware";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: "auth/login", method: RequestMethod.POST })
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
