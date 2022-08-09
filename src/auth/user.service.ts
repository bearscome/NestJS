import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { UserDTO } from "./dto/user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async findByFeilds(
    options: FindOneOptions<UserDTO | undefined>
  ): Promise<UserDTO | undefined> {
    return await this.userRepository.findOne(options);
  }

  async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
    return await this.userRepository.save(userDTO);
  }
}
