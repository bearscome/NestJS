import { NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/auth/commonService/user.service";

export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req?.headers["Authorization"];

    console.log("여기로 안넘어와???", token);

    if (token) {
      const user = this.jwtService.verify(req.headers);
      console.log(user);
    }

    next();
  }
}
