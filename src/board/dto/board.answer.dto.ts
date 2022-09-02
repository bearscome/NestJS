import { Type } from "class-transformer";
import { IsNumber, IsString, MaxLength } from "class-validator";
import { BoardDTO } from "./board.dto";

export class BoardAnswerDTO extends BoardDTO {
  @IsNumber()
  @Type(() => Number)
  board_id: number;

  @IsNumber()
  @Type(() => Number)
  indent: number;
}

export class BoardAnswerAddDTD extends BoardAnswerDTO {
  @IsString()
  username: string;

  image_path?: string;
}
