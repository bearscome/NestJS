import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BoardCommentRepository } from "src/auth/board.comment.repository";
import { BoardRepository } from "src/auth/board.repository";
import { BoardCommentDTO } from "src/auth/dto/board.comment.dto";
import {
  BoardDTO,
  CreateBoardDTO,
  GetHistoryBoardDTO,
  UpdateBoardDTO,
} from "src/auth/dto/board.dto";

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository) private boardRepository: BoardRepository,
    @InjectRepository(BoardCommentRepository)
    private commentRepository: BoardRepository
  ) {}

  /**
   * 게시판 상세 조회
   * @param borad_id 게시판 고유 아이디
   * @returns 게시판 상세
   */
  async findBoard(borad_id: number) {
    // 게시글 고유 아이디 get,
    // 사용자가 작성했는지 확인해야하지만 -> jwt인증하니까, 굳이 할 필요가 없을 거 같다.
    const findBoard = await this.boardRepository.findOne({
      where: { borad_id },
    });
    const comment = await findBoard.comments;
    // Javascript 혹은 Node.js에서는 Lazy Loading을 사용하기 위해서는 Promise가 사용됩니다. 이것은 비표준 방법이며 TypeOrm에서의 실험적인 기능입니다.
    return findBoard;
  }

  async createBoard(createBoardDTO: CreateBoardDTO): Promise<CreateBoardDTO> {
    console.log(createBoardDTO);
    return await this.boardRepository.save(createBoardDTO);
    // 게시글 생성 서비스 로직
  }
  async deleteBoard(board_id: number) {
    // return await this.boardRepository.delete()
    // 게시글 삭제 서비스 로직
    const boardInfo = await this.findBoard(board_id);

    let result: { status: number; message: string } = {
      status: 0,
      message: "",
    };

    if (!boardInfo) {
      result.status = 4001;
      result.message = "이미 삭제되었거나, 존재하지 않는 게시물 입니다.";
      return result;
    }

    const { borad_id } = boardInfo;
    try {
      result = await this.boardRepository.delete({ borad_id }).then(() => {
        return {
          status: 4000,
          message: "삭제 완료되었습니다.",
        };
      });

      return result;
    } catch (err) {
      console.error("deleteBoard_ERR", err);
      result.status = 4999;
      result.message = "알수없는 오류가 발생하였습니다.";
      return result;
    }
  }

  async updateBoard(updateBoardDTO: UpdateBoardDTO) {
    // 게시글 수정 서비스 로직
    const { id, title, content } = updateBoardDTO;
    let result: { status: number; message: string } = {
      status: 0,
      message: "",
    };

    const boardInfo = await this.findBoard(Number(id));

    console.log("boardInfoboardInfo", boardInfo);

    if (!boardInfo) {
      result.status = 4001;
      result.message = "존재하지 않는 게시물 입니다.";
      return result;
    }

    const data = {
      ...boardInfo,
      title,
      content,
    };

    try {
      result = await this.boardRepository.save(data).then(() => {
        return {
          status: 4000,
          message: "삭제 완료되었습니다.",
        };
      });

      return result;
    } catch (err) {
      console.error("deleteBoard_ERR", err);
      result.status = 4999;
      result.message = "알수없는 오류가 발생하였습니다.";
      return result;
    }
  }

  async history({ offset, limit }: GetHistoryBoardDTO) {
    let result: {
      status: number;
      message: string;
      result: Array<BoardDTO | []>;
      total: number;
    } = {
      status: 0,
      message: "",
      result: [],
      total: 0,
    };

    try {
      result = await this.boardRepository
        .findAndCount({
          skip: offset,
          take: limit,
        })
        .then(([_result, _total]) => {
          if (_result.length < 1) {
            result.status = 4001;
            result.message = "존재하지 않는 게시물 입니다.";
          } else {
            result.status = 4000;
            result.message = "조회가 완료되었습니다.";
            result.total = _total;
            result.result = _result;
          }
          return result;
        });
    } catch (err) {
      console.error("histroy_ERR", err);
      result.status = 4999;
      result.message = "알수없는 오류가 발생하였습니다.";
      return result;
    }

    return result;
  }

  async addComment(insertData) {
    /**
     * 게시판 고유 번호
     * 댓글 글쓴이
     * 댓글 내용
     */
    return await this.commentRepository.save(insertData);
  }
}
