import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BoardCommentEntity } from "./board.comment.entity";
import { BoardAnswer } from "./board.repley.entity";

@Entity("board")
export class Board {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  borad_id: number;
  //OneToMany를 사용하면 PrimaryGeneratedColumn이 외래키가 된다.

  @Column({ length: 50 })
  @IsNotEmpty()
  username: string;

  @Column({ length: 50 })
  @IsNotEmpty()
  title: string;

  @Column({ length: 1000 })
  @IsNotEmpty()
  content: string;

  @CreateDateColumn()
  createAt: string;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: string;

  @OneToMany((type) => BoardCommentEntity, ({ board_id }) => board_id, {
    lazy: true,
  })
  // Eager Loading이란 즉시 로딩이라고 불리우며, 로딩 시 참조해야 하는 정보를 미리 전부 가져옵니다.
  // eager?: boolean;
  // Lazy Loading이란 지연 로딩이라고 불리며, Eager Loading과는 다르게 필요한 순간에만 데이터를 가져옵니다.
  // lazy?: boolean
  comments: BoardCommentEntity[];

  @OneToMany((type) => BoardAnswer, ({ answer_id }) => answer_id)
  answers: BoardAnswer[];
}
