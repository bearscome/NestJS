import { IsNotEmpty } from "class-validator";
import { RoleType } from "src/auth/decorator/role-type";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  username: string;

  @Column()
  @IsNotEmpty()
  password: string;

  // @OneToMany(() => UserAuthority, (userAuthority) => userAuthority.user)
  // authorities: any[];
  @Column({ default: "USER" })
  authorities: string;

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
