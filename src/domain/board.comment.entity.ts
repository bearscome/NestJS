import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  username: string;

  @Column({ length: 1000 })
  @IsNotEmpty()
  content: string;

  @CreateDateColumn()
  createAt: string;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: string;

  @ManyToOne(() => Board, ({ comments }) => comments)
  @JoinColumn({ name: "board_id" })
  //컬럼명 선언 안할 시 자동으로 선언됨 -> boardBoardId propertyName + referencedColumnName
  board_id: Board;
}
