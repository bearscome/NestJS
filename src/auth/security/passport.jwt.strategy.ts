import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Payload } from "../payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 'bearer 체계를 사용하여 인증 헤더에서 JWT를 찾는 새 추출기 생성
      ignoreExpiration: true,
      secretOrKey: "SECRET_KEY",
    });
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);
    if (!user) {
      return done(
        new UnauthorizedException({ message: "user does not exit" }),
        false
      );
    }

    return done(null, user);
  }
}
