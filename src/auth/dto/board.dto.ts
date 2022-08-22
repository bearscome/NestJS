import { IsString, MaxLength } from "class-validator";

export class BoardDTO {
  @IsString()
  @MaxLength(50)
  title: string;

  @IsString()
  @MaxLength(1000)
  content: string;
}

export class CreateBoardDTO extends BoardDTO {
  @IsString()
  @MaxLength(50)
  writer: string;
}
