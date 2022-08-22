import {
  BadRequestException,
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

    if (!findUser) {
      throw new HttpException("회원 정보가 없습니다.", HttpStatus.BAD_REQUEST);
    }

    const validatePassword = await bcrypt.compare(
      user.password,
      findUser.password
    );

    if (!findUser.social_type && !validatePassword) {
      throw new HttpException(
        "비밀번호가 일치하지 않습니다.",
        HttpStatus.BAD_REQUEST
      );
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
      where: { username: payload.username },
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
      gender: "소셜이라 없을수도 있어!",
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

  async deleteUser(userId: any): Promise<Boolean> {
    const { username } = userId;
    return await this.userService.deleteUser(username);
  }

  async updateUser(userInfo: any, body: any): Promise<any> {
    // update의 경우 query를 넘겨주고 있는 것일뿐 entity는 체크하지 않는다.
    // 따라서 update가 아닌 save로 해야한다
    // save(): 데이터가 존재하지 않는다면 insert, 있다면 update
    // save() : If entity does not exist in the database then inserts, otherwise updates.
    // https://do-dam.tistory.com/158?category=747235

    const updateData = {
      ...userInfo,
      ...body,
    };

    const updated = await this.userService.updateUser(updateData);
    const returnUpdateUserInfo = await this.findUser(userInfo);

    return {
      success: updated,
      user: returnUpdateUserInfo,
    };
  }
}
