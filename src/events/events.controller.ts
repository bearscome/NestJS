import { Body, Controller, Post } from "@nestjs/common";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private eventsService: EventsService) {}
  /**
   * MGW 인증
   */
  @Post("codeNumber")
  async codeNumber(@Body() body: { password: string }): Promise<any> {
    return await this.eventsService.checkPassword(body.password);
  }
}
