import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserDTO } from "./dto/user.dto";
import { UserService } from "./user.service";
import * as bcrypt from "bcrypt";
import { User } from "./entity/user.entity";
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

    if (!findUser || !validatePassword) {
      throw new UnauthorizedException();
    }

    const payload: Payload = { id: findUser.id, username: findUser.username };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async tokenValidateUser(payload: Payload): Promise<UserDTO | undefined> {
    return await this.userService.findByFeilds({
      where: { id: payload.id },
    });
  }
}
