import { Module } from "@nestjs/common";
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, NaverStrategy, KakaoStategy],
})
export class AppModule {}
