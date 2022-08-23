import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BoardCommentDTO {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  board_id: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
