import { IsNotEmpty, IsString, Matches } from "class-validator";
import { NotIn } from "src/testing";
import { Column } from "typeorm";

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  // @NotIn("password", { message: "asdasd" })
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Column()
  social_type?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/male|female/, { message: "성별 값을 정확히 입력해 주세요." })
  gender: string;
}
