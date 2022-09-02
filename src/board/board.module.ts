import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmExModule } from "src/typeorm-ex.module";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";
import { BoardAnswerRepository } from "./repository/board.answer.repository";
import { BoardCommentRepository } from "./repository/board.comment.repository";
import { BoardRepository } from "./repository/board.repository";

@Module({
  imports: [
    AuthModule,
    TypeOrmExModule.forCustomRepository([
      BoardRepository,
      BoardCommentRepository,
      BoardAnswerRepository,
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
