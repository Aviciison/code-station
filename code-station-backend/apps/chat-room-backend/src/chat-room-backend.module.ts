import { Module } from '@nestjs/common';
import { ChatRoomBackendController } from './chat-room-backend.controller';
import { ChatRoomBackendService } from './chat-room-backend.service';
import { FriendshipModule } from './friendship/friendship.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModules, LoginGuard } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { PrismaModule, PrismaService } from '@app/prisma';
import { ChatModule } from './chat/chat.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    PrismaModule,
    FriendshipModule,
    ChatModule,
    ChatHistoryModule,
    ClientsModule.register([
      {
        name: 'CODE-STATION-BACKEND',
        transport: Transport.TCP,
        options: {
          host: 'nest-app',
          port: 9999,
        },
      },
    ]),
    JwtModules,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.RUNNING_ENV === 'dev'
          ? '.env'
          : path.join(__dirname, '.production.env'),
      // envFilePath: path.join(__dirname, '.env'),
    }),
    ChatroomModule,
    FavoriteModule,
  ],
  controllers: [ChatRoomBackendController],
  providers: [
    ChatRoomBackendService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
  ],
})
export class ChatRoomBackendModule {}
