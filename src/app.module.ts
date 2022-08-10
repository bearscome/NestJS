import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserAuthority } from "./auth/entity/user-authority.entity";
import { User } from "./auth/entity/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "login-lecture.ci1vjtewuuio.ap-northeast-2.rds.amazonaws.com",
      port: 3306,
      username: "admin",
      password: "qwe123qwe",
      database: "test",
      entities: [User, UserAuthority],
      // synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
