import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { ChatHistory } from '@prisma/client';

export type HistoryDto = Pick<
  ChatHistory,
  'chatroomId' | 'senderId' | 'type' | 'content'
>;

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(chatroomId: number) {
    const history = await this.prismaService.chatHistory.findMany({
      where: {
        chatroomId,
      },
    });

    const res = [];
    for (let i = 0; i < history.length; i++) {
      const user = await this.prismaService.users.findUnique({
        where: {
          id: history[i].senderId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
          headPic: true,
        },
      });

      res.push({
        ...history[i],
        sender: user,
      });
    }

    return res;
  }

  async add(chatroomId: number, history: HistoryDto) {
    return this.prismaService.chatHistory.create({
      data: history,
    });
  }
}
