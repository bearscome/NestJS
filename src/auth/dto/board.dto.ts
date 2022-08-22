import { Transform, Type } from "class-transformer";
import { IsNumber, IsString, MaxLength } from "class-validator";

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

export class UpdateBoardDTO extends BoardDTO {
  @IsString()
  id: string;
}

export class GetHistoryBoardDTO {
  @IsNumber()
  @Type(() => Number)
  limit:number;

  @IsNumber()
  @Type(() => Number)
  offset:number;
}
