import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private jwtService: JwtService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 요청 객체로부터 ip, http method, url, user agent를 받아온 후
    const { ip, method, originalUrl, headers, body } = req;
    const userAgent = req.get("user-agent");
    const toDay = new Date();

    // headers
    const jwtstring = headers["authorization"];
    const getjwt = jwtstring && jwtstring.split("Bearer")[1].trim();
    const userInfo = jwtstring
      ? await this.jwtService.verify(getjwt, {
          secret: "process.env.JWT_ACCESS_TOKEN_SECRET",
        })
      : "";

    // 응답이 끝나는 이벤트가 발생하면 로그를 찍는다.
    res.on("finish", () => {
      const { statusCode } = res;
      this.logger.log(
        `${toDay} ${method} ${originalUrl} ${statusCode} ${ip} ${userAgent} ${userInfo} ${JSON.stringify(
          body
        )}`
      );
    });

    next();
  }
}
