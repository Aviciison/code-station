import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FriendAddDto } from './dto/friend-add.dto';
import { PrismaService } from '@app/prisma';
import { users } from '@prisma/client';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  prismaService: PrismaService;

  /**
   * 添加好友申请
   * @param friendId
   * @param userId
   * @param reason
   * @returns
   */
  async add(friendId: number, userId: number, reason: string) {
    const found = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId,
      },
    });
    if (found.length) {
      throw new HttpException('该好友已经添加过', HttpStatus.BAD_REQUEST);
    }

    return this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: friendId,
        reason,
        status: 0,
      },
    });
  }

  /**
   * 查询
   * @param userId
   */
  async list(userId: number) {
    const fromMeRequest = await this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    });

    const toMeRequest = await this.prismaService.friendRequest.findMany({
      where: {
        toUserId: userId,
      },
    });

    const res = {
      toMe: [],
      fromMe: [],
    };

    for (let i = 0; i < fromMeRequest.length; i++) {
      const user = await this.prismaService.users.findUnique({
        where: {
          id: fromMeRequest[i].toUserId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          headPic: true,
          createTime: true,
        },
      });
      res.fromMe.push({
        ...fromMeRequest[i],
        toUser: user,
      });
    }

    for (let i = 0; i < toMeRequest.length; i++) {
      const user = await this.prismaService.users.findUnique({
        where: {
          id: toMeRequest[i].fromUserId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          headPic: true,
          createTime: true,
        },
      });

      res.toMe.push({
        ...toMeRequest[i],
        fromUser: user,
      });
    }
    return res;
  }

  async agree(friendId: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 1,
      },
    });

    const res = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId,
      },
    });

    if (!res.length) {
      await this.prismaService.friendship.create({
        data: {
          userId,
          friendId,
        },
      });
    }
    return '添加成功';
  }

  async reject(friendId: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 2,
      },
    });
    return '已拒绝';
  }

  async getFriendship(userId: number, name: string) {
    console.log(userId, 'userId');

    const friends = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          {
            userId: userId,
          },
          {
            friendId: userId,
          },
        ],
      },
    });
    console.log(friends, 'friends');

    const set = new Set<number>();
    for (let i = 0; i < friends.length; i++) {
      set.add(friends[i].userId);
      set.add(friends[i].friendId);
    }

    const friendIds = [...set].filter((item) => item !== userId);

    const res = [];

    for (let i = 0; i < friendIds.length; i++) {
      console.log(friendIds[i], 'friendIds');

      const user = await this.prismaService.users.findUnique({
        where: {
          id: friendIds[i],
        },
        select: {
          id: true,
          username: true,
          email: true,
          headPic: true,
        },
      });
      res.push(user);
    }
    console.log(res, 'res', name);

    return name
      ? res.filter((item: users) => item.username.includes(name))
      : res;
  }

  async remove(friendId: number, userId: number) {
    try {
      const deleteUser = await this.prismaService.friendship.deleteMany({
        where: {
          userId,
          friendId,
        },
      });
      await this.prismaService.friendship.deleteMany({
        where: {
          userId: friendId,
          friendId: userId,
        },
      });

      return '删除成功';
    } catch (err) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
