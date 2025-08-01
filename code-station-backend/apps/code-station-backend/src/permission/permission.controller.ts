import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { addPermissionDto } from './dto/add-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RequireLogin, UserInfo } from '@app/common';
import { userInfo } from 'os';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 菜单新增
   * 需要登录
   * @param addPermissionDto
   * @param userId
   */
  @RequireLogin()
  @Post()
  async addMenu(
    @Body() addPermissionDto: addPermissionDto,
    @UserInfo('userId') userId,
  ) {
    return await this.permissionService.addMenu(addPermissionDto);
  }

  /**
   * 获取菜单和权限
   */
  @Get('menuList')
  async getMenuList() {
    return await this.permissionService.getMenuList();
  }

  /**
   * 菜单修改
   * @param id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
