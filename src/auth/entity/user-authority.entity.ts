import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("user_authority")
export class UserAuthority {
  @PrimaryColumn()
  id: number;

  @Column("int", { name: "authority_name" })
  userId: number;

  @Column("varchar", { name: "authority_name" })
  authorityName: string;
}
