import { NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req?.headers["Authorization"];

    if (token) {
      const user = this.jwtService.verify(req.headers);
      console.log(user);
    }

    next();
  }
}
