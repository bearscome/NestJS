import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { TypeOrmExModule } from "src/typeorm-ex.module";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  exports: [TypeOrmExModule],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
