import { Module } from '@nestjs/common';
import { MenuMenagerService } from './menu-menager.service';
import { MenuMenagerController } from './menu-menager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { webUserPermission } from '../permission/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([webUserPermission])],
  controllers: [MenuMenagerController],
  providers: [MenuMenagerService],
})
export class MenuMenagerModule {}
