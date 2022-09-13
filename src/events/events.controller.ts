import { Body, Controller, Post } from "@nestjs/common";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private eventsService: EventsService) {}
  /**
   * MGW 인증
   */
  @Post("codeNumber")
  async codeNumber(
    @Body() body: { data: { password: string } }
  ): Promise<{ status: number; message: string }> {
    return await this.eventsService.checkPassword(body.data.password);
  }
}
