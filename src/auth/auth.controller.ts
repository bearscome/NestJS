import {
  Body,
  Controller,
  Req,
  Post,
  Res,
  Get,
  UseGuards,
  Headers,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, ResponseData, UserDTO, UserJWT } from "./dto/user.dto";
import { Response, Request } from "express";
import { AuthGuard } from "@nestjs/passport";
// import { RolesGuard } from "./security/roles.guard";
import { Roles } from "./decorator/role.decorator";
import { RoleType } from "./decorator/role-type";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/domain/user.entity";
import { CustomAuthGuard } from "./security/auth.guard";

/**
 * 인증 컨트롤러
 *
 */
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 회원가입 로직
   * username, password, gender값을 이용하여 DB에 저장한다.
   * @param userDTO
   * @returns 회원정볼르 리턴한다.
   */
  @Post("/register")
  async registerAccount(@Body() userDTO: UserDTO): Promise<UserDTO> {
    return await this.authService.regiseterNewUser(userDTO);
  }

  /**
   * 로그인 로직
   * 로그인 정보로 회원을 구별한 뒤 JWT를 리턴한다.
   * @param loginDTO
   * @param res
   * @returns jwt, message, statusCode를 리턴한다.
   */
  @Post("/login")
  async login(
    @Body() loginDTO: LoginDTO,
    @Res() res: Response
  ): Promise<Response<UserJWT>> {
    const jwt = await this.authService.validateUser(loginDTO);
    return res.json({
      ...jwt,
      message: "success",
      statusCode: HttpStatus.OK,
    });
  }

  // @Get("/authenticate")
  // @UseGuards(AuthGuard())
  // isAuthenticated(@Req() req: Request): any {
  //   const user: any = req.user;
  //   return user;
  // }

  // @Get("/admin-role")
  // @UseGuards(AuthGuard(), RolesGuard)
  // @Roles(RoleType.ADMIN)
  // adminRole(@Req() req: Request): any {
  //   const user: any = req.user;
  //   return user;
  // }

  // @Get("/cookies")
  // getcookies(@Req() req: Request, @Res() res: Response): any {
  //   const jwt = req.cookies["jwt"];
  //   return res.send(jwt);
  // }

  // @Post("/logout")
  // logout(@Req() req: Request, @Res() res: Response): any {
  //   res.cookie("jwt", { maxAge: 0 });

  //   return res.send({
  //     message: "succes",
  //   });
  // }

  // @Get("google")
  // @UseGuards(AuthGuard("google"))
  // async googleAuth(): Promise<void> {
  //   // redirect url
  //   console.log("google login");
  // }

  // @Get("google/redirect")
  // @UseGuards(AuthGuard("google"))
  // async googleAuthCallback(
  //   @Req() req: any,
  //   @Res() res: Response
  // ): Promise<Response<UserJWT>> {
  //   const jwtAcessToken = await this.authService.socialUserDoLoginOrSave(
  //     req.user
  //   );

  //   return res.json({
  //     jwtAcessToken,
  //     message: "success",
  //     statusCode: HttpStatus.OK,
  //   });
  // }

  // @Get("naver")
  // @UseGuards(AuthGuard("naver"))
  // async naverAuth(): Promise<void> {
  //   return;
  // }

  // @Get("naver/redirect")
  // @UseGuards(AuthGuard("naver"))
  // async naverAuthCallback(
  //   @Req() req: Request,
  //   @Res() res: Response
  // ): Promise<Response<UserJWT>> {
  //   const jwtAcessToken = await this.authService.socialUserDoLoginOrSave(
  //     req.user
  //   );

  //   return res.json({
  //     jwtAcessToken,
  //     message: "success",
  //     statusCode: HttpStatus.OK,
  //   });
  // }

  // @Get("kakao")
  // @UseGuards(AuthGuard("kakao"))
  // async kakaoAuth(): Promise<void> {
  //   return;
  // }

  // @Get("kakao/redirect")
  // @UseGuards(AuthGuard("kakao"))
  // async kakaoAuthCallback(
  //   @Req() req: Request,
  //   @Res() res: Response
  // ): Promise<Response<UserJWT>> {
  //   const jwtAcessToken = await this.authService.socialUserDoLoginOrSave(
  //     req.user
  //   );

  //   return res.json({
  //     jwtAcessToken,
  //     message: "success",
  //     statusCode: HttpStatus,
  //   });
  // }

  /**
   * 회원 정보 조회 로직
   * JWT를 이용하여 회원을 조회한다.
   * @param headers
   * @returns 회원 정보를 리턴한다.
   */
  @Get("/getUserInfo")
  @UseGuards(CustomAuthGuard)
  async getUserInfo(@Headers() headers: Headers): Promise<User | undefined> {
    const findUser = await this.authService.jwtFindUser(headers);

    return findUser;
  }

  /**
   * 회원 삭제 로직
   * 해당 회원의 JWT를 이용하여 회원 정보를 조회한 뒤 해당 회원을 삭제한다.
   * @param headers
   * @param res
   * @returns message, statusCode를 리턴한다.
   */
  @Post("delete")
  @UseGuards(CustomAuthGuard)
  async deleteUser(
    @Headers() headers: Headers,
    @Res() res: Response
  ): Promise<Response<ResponseData>> {
    const findUser = await this.authService.jwtFindUser(headers);
    const deleteUser = await this.authService.deleteUser(findUser);

    if (deleteUser) {
      return res.json({
        message: "success",
        statusCode: HttpStatus.OK,
      });
    }

    console.log("회원 정보 삭제시켜!");
  }

  /**
   * 회원 정보 업데이트 로직
   * 해당 회원의 JWT를 이용하여 회원 정보를 조회한 뒤 회원 정보를 업데이트 한다.
   *  - 성별만 변경이 가능하다.
   * @param headers
   * @param body
   * @param res
   * @returns 업데이트 된 회원 정보를 리턴한다.
   */
  @Post("update")
  @UseGuards(CustomAuthGuard)
  async updateUser(
    @Headers() headers: Headers,
    @Body() body: { gender: string },
    @Res() res: Response
  ): Promise<Response<{ sucess: string; user: User }>> {
    const { id, username, social_type, gender } =
      await this.authService.jwtFindUser(headers);

    const updateUser = await this.authService.updateUser(username, body.gender);

    if (updateUser.success) {
      return res.json(updateUser);
    }
  }

  /**
   * 회원 권한 ADMIN 변경
   * 회원의 JWT를 이용하여 권한이 USER일 경우 ADMIN으로 변경한다.
   * @param headers
   * @returns message, statusCode를 리턴한다.
   */
  @Post("setadmin")
  @UseGuards(CustomAuthGuard)
  @Roles("USER")
  async setAdmin(@Headers() headers: Headers): Promise<any> {
    const findUser = await this.authService.jwtFindUser(headers);
    const result = await this.authService.setAdmin(findUser);

    if (result) {
      return {
        message: "success",
        statusCode: HttpStatus.OK,
      };
    }
  }
  // 삭제 추가 ->
  // 업데이트 추가 -> 회원정보 추가,
  // filehandle ->
  // 서브파티 -> pg사 [웹앱 -> api -> pg -> api -> 웹앱]
  // pm2 -> 포크, 클러스트형 ->
  // 클러스트형 사용-> 스레드 갯수 만큼 띄어져있음
}
