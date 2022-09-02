import { Transform, Type } from "class-transformer";
import { IsNumber, IsString, MaxLength } from "class-validator";
import { Board } from "src/domain/board.entity";

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
  username: string;
  image_path?: string;
}

export class UpdateBoardDTO extends BoardDTO {
  @IsString()
  id: string;
}

export class GetHistoryBoardDTO {
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @Type(() => Number)
  offset: number;
}

export class BoardResponseStatus {
  @IsNumber()
  status: number;

  @IsString()
  message: string;
}

export class BoardHistroy extends BoardResponseStatus {
  total: number;
  list: Board;
}

export class SearchHistoryDTO extends GetHistoryBoardDTO {
  searchType: string;
  searchContent: string;
}
