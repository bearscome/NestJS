import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth.service";
import { RoleType } from "../decorator/role-type";

@Injectable()
export class RolesGuard implements CanActivate {
  // nestJS의 UseGuards를 사용하기 위해 커스텀 RolesGuard를 생성함
  // CustomAuthGuard에서 유저의 정보가 넘어온 뒤,
  // 해당 유저가 ["ADMIN", "USER"]인지 판단한 후 Boolean값을 리턴함
  constructor(
    private reflector: Reflector,
    // private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      "roles",
      [context.getHandler()]
    );
    //reflector -> roleType에 정의된 setMetaData를 가져온다.

    console.log("requiredRoles", requiredRoles);
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log("users", user);

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.authorities);
  }
}

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const roles = this.reflector.get<string[]>("roles", context.getHandler());

//     if (!roles) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const user = request.user as User;

//     return (
//       user &&
//       user.authorities &&
//       user.authorities.some((role) => {
//         return roles.includes(role.authorityName)
//       })
//     );
//   }
// }
