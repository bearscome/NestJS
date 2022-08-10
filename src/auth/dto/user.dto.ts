import { IsNotEmpty } from "class-validator";

export class UserDTO {
  id?: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
