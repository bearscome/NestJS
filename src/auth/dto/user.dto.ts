import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class UserDTO {
  id?: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @Column()
  social_type?: string;
}
