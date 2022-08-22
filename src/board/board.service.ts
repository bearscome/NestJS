import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BoardRepository } from "src/auth/board.repository";
import { BoardDTO, CreateBoardDTO } from "src/auth/dto/board.dto";

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository) private boardRepository: BoardRepository
  ) {}
  async findBoard(borad_id: number) {
    // 게시글 고유 아이디 get,
    // 사용자가 작성했는지 확인해야하지만 -> jwt인증하니까, 굳이 할 필요가 없을 거 같다.
    const findBoard = await this.boardRepository.findOne({
      where: { borad_id },
    });

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
  async updateBoard(id: number) {
    // 게시글 수정 서비스 로직
  }
}
