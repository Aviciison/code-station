import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRoomBackendService {
  getHello(): string {
    return 'Hello World!';
  }
}
