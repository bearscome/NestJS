import {
  Body,
  Controller,
  Req,
  Post,
  Res,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
  Param,
  Redirect,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDTO } from "./dto/user.dto";
import { Response, Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./security/roles.guard";
import { Roles } from "./decorator/role.decorator";
import { RoleType } from "./role-type";
import { JwtService } from "@nestjs/jwt";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post("/register")
  @UsePipes(ValidationPipe)
  async registerAccount(
    @Req() req: Request,
    @Body() userDTO: UserDTO
  ): Promise<any> {
    return await this.authService.regiseterNewUser(userDTO);
  }

  @Post("/login")
  async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.validateUser(userDTO);
    return res.json({
      jwt: jwt.accessToken,
      message: "success",
      statusCode: HttpStatus.OK,
    });
  }

  @Get("/authenticate")
  @UseGuards(AuthGuard())
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }

  @Get("/admin-role")
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleType.ADMIN)
  adminRole(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }

  @Get("/cookies")
  getcookies(@Req() req: Request, @Res() res: Response): any {
    const jwt = req.cookies["jwt"];
    return res.send(jwt);
  }

  @Post("/logout")
  logout(@Req() req: Request, @Res() res: Response): any {
    res.cookie("jwt", { maxAge: 0 });

    return res.send({
      message: "succes",
    });
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(): Promise<void> {
    // redirect url
    console.log("google login");
  }

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(
    @Req() req: any,
    @Res() res: Response
  ): Promise<any> {
    const jwtAcessToken = await this.authService.socialUserDoLoginOrSave(
      req.user
    );

    return res.json({
      jwtAcessToken,
      message: "success",
      statusCode: HttpStatus.OK,
    });
  }

  @Get("naver")
  @UseGuards(AuthGuard("naver"))
  async naverAuth(): Promise<void> {
    return;
  }

  @Get("naver/redirect")
  @UseGuards(AuthGuard("naver"))
  async naverAuthCallback(@Req() req: any, @Res() res: Response): Promise<any> {
    const jwtAcessToken = await this.authService.socialUserDoLoginOrSave(
      req.user
    );

    return res.json({
      jwtAcessToken,
      message: "success",
      statusCode: HttpStatus.OK,
    });
  }

  @Get("kakao")
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuth(): Promise<void> {
    return;
  }

  @Get("kakao/redirect")
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuthCallback(@Req() req: any, @Res() res: Response): Promise<any> {
    const jwtAcessToken = await this.authService.socialUserDoLoginOrSave(
      req.user
    );

    return res.json({
      jwtAcessToken,
      message: "success",
      statusCode: HttpStatus,
    });
  }

  @Get("/getUserInfo")
  @UseGuards(AuthGuard("jwt"))
  async getUserInfo(@Headers() headers: any): Promise<any> {
    const jwtstring = headers.authorization.split("Bearer ")[1];
    const userInfo = await this.jwtService.verify(jwtstring);
    const findUser = await this.authService.findUser(userInfo);

    console.log(headers.authorization, jwtstring, userInfo, findUser);

    return findUser;
  }

  @Post("delete")
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard("jwt"))
  async deleteUser(
    @Headers() headers: any,
    @Res() res: Response
  ): Promise<any> {
    const jwtstring = headers.authorization.split("Bearer ")[1];
    const userInfo = await this.jwtService.verify(jwtstring);
    const findUser = await this.authService.findUser(userInfo);

    const deleteUser = await this.authService.deleteUser(findUser);
    if (deleteUser) {
      return res.json({
        message: "success",
        statusCode: HttpStatus.OK,
      });
    }

    console.log("회원 정보 삭제시켜!");
  }

  @Post("update")
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard("jwt"))
  async updateUser(
    @Headers() headers: any,
    @Body() body: any,
    @Res() res: Response
  ) {
    const jwtstring = headers.authorization.split("Bearer ")[1];
    const userInfo = await this.jwtService.verify(jwtstring);
    const findUser = await this.authService.findUser(userInfo);

    const updateUser = await this.authService.updateUser(findUser, body);

    console.warn("updateUser", updateUser);

    if (updateUser.success) {
      return res.json(updateUser);
    }
  }

  // 삭제 추가 ->
  // 업데이트 추가 -> 회원정보 추가,
  // filehandle ->
  // 서브파티 -> pg사 [웹앱 -> api -> pg -> api -> 웹앱]
  // pm2 -> 포크, 클러스트형 ->
  // 클러스트형 사용-> 스레드 갯수 만큼 띄어져있음
}
