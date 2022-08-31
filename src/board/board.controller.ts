import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Res,
  Get,
  Query,
  DefaultValuePipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthService } from "src/auth/auth.service";
import { BoardCommentDTO } from "src/board/dto/board.comment.dto";
import {
  BoardDTO,
  CreateBoardDTO,
  UpdateBoardDTO,
} from "src/board/dto/board.dto";
import { ResponseData } from "src/auth/dto/user.dto";
import { BoardService } from "./board.service";
import { BoardAnswerAddDTD, BoardAnswerDTO } from "./dto/board.answer.dto";
import { CustomAuthGuard } from "src/auth/security/auth.guard";
import { Roles } from "src/auth/decorator/role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/security/roles.guard";
import { Logger as WinstonLogger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Controller("board")
export class BoardController {
  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger
  ) {}

  private printWinston(type: string, result: any): void {
    switch (type) {
      case "error":
        this.logger.error("error: ", result);
        break;
      case "warn":
        this.logger.warn("warn: ", result);
        break;
      case "info":
      case "response":
      case "request":
        this.logger.info("info: ", result);
        break;
      case "http":
        this.logger.http("http: ", result);
        break;
      case "verbose":
        this.logger.verbose("verbose: ", result);
        break;
      case "debug":
        this.logger.debug("debug: ", result);
        break;
      case "silly":
        this.logger.silly("silly: ", result);
        break;
      default:
        this.logger.info("정의되지 않은 타입: ", result);
        break;
    }
  }

  @Post("/create")
  @UseGuards(CustomAuthGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      // dest: "public",
      storage: diskStorage({
        destination: "./public",
        filename(req, file, callback) {
          const uniqId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          const filename = `${uniqId}${ext}`;
          callback(null, filename);
        },
      }),
    })
  )
  async createBoard(
    @Headers() header: Headers,
    @Body() boardDTO: BoardDTO,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Response<ResponseData>> {
    const findUser = await this.authService.jwtFindUser(header);
    const { username } = findUser; // 회원 아이디, 회원 primaryKey
    const { title, content } = boardDTO;
    // const { path, filename } = file && file;

    const data: CreateBoardDTO = {
      username,
      title,
      content,
      image_path: file ? file?.path : null,
    };

    this.printWinston("request", data);

    try {
      return await this.boardService.createBoard(data).then(() => {
        this.printWinston("response", data);
        return res.json({ message: "success", statusCode: HttpStatus.CREATED });
      });
    } catch (err) {
      this.printWinston("error", err);
      return res.json({
        message: "fail",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Post("/delete")
  @UseGuards(CustomAuthGuard)
  async deleteBoard(
    @Body("id", ParseIntPipe) board_id: number,
    @Res() res: Response
  ): Promise<Response<ResponseData>> {
    // 게시글 삭제

    this.printWinston("request", board_id);

    try {
      const reulst = await this.boardService.deleteBoard(board_id).then((r) => {
        if (r.status === 4000) {
          this.printWinston("response", { board_id, message: r.message });
          return {
            message: r.message,
            statusCode: HttpStatus.ACCEPTED,
          };
        } else if (r.status === 4001) {
          this.printWinston("error", { board_id, message: r.message });
          return {
            message: r.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        } else {
          this.printWinston("error", { board_id, message: r.message });
          return {
            message: r.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        }
      });

      return res.json(reulst);
    } catch (err) {
      this.printWinston("error", { board_id, err });
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("/update")
  @UseGuards(CustomAuthGuard)
  async updateBoard(@Body() updateBoardDTO: UpdateBoardDTO) {
    // 게시글 업데이트
    this.printWinston("request", updateBoardDTO);

    try {
      const result = await this.boardService
        .updateBoard(updateBoardDTO)
        .then((r) => {
          if (r.status === 4000) {
            this.printWinston("response", {
              updateBoardDTO,
              message: r.message,
            });
            return {
              ...r,
              statusCode: HttpStatus.ACCEPTED,
            };
          } else if (r.status === 4001) {
            this.printWinston("error", { updateBoardDTO, message: r.message });
            return {
              ...r,
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
          } else {
            this.printWinston("error", { updateBoardDTO, message: r.message });
            return {
              ...r,
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
          }
        });

      return result;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("history")
  // query로 넘어올 시 스트링으로 들어오나, Validation안에 있는 transform을 true로 변경한 뒤,
  // DTO에서 @Type(() => Number)로 수정하면 넘버형으로 변견된다
  // async findAll(@Query() getHistory:GetHistoryBoardDTO) {
  // const { offset, limit } = getHistory;
  async findAll(
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    this.printWinston("request", { offset, limit });
    return await this.boardService.history({ offset, limit });
  }

  @Get("histroy/detail")
  async findOne(@Query("id", ParseIntPipe) id: number) {
    this.printWinston("request", id);
    return await this.boardService.findBoard(id);
  }

  @Post("history/comment")
  @UseGuards(CustomAuthGuard)
  async addComment(
    @Headers() header: any,
    @Body() boardCommentDTO: BoardCommentDTO
  ) {
    const findUser = await this.authService.jwtFindUser(header);
    const { username } = findUser;
    const { board_id, content } = boardCommentDTO;

    const inserData = {
      username,
      board_id,
      content,
    };

    this.printWinston("request", inserData);

    return await this.boardService.addComment(inserData);
  }

  @Post("answer/create")
  @UseGuards(CustomAuthGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public",
        filename(req, file, callback) {
          const uniqId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          const filename = `${uniqId}${ext}`;
          callback(null, filename);
        },
      }),
    })
  )
  async createAnser(
    @Headers() header: any,
    @Body() boardAnswerDTO: BoardAnswerAddDTD,
    @UploadedFile() file: any,
    @Res() res: Response
  ): Promise<any> {
    const findUser = await this.authService.jwtFindUser(header);
    const { username } = findUser;

    const addData: BoardAnswerAddDTD = {
      username,
      image_path: file ? file?.path : null,
      ...boardAnswerDTO,
    };

    this.printWinston("request", addData);

    return await this.boardService
      .addAnswer(addData)
      .then(() => {
        res.json({ message: "success", statusCode: HttpStatus.CREATED });
      })
      .catch(() => {
        res.json({
          message: "fail",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      });
  }

  @Post("deleteAll")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteAll(@Res() res: Response) {
    this.printWinston("request", "deleteAll");
    const result = await this.boardService.deleteBoardAll();

    if (result) {
      this.printWinston("response", "성공");
      res.json({
        message: "success",
        statusCode: HttpStatus.CREATED,
      });
    } else {
      this.printWinston("error", "실패");
      res.json({
        message: "fail",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
