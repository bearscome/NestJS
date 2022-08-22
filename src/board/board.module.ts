import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";

@Module({
  imports: [AuthModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
