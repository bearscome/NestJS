import { IsNotEmpty, IsString } from "class-validator";
import { NotIn } from "src/testing";
import { Column } from "typeorm";

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @NotIn("password", { message: "asdasd" })
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Column()
  social_type?: string;
}
