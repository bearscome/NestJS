import { IsNotEmpty } from "class-validator";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserAuthority } from "./user-authority.entity";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column()
  @IsNotEmpty()
  username: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => UserAuthority, (userAuthority) => userAuthority.user, {
    eager: true,
  })
  authorities?: any[];

  @Column()
  social_type: string;

  @IsNotEmpty()
  @Column()
  gender: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: Date;
}
