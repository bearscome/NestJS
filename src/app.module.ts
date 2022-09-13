import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ormConfig } from "./orm.config";
import { ConfigModule } from "@nestjs/config";
import { GoogleStrategy } from "./auth/strategy/googleStrategy";
import { NaverStrategy } from "./auth/strategy/naverStrategy";
import { KakaoStategy } from "./auth/strategy/kakaoStrategy";
import { BoardModule } from "./board/board.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { JwtService } from "@nestjs/jwt";
import { EventsModule } from "./events/events.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
    BoardModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GoogleStrategy,
    NaverStrategy,
    KakaoStategy,
    Logger,
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    // 인터셉터 방식은 라우트 핸들러를 지나야해서 잘못된 요청(404 등)은 로그가 찍히지 않았다.
    // (*) = 모든 요청에 대한 기록은 미들웨어서 작성
  }
}
