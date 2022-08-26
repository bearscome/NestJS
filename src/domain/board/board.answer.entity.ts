import { IsNotEmpty, IsNumber } from "class-validator";
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Board } from "../board.entity";

@Entity("answer")
export class BoardAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  step: number;

  @Column()
  @IsNotEmpty()
  indent: number;

  @Column({ length: 50 })
  @IsNotEmpty()
  username: String;

  @Column({ length: 1000 })
  @IsNotEmpty()
  content: string;

  @CreateDateColumn()
  createAt: string;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: string;

  // @ManyToOne((type) => Board, ({ answers }) => answers)
  // @JoinColumn({ name: "group_id" })
  // group_id: Board;
}
