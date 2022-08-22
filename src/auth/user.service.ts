import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { UserDTO } from "./dto/user.dto";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcrypt";
import { User } from "../domain/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async findByFeilds(
    options: FindOneOptions<UserDTO>
  ): Promise<User | undefined> {
    return await this.userRepository.findOne(options);
  }

  async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
    await this.transformPassword(userDTO);
    console.log(userDTO);
    return await this.userRepository.save(userDTO);
  }

  async transformPassword(user: UserDTO): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);
    return Promise.resolve();
  }

  async deleteUser(username: string): Promise<boolean> {
    await this.userRepository.delete({ username });
    return true;
  }

  async updateUser(updateInfo: any): Promise<any> {
    await this.userRepository.save(updateInfo);
    return true;
  }
}
