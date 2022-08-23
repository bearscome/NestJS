import { IsNumber, IsString, MaxLength } from "class-validator";

export class BoardAnswerDTO {
  @IsNumber()
  group_id: number;

  @IsString()
  @MaxLength(1000)
  content: string;

  @IsNumber()
  step: number;

  @IsNumber()
  indent: number;
}

export class BoardAnswerAddDTD extends BoardAnswerDTO {
  @IsString()
  username: string;
}
