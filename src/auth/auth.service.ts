import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserDTO } from "./dto/user.dto";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async regiseterNewUser(newUser: UserDTO): Promise<UserDTO> {
    let findUser: UserDTO = await this.userService.findByFeilds({
      where: { username: newUser.username },
    });
    if (findUser) {
      throw new HttpException("Username already used", HttpStatus.BAD_REQUEST);
    }

    return this.userService.save(newUser);
  }
}
