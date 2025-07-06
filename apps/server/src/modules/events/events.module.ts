import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { WsAuthGuard } from './guards/ws-auth.guard';

@Module({
  providers: [EventsGateway, EventsService, WsAuthGuard],
  exports: [EventsGateway, EventsService],
})
export class EventsModule {}