import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/uset.entities';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>
    ){}

    findAll():Promise<User[]> {
        return this.userRepository.find()
    }

    // findOne(id:number):Promise<User> {
    //     return this.userRepository.findOne(id);
    // }

    async create(user:User):Promise<void> {
        await this.userRepository.save(user);
    }

   async remove(id:number):Promise<void> {
    await this.userRepository.delete(id);
   }
}
