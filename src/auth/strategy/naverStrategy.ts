import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-naver-v2";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
  constructor() {
    super({
      clientID: process.env.OAUTH_NAVER_ID,
      clientSecret: process.env.OAUTH_NAVER_SECRET,
      callbackURL: process.env.OAUTH_NAVER_REDIRECT,
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, provider } = profile;
    return {
      // accessToken,
      // refreshToken,
      provider,
      providerId: id,
    };
  }
}
