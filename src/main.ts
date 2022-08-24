import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import express from "express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  app.use("/public", express.static(join(__dirname, "..", "public")));
  await app.listen(3000);
}
bootstrap();
