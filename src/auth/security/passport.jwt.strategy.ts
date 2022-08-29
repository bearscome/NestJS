import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Payload } from "../interface/payload.interface";
import { LoginDTO } from "../dto/user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 'bearer 체계를 사용하여 인증 헤더에서 JWT를 찾는 새 추출기 생성
      ignoreExpiration: true,
      secretOrKey: "process.env.JWT_ACCESS_TOKEN_SECRET",
    });
  }

  async validate(loginDTO: LoginDTO, done: VerifiedCallback): Promise<any> {
    // console.log("여기로 들어와?");
    // const user = await this.authService.test(loginDTO);
    // if (!user) {
    //   return done(
    //     new UnauthorizedException({ message: "JWT에서 팅겼어요..." }),
    //     false
    //   );
    // }

    return done(null, "");
  }
}
