import { HttpStatus } from "@nestjs/common";
import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { User } from "src/domain/user.entity";
import { NotIn } from "src/testing";
import { Column } from "typeorm";

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  // @NotIn("password", { message: "asdasd" })
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserDTO extends LoginDTO {
  @Column()
  social_type?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/male|female/, { message: "성별 값을 정확히 입력해 주세요." })
  gender: string;
}

export class UserInfo extends User {}

export class Jwt {
  @IsString()
  jwt: string;
}

export class ResponseData {
  @IsString()
  message: string;

  @IsNumber()
  statusCode: HttpStatus;
}

export class UserJWT extends ResponseData {}
