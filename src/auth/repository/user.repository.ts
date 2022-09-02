import { CustomRepository } from "src/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { User } from "../../domain/user.entity";

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
