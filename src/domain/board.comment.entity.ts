import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Board } from "./board.entity";

@Entity("boardComment")
export class BoardCommentEntity {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  comment_id: number;

  @Column({ length: 50 })
  @IsNotEmpty()
  writer: string;

  @Column({ length: 1000 })
  @IsNotEmpty()
  comment: string;

  @CreateDateColumn()
  createAt: string;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: string;

  @ManyToOne((type) => Board, ({ comments }) => comments)
  board_id: Board;
}
