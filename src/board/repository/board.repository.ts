import { Board } from "src/domain/board.entity";
import { CustomRepository } from "src/typeorm-ex.decorator";
import { Repository } from "typeorm";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {}
