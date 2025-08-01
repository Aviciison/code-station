import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendAddDto } from './dto/friend-add.dto';
import { UserInfo, RequireLogin } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {} from '@app/common';

@Controller('friendship')
@RequireLogin()
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Inject('CODE-STATION-BACKEND')
  private codeClient: ClientProxy;

  @Post('add')
  async add(
    @Body() friendAddDto: FriendAddDto,
    @UserInfo('userId') userId: number,
  ) {
    try {
      const friendId = await firstValueFrom(
        this.codeClient.send('findUserId', {
          username: friendAddDto.username,
          userId,
        }),
      );

      return await this.friendshipService.add(
        friendId,
        userId,
        friendAddDto.reason,
      );
    } catch (e) {
      console.log(e, 'e');
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('request_list')
  async list(@UserInfo('userId') userId: number) {
    return this.friendshipService.list(userId);
  }

  @Get('agree/:id')
  async agree(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!friendId) {
      throw new HttpException('添加好友 id 不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.friendshipService.agree(+friendId, userId);
  }

  @Get('reject/:id')
  async reject(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!friendId) {
      throw new HttpException('添加的好友 id 不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.friendshipService.reject(friendId, userId);
  }

  @Get('list')
  async friendship(
    @UserInfo('userId') userId: number,
    @Query('name') name: string,
  ) {
    return this.friendshipService.getFriendship(userId, name);
  }

  @Get('remove/:id')
  async remove(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    return this.friendshipService.remove(+friendId, userId);
  }
}
