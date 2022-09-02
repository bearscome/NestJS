import { BoardCommentEntity } from "src/domain/board.comment.entity";
import { CustomRepository } from "src/typeorm-ex.decorator";
import { Repository } from "typeorm";

@CustomRepository(BoardCommentEntity)
export class BoardCommentRepository extends Repository<BoardCommentEntity> {}
