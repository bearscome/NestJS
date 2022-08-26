import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  Param,
  Query,
  DefaultValuePipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthService } from "src/auth/auth.service";
import { BoardCommentDTO } from "src/auth/dto/board.comment.dto";
import {
  BoardDTO,
  CreateBoardDTO,
  UpdateBoardDTO,
} from "src/auth/dto/board.dto";
import { Board } from "src/domain/board.entity";
import { BoardService } from "./board.service";
import { BoardAnswerAddDTD, BoardAnswerDTO } from "./dto/board.answer.dto";

@Controller("board")
@UsePipes(new ValidationPipe())
export class BoardController {
  constructor(
    private boardService: BoardService,
    private authService: AuthService
  ) {}

  @Post("/create")
  @UseGuards(AuthGuard("jwt"))
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
    @Headers() header: any,
    @Body() boardDTO: BoardDTO,
    @Res() res: Response,
    @UploadedFile() file: any
  ) {
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

    try {
      await this.boardService
        .createBoard(data)
        .then(() =>
          res.json({ message: "success", statusCode: HttpStatus.CREATED })
        );
    } catch (err) {
      return res.json({
        message: "fail",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Post("/delete")
  async deleteBoard(@Body("id", ParseIntPipe) board_id: number): Promise<any> {
    // 게시글 삭제
    try {
      const reulst = await this.boardService.deleteBoard(board_id).then((r) => {
        if (r.status === 4000) {
          return {
            ...r,
            statusCode: HttpStatus.ACCEPTED,
          };
        } else if (r.status === 4001) {
          return {
            ...r,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        } else {
          return {
            ...r,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        }
      });

      return reulst;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("/update")
  async updateBoard(@Body() updateBoardDTO: UpdateBoardDTO) {
    // 게시글 업데이트
    try {
      const result = await this.boardService
        .updateBoard(updateBoardDTO)
        .then((r) => {
          if (r.status === 4000) {
            return {
              ...r,
              statusCode: HttpStatus.ACCEPTED,
            };
          } else if (r.status === 4001) {
            return {
              ...r,
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
          } else {
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
  @UsePipes(new ValidationPipe({ transform: true }))
  // query로 넘어올 시 스트링으로 들어오나, Validation안에 있는 transform을 true로 변경한 뒤,
  // DTO에서 @Type(() => Number)로 수정하면 넘버형으로 변견된다
  // async findAll(@Query() getHistory:GetHistoryBoardDTO) {
  // const { offset, limit } = getHistory;
  async findAll(
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.boardService.history({ offset, limit });
  }

  @Get("histroy/detail")
  async findOne(@Query("id", ParseIntPipe) id: number) {
    return await this.boardService.findBoard(id);
  }

  @Post("history/comment")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ transform: true }))
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

    return await this.boardService.addComment(inserData);
  }

  @Post("answer/create")
  @UseGuards(AuthGuard("jwt"))
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
}
