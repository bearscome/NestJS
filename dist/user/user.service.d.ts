import { Repository } from 'typeorm';
import { User } from './entity/uset.entities';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    create(user: User): Promise<void>;
    remove(id: number): Promise<void>;
}
