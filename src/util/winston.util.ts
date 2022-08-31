import { utilities, WinstonModule } from "nest-winston";
// import * as winstonDaily from "winston-daily-rotate-file";
import * as winston from "winston";

const env = process.env.NODE_ENV;
const winstonDaily = require("winston-daily-rotate-file");
const logDir = `${__dirname}/../../logs`;

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: "YYYY-MM-DD",
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      // level: process.env.NODE_ENV === "production" ? "http" : "silly", // 로그레벨 지정
      // production 환경이라면 http, 개발환경이라면 모든 단계를 로그
      level: "http",
      format:
        env === "production"
          ? winston.format.simple()
          : // production 환경은 자원을 아끼기 위해 simple 포맷 사용
            winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike("NestJS-Auth", { prettyPrint: true }) // nest에서 제공하는 옵션. 로그 가독성을 높여줌
            ),
    }),
    // info, warn, error 로그는 파일로 관리
    new winstonDaily(dailyOptions("info")),
    new winstonDaily(dailyOptions("warn")),
    new winstonDaily(dailyOptions("error")),
  ],
});
