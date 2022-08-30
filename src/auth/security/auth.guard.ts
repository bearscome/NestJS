import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard, AuthGuard as NestAuthGuard } from "@nestjs/passport";

@Injectable()
export class CustomAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext): any {
    return super.canActivate(context);
  }
}
