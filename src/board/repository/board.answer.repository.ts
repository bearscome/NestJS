import { BoardAnswer } from "src/domain/board/board.answer.entity";
import { CustomRepository } from "src/typeorm-ex.decorator";
import { Repository } from "typeorm";

@CustomRepository(BoardAnswer)
export class BoardAnswerRepository extends Repository<BoardAnswer> {}
