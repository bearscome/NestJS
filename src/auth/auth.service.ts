import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
    // 평문을 bscripto로 변경하여 확인
  }

  async login(user: any) {
    const { username, userId } = user;
    const payload = { username, sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
