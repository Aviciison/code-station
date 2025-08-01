import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rolePermissionRelation } from './entities/role_permission_relation.entity';
import { webUserPermission } from '../permission/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, rolePermissionRelation, webUserPermission]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
