/*
 * @Author: zwz
 * @Date: 2024-03-27 16:34:14
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-06 17:20:49
 * @Description: 请填写简介
 */
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto, webRegisterUserDto } from './dto/register-user.dto';
import {
  LoginUserDto,
  wenLoginUserDto,
  getUserInfoDto,
  updateUserInfoDto,
} from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  // 注册接口
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser, '0');
  }

  // 登录接口
  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return vo;
  }

  // 刷新token接口
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, '0');
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token已经失效, 请重新登录');
    }
  }

  // 后管用户注册接口
  @Post('webRegister')
  async webRegister(@Body() registerUser: webRegisterUserDto) {
    return await this.userService.register(registerUser, '1');
  }

  // 登录接口
  @Post('webLogin')
  async webLogin(@Body() loginUser: wenLoginUserDto) {
    const vo = await this.userService.webLogin(loginUser);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return vo;
  }

  // 刷新token接
  @RequireLogin()
  @Get('webRefresh')
  async webRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, '1');
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token已经失效, 请重新登录');
    }
  }

  // 获取用户信息
  @RequireLogin()
  @Post('userInfo')
  async getUserInfo(@Body() id: getUserInfoDto) {
    try {
      return await this.userService.getUserInfo(id.id);
    } catch (e) {
      throw new UnauthorizedException('获取用户信息失败, 请重新登录');
    }
  }

  // 修改用户信息
  @RequireLogin()
  @Post('updateUserInfo')
  async updateUserInfo(@Body() info: updateUserInfoDto) {
    try {
      return await this.userService.updateUserInfo(info);
    } catch (e) {
      throw new HttpException('修改用户信息失败', HttpStatus.BAD_REQUEST);
    }
  }

  @MessagePattern('findUserId')
  async findUserId(data) {
    return await this.userService.findUserId(data.username, data.userId);
  }
}
