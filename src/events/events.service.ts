import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsService {
  async checkPassword(
    password: string
  ): Promise<{ status: number; message: string }> {
    let responseData = {
      status: 400,
      message: "비밀번호가 틀렸습니다.",
    };
    if (password === "0000") {
      responseData.status = 200;
      responseData.message = "성공";
    }

    return responseData;
  }
}
