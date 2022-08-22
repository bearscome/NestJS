import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserRepository } from "./user.repository";
import { TypeOrmExModule } from "src/typeorm-ex.module";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./security/passport.jwt.strategy";
import { UserAuthorityRepository } from "./repository/user-autority.repository";
import { BoardRepository } from "./board.repository";
import { BoardCommentRepository } from "./board.comment.repository";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      UserAuthorityRepository,
      BoardRepository,
      BoardCommentRepository,
    ]),
    JwtModule.register({
      secret: "process.env.JWT_ACCESS_TOKEN_SECRET",
      signOptions: {
        expiresIn: "3600s",
      },
    }),
    PassportModule.register({ defaultStrategy: "jwt" }), // https://velog.io/@wanzekim/ERROR-ExceptionHandler-metatype-is-not-a-constructor
  ],
  exports: [TypeOrmExModule, AuthService],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
