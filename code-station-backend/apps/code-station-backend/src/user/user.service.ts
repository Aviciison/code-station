/*
 * @Author: zwz
 * @Date: 2024-03-27 16:34:14
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-03 14:36:20
 * @Description: 请填写简介
 */
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { md5, encryptKey } from '../utils';
import { User } from './entities/user.entity';
import { webUser } from './entities/webUser.eneity';
import { In, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  LoginUserDto,
  updateUserInfoDto,
  wenLoginUserDto,
} from './dto/login-user.dto';
import {
  LoginUserVo,
  webLoginUserVo,
  UserInfoVo,
  fewUserInfoVo,
} from './vo/login-user.vo';
import { roleUserRelation } from './entities/role_user_relation.entity';
import { Role } from '../role/entities/role.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;
  @InjectRepository(webUser)
  private webUserRepository: Repository<webUser>;
  @InjectRepository(roleUserRelation)
  private roleUserRelationRepository: Repository<roleUserRelation>;
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  async register(user: RegisterUserDto, isWeb: string) {
    console.log(this.webUserRepository);
    if (isWeb === '0') {
      const foundUser = await this.userRepository.findOneBy({
        username: user.username,
      });

      if (foundUser) {
        throw new HttpException('用户已经存在', HttpStatus.BAD_REQUEST);
      }

      const newUser = new User();
      newUser.username = user.username;
      newUser.password = md5(user.password);
      newUser.email = user.email;

      try {
        await this.userRepository.save(newUser);
        return '注册成功';
      } catch (e) {
        this.logger.error(e, UserService);
        return '注册失败';
      }
    } else {
      const foundUser = await this.webUserRepository.findOneBy({
        username: user.username,
      });

      if (foundUser) {
        throw new HttpException('用户已经存在', HttpStatus.BAD_REQUEST);
      }

      const newUser = new webUser();
      newUser.username = user.username;
      newUser.password = md5(user.password);
      newUser.email = user.email;

      try {
        await this.webUserRepository.save(newUser);
        return '注册成功';
      } catch (e) {
        this.logger.error(e, UserService);
        return new BadRequestException('注册失败');
      }
    }
  }

  async login(LoginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: LoginUserDto.username,
      },
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    //后端解密
    // user.password = encryptKey(user.password);
    const res = encryptKey(LoginUserDto.password);

    if (user.password !== md5(res)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      headPic: user.headPic,
      personalProfile: user.personalProfile,
      // createTime: user.createTime.getTime(),
    };
    return vo;
  }

  async findUserById(userId: number, isWeb) {
    if (isWeb === '0') {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      return {
        id: user.id,
        username: user.username,
      };
    } else {
      const user = await this.webUserRepository.findOne({
        where: {
          id: userId,
        },
      });
      return {
        id: user.id,
        username: user.username,
      };
    }
  }

  async webLogin(LoginUserDto: wenLoginUserDto) {
    const user = await this.webUserRepository.findOne({
      where: {
        username: LoginUserDto.username,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== md5(LoginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    // 获取该用户角色
    const roleId = await this.roleUserRelationRepository.find({
      where: {
        userId: user.id,
      },
      select: ['roleId'],
    });
    const roleIdList = roleId.map((item) => item.roleId);
    const roleCode = await this.roleRepository.find({
      where: {
        id: In(roleIdList),
      },
      select: ['roleCode'],
    });

    const vo = new webLoginUserVo();
    vo.userInfo = {
      id: user.id,
      roles: roleCode.map((item) => item.roleCode),
      username: user.username,
      email: user.email,
    };
    return vo;
  }

  async getUserInfo(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const vo = new UserInfoVo();
    vo.email = user.email;
    vo.headPic = user.headPic;
    vo.id = user.id;
    vo.personalProfile = user.personalProfile;
    vo.username = user.username;
    return vo;
  }

  // 修改用户信息
  async updateUserInfo(info: updateUserInfoDto) {
    const user = await this.userRepository.findOneBy({
      id: info.id,
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    user.email = info.email;
    user.username = info.username;
    if (info.headPic) {
      user.headPic = info.headPic;
    }
    if (info.personalProfile) {
      user.personalProfile = info.personalProfile;
    }
    try {
      this.userRepository.update(
        {
          id: user.id,
        },
        user,
      );
      const vo = new fewUserInfoVo();
      vo.id = user.id;
      vo.email = user.email;
      vo.headPic = user.headPic;
      vo.username = user.username;
      vo.personalProfile = user.personalProfile;
      return vo;
    } catch (e) {
      throw new BadRequestException('更新用户资料失败');
    }
  }

  // 聊天添加朋友
  async findUserId(username: string, userId: number) {
    const friend = await this.userRepository.findOneBy({
      username,
    });
    console.log(friend, userId);

    if (!friend) {
      throw new RpcException({
        message: '要添加的 username 不存在',
        statusCode: 404,
      });
    }

    if (friend.id === userId) {
      throw new RpcException({
        message: '不能添加自己为好友',
        statusCode: 404,
      });
    }

    return friend.id;

    // const found = await this.userRepository.find({
    //   where:
    // })
  }
}
