import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import express from "express";
import { join } from "path";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.use(cookieParser());
  // 쿠키파서

  app.useGlobalPipes(new ValidationPipe());
  // 모든 컨트롤러 벨리데이션 체크

  app.use("/public", express.static(join(__dirname, "..", "public")));
  // client에 imgPath를 넘겨주면, 해당 img Path로 접근 가능

  await app.listen(3000);
}
bootstrap();
