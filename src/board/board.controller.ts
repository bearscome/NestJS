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
  Param,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { query, Request, Response } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthService } from "src/auth/auth.service";
import { BoardCommentDTO } from "src/board/dto/board.comment.dto";
import {
  BoardDTO,
  CreateBoardDTO,
  SearchHistoryDTO,
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
    private authService: AuthService // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger
  ) {}

  /**
   * 게시판 글을 DB에 저장한다.
   * @param header
   * @param boardDTO
   * @param res
   * @param file
   * @returns 성공 및 실패를 리턴한다.
   */
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

    try {
      return await this.boardService.createBoard(data).then(() => {
        return res.json({ message: "success", statusCode: HttpStatus.CREATED });
      });
    } catch (err) {
      return res.json({
        message: "fail",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * 게시판 글을 삭제한다.
   * @param board_id
   * @param res
   * @returns 성공 및 실패를 리턴한다.
   */
  @Post("/delete")
  @UseGuards(CustomAuthGuard)
  async deleteBoard(
    @Body("id", ParseIntPipe) board_id: number,
    @Res() res: Response
  ): Promise<Response<ResponseData>> {
    // 게시글 삭제

    try {
      const reulst = await this.boardService.deleteBoard(board_id).then((r) => {
        if (r.status === 4000) {
          return {
            message: r.message,
            statusCode: HttpStatus.ACCEPTED,
          };
        } else if (r.status === 4001) {
          return {
            message: r.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        } else {
          return {
            message: r.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        }
      });

      return res.json(reulst);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 게시판 글을 변경한다.
   * @param updateBoardDTO
   * @returns 성공 및 실패를 리턴한다.
   */
  @Post("/update")
  @UseGuards(CustomAuthGuard)
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

  /**
   * 게시판 글을 페이징으로 조회한다.
   * @param offset
   * @param limit
   * @returns 페이징된 게시글을 리턴한다.
   */
  @Get("history")
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

  /**
   * 검색된 게시글을 조횐한다.
   * @param qeuryDTO
   * @returns 조건에 맞는게시글을 리턴한다.
   */
  @Get("history/search")
  async searchBoard(@Query() qeuryDTO: SearchHistoryDTO) {
    const queryData: SearchHistoryDTO = {
      searchType: qeuryDTO.searchType,
      searchContent: qeuryDTO.searchContent,
      offset: qeuryDTO.offset,
      limit: qeuryDTO.limit,
    };
    return await this.boardService.searchBoard(queryData);
  }

  /**
   * 게시글을 상세 조회 한다.
   * @param id
   * @returns 상세조회된 게시글을 리턴한다.
   */
  @Get("histroy/detail")
  async findOne(@Query("id", ParseIntPipe) id: number) {
    return await this.boardService.findBoard(id);
  }

  /**
   * 게시된 게시글에 댓글을 저장한다.
   * @param header
   * @param boardCommentDTO
   * @returns 저장된 댓글을 리턴한다.
   */
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

    return await this.boardService.addComment(inserData);
  }

  /**
   * 게시글에 답변을 정장한다.
   * @param header
   * @param boardAnswerDTO
   * @param file
   * @param res
   * @returns 성공 및 실패를 리턴한다.
   */
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

  /**
   * 권한이 어드민일 경우 모든 게시글을 삭제한다.
   * @param res
   * @return 성공 및 실패를 리턴한다.
   */
  @Post("deleteAll")
  @UseGuards(CustomAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteAll(@Res() res: Response) {
    const result = await this.boardService.deleteBoardAll();

    if (result) {
      res.json({
        message: "success",
        statusCode: HttpStatus.CREATED,
      });
    } else {
      res.json({
        message: "fail",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
