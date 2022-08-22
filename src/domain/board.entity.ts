import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("board")
export class Board {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  borad_id: number;

  @Column({ length: 50 })
  @IsNotEmpty()
  writer: string;

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
}
