import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() //이게 없으면 안되는구나... 엔티티를 통해 자동으로 인서트 되네..?
// 그러면 아까 맥북으로 연결한 localhost가 됬던 이유가 이런 이유였구나..
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    password:string;

    @Column()
    salt:string;

    @Column({type:'date'})
    create_time:string;
}