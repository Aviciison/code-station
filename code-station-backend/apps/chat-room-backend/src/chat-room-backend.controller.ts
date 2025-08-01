import { Controller, Get } from '@nestjs/common';
import { ChatRoomBackendService } from './chat-room-backend.service';

@Controller()
export class ChatRoomBackendController {
  constructor(
    private readonly chatRoomBackendService: ChatRoomBackendService,
  ) {}

  @Get()
  getHello(): string {
    return this.chatRoomBackendService.getHello();
  }
}
