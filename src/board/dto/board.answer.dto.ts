import { Type } from "class-transformer";
import { IsNumber, IsString, MaxLength } from "class-validator";

export class BoardAnswerDTO {
  @IsNumber()
  @Type(() => Number)
  board_id: number;

  @IsString()
  title: string;

  @IsString()
  @MaxLength(1000)
  content: string;

  @IsNumber()
  @Type(() => Number)
  indent: number;
}

export class BoardAnswerAddDTD extends BoardAnswerDTO {
  @IsString()
  username: string;

  image_path?: string;
}
