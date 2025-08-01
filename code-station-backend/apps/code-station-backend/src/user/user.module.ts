import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { webUser } from './entities/webUser.eneity';
import { roleUserRelation } from './entities/role_user_relation.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, webUser, roleUserRelation, Role])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
