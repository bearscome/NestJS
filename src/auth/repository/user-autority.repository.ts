import { CustomRepository } from "src/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { UserAuthority } from "../entity/user-authority.entity";

@CustomRepository(UserAuthority)
export class UserAuthorityRepository extends Repository<UserAuthority> {}
