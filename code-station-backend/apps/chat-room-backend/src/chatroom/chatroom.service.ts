import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  prismaService: PrismaService;

  async createOneToOneChatroom(friendId: number, userId: number) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name: '聊天室' + Math.random().toString().slice(2, 8),
        type: false,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId: +userId,
        chatroomId: id,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId: +friendId,
        chatroomId: id,
      },
    });

    return id;
  }

  async createGroupChatroom(name: string, userId: number) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name,
        type: true,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId: id,
      },
    });
    return '创建成功';
  }

  async list(userId: number, name: string) {
    console.log(userId, 'userid');

    const chatroomIds = await this.prismaService.userChatroom.findMany({
      where: {
        userId,
      },
      select: {
        chatroomId: true,
      },
    });

    const chatRooms = await this.prismaService.chatroom.findMany({
      where: {
        id: {
          in: chatroomIds.map((item) => item.chatroomId),
        },
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        createTime: true,
      },
    });

    const res = [];
    for (let i = 0; i < chatRooms.length; i++) {
      const userIds = await this.prismaService.userChatroom.findMany({
        where: {
          chatroomId: chatRooms[i].id,
        },
        select: {
          userId: true,
        },
      });
      console.log(userIds, 'userIds');
      const data = userIds.filter((item) => item.userId !== +userId);
      console.log(data, 'data');

      if (chatRooms[i].type === false) {
        const user = await this.prismaService.users.findUnique({
          where: {
            id: userIds.filter((item) => item.userId !== userId)[0].userId,
          },
        });
        chatRooms[i].name = user.username;
      }
      res.push({
        ...chatRooms[i],
        userCount: userIds.length,
        userIds: userIds.map((item) => item.userId),
      });
    }
    return res;
  }

  async member(chatroomId: number) {
    const userIds = await this.prismaService.userChatroom.findMany({
      where: {
        chatroomId: +chatroomId,
      },
      select: {
        userId: true,
      },
    });

    const users = await this.prismaService.users.findMany({
      where: {
        id: {
          in: userIds.map((item) => item.userId),
        },
      },
      select: {
        id: true,
        username: true,
        headPic: true,
        createTime: true,
        email: true,
      },
    });

    return users;
  }

  async info(id: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id,
      },
    });

    return { ...chatroom, user: await this.member(id) };
  }

  async join(id: number, joinUsername: string) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: +id,
      },
    });
    if (chatroom.type === false) {
      throw new BadRequestException('一对一聊天室不能加入');
    }

    const user = await this.prismaService.users.findUnique({
      where: {
        username: joinUsername,
      },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    await this.prismaService.userChatroom.create({
      data: {
        userId: user.id,
        chatroomId: +id,
      },
    });
    return chatroom.id;
  }

  async quit(id: number, userId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id,
      },
    });

    if (chatroom.type === false) {
      throw new BadRequestException('一对一的聊天室不能退出');
    }

    await this.prismaService.userChatroom.deleteMany({
      where: {
        userId,
        chatroomId: id,
      },
    });

    return '退出成功';
  }

  async queryOneToOneChatroom(userId1: number, userId2: number) {
    const chatrooms = await this.prismaService.userChatroom.findMany({
      where: {
        userId: userId1,
      },
    });

    const chatrooms2 = await this.prismaService.userChatroom.findMany({
      where: {
        userId: userId2,
      },
    });

    let res;

    for (let i = 0; i < chatrooms.length; i++) {
      const chatroom = await this.prismaService.chatroom.findFirst({
        where: {
          id: chatrooms[i].chatroomId,
        },
      });

      if (chatroom.type === true) {
        continue;
      }

      const found = chatrooms2.find(
        (item2) => item2.chatroomId === chatroom.id,
      );

      if (found) {
        res = found.chatroomId;
        break;
      }
    }
    return res;
  }
}
