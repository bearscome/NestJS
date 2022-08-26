import { IsNotEmpty, IsNumber, IsString } from "class-validator";
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
import { BoardAnswer } from "./board/board.answer.entity";

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

  @Column({ nullable: true })
  image_path?: string;

  @OneToMany((type) => BoardCommentEntity, ({ board_id }) => board_id, {
    lazy: true,
  })
  // Eager Loading이란 즉시 로딩이라고 불리우며, 로딩 시 참조해야 하는 정보를 미리 전부 가져옵니다.
  // eager?: boolean;
  // Lazy Loading이란 지연 로딩이라고 불리며, Eager Loading과는 다르게 필요한 순간에만 데이터를 가져옵니다.
  // lazy?: boolean
  // https://tristy.tistory.com/36
  comments: BoardCommentEntity[];

  // 답변글 분리하려고 했으나, 계층형을 한 번 만들어보자
  // @OneToMany((type) => BoardAnswer, ({ group_id }) => group_id, {
  //   eager: true,
  // })
  // answers: BoardAnswer[];

  @Column()
  @IsNumber()
  @IsNotEmpty()
  ref: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  orderby: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  indent: number;
}
