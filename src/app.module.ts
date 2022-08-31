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
import * as winston from "winston";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
    BoardModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          // level: process.env.NODE_ENV === "production" ? "info" : "silly", // 로그레벨 지정
          level: "silly",
          format: winston.format.combine(
            winston.format.timestamp(), // 로그 남긴 시각
            nestWinstonModuleUtilities.format.nestLike("MyApp", {
              // 어디에서 로그를남겼는지 네이밍 설정
              prettyPrint: true,
            })
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, NaverStrategy, KakaoStategy],
})
export class AppModule {}
