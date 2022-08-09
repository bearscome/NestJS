import { Body, Controller, Req, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDTO } from "./dto/user.dto";
import { Response, Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/register")
  async registerAccount(
    @Req() req: Request,
    @Body() userDTO: UserDTO
  ): Promise<any> {
    return await this.authService.regiseterNewUser(userDTO);
  }

  @Post("/login")
  async login(@Body() userDTO: UserDTO): Promise<any> {
    return await this.authService.validateUser(userDTO);
  }
}
