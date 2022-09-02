import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-kakao";

@Injectable()
export class KakaoStategy extends PassportStrategy(Strategy, "kakao") {
  constructor() {
    super({
      clientID: process.env.OAUTH_KAKAO_ID,
      callbackURL: process.env.OAUTH_KAKAO_REDIRECT,
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, provider } = profile;
    return {
      // accessToken,
      // refreshToken,
      provider,
      providerId: "" + id,
    };
  }
}
