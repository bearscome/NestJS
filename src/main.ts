import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import express from "express";
import { join } from "path";
import { ValidationPipe } from "@nestjs/common";
import { winstonLogger } from "./util/winston.util";
import { IoAdapter } from "@nestjs/platform-socket.io";
// import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: winstonLogger,
  });
  //부트스트래핑 과정(모듈, 프로바이더, 의존성 주입 등을 초기화)에 winston을 적용하려면 NestFactory.create함수에 인스턴스를 전달해야 했다.

  // app.use(cookieParser());
  // 쿠키파서

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // 모든 컨트롤러 벨리데이션 체크, DTO: string -> num

  app.use("/public", express.static(join(__dirname, "..", "public")));
  // client에 imgPath를 넘겨주면, 해당 img Path로 접근 가능

  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // logger 전역 사용

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001);
}
bootstrap();
