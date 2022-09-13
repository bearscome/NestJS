import { Module } from "@nestjs/common";
import { EventGateWay } from "./events.gateway";
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  providers: [EventGateWay, EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
