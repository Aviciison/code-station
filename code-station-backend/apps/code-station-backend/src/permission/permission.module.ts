import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { webUserPermission } from './entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { rolePermissionRelation } from '../role/entities/role_permission_relation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([webUserPermission, Role, rolePermissionRelation]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
