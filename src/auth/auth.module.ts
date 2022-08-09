import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserRepository } from "./user.repository";
import { TypeOrmExModule } from "src/typeorm-ex.module";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    JwtModule.register({
      secret: "SECRETKEY",
      signOptions: { expiresIn: "3600s" },
    }),
  ],
  exports: [TypeOrmExModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
