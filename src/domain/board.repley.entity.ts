import { IsNotEmpty, IsNumber } from "class-validator";
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Board } from "./board.entity";

@Entity("answer")
export class BoardAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Board, ({ answers }) => answers)
  answer_id: Board;

  @Column()
  @IsNumber()
  step: number;

  @Column()
  @IsNumber()
  indent: number;

  @Column({ length: 50 })
  @IsNotEmpty()
  username: String;

  @Column({ length: 1000 })
  @IsNotEmpty()
  comment: string;

  @CreateDateColumn()
  createAt: string;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: string;
}
