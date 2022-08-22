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
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import {
  BoardDTO,
  CreateBoardDTO,
  UpdateBoardDTO,
} from "src/auth/dto/board.dto";
import { BoardService } from "./board.service";

@Controller("board")
@UsePipes(new ValidationPipe())
export class BoardController {
  constructor(
    private boardService: BoardService,
    private authService: AuthService
  ) {}
  @Post("/create")
  async createBoard(
    @Headers() header: any,
    @Body() boardDTO: BoardDTO,
    @Res() res: Response
  ) {
    const findUser = await this.authService.jwtFindUser(header);
    const { id, username } = findUser; // 회원 아이디, 회원 primaryKey
    const { title, content } = boardDTO;

    const data: CreateBoardDTO = {
      writer: username,
      title,
      content,
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
}