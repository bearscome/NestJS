import {
  HttpException,
  HttpStatus,
  Injectable,
  Redirect,
  UnauthorizedException,
} from "@nestjs/common";
import { UserDTO } from "./dto/user.dto";
import { UserService } from "./user.service";
import * as bcrypt from "bcrypt";
import { User } from "../domain/user.entity";
import { Payload } from "./payload.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async regiseterNewUser(newUser: UserDTO): Promise<UserDTO> {
    let findUser: UserDTO = await this.userService.findByFeilds({
      where: { username: newUser.username },
    });
    if (findUser) {
      throw new HttpException("Username already used", HttpStatus.BAD_REQUEST);
    }

    return this.userService.save(newUser);
  }

  async validateUser(
    user: UserDTO
  ): Promise<{ accessToken: string } | undefined> {
    let findUser: User = await this.userService.findByFeilds({
      where: { username: user.username },
    });

    const validatePassword = await bcrypt.compare(
      user.password,
      findUser.password
    );

    if (!findUser || (!findUser.social_type && !validatePassword)) {
      // 1. 저장된 유저가 없음
      // 2. 소셜타입이 없고(기존 가입 고객이면서) &&  비밀번호가 틀리면
      throw new UnauthorizedException();
    }

    this.convertInAuthorities(findUser);

    const payload: Payload = {
      id: findUser.id,
      username: findUser.username,
      authorities: findUser.authorities,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async tokenValidateUser(payload: Payload): Promise<UserDTO | undefined> {
    const userFind = await this.userService.findByFeilds({
      where: { id: payload.id },
    });
    this.flatAuthorities(userFind);
    return userFind;
  }

  private flatAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: string[] = [];
      user.authorities.forEach((authority) => {
        authorities.push(authority);
      });
      user.authorities = authorities;
    }

    return user;
  }

  private convertInAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach((authority) => {
        authorities.push({ name: authority.authorityName });
      });
      user.authorities = authorities;
    }

    return user;
  }

  async findByProviderIdOrdSave(socialUser: {
    provider: string;
    providerId: string;
  }) {
    const { provider, providerId } = socialUser;

    const user = await this.userService.findByFeilds({
      where: { username: providerId },
    });

    console.warn("there is USER?", user);

    if (user) {
      return user;
    }

    const UserDTO: UserDTO = {
      username: providerId,
      password: providerId,
      social_type: provider,
    };

    return this.regiseterNewUser(UserDTO);
  }

  async findUser(userInfo: {
    id: number;
    username: string;
    authorities: [];
    iat: number;
    exp: number;
  }): Promise<any> {
    const findUser: UserDTO = await this.userService.findByFeilds({
      where: { username: userInfo.username },
    });

    return findUser;
  }

  async socialUserDoLoginOrSave(userData): Promise<string> {
    const user = await this.findByProviderIdOrdSave({ ...userData });
    const jwt = await this.validateUser(user);

    return jwt.accessToken;
  }
}
