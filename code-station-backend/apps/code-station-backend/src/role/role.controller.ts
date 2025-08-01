import { Body, Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { addRoleDto } from './dto/add-role.dto';
import { getRoleListDto } from './dto/get-role-list.dto';
import { updateRoleStateDto } from './dto/update-role-state-dto';
import { updateRoleInfoDto } from './dto/update-role-Info-dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 新增角色
   * @param addRoleDto
   */
  @Post('addRole')
  async addRole(@Body() addRoleDto: addRoleDto) {
    return await this.roleService.addRole(addRoleDto);
  }

  /**
   * 获取角色列表
   * @param getRoleListDto
   */
  @Post('getRoleList')
  async getRoleList(@Body() getRoleListDto: getRoleListDto) {
    return await this.roleService.getRoleList(getRoleListDto);
  }

  /**
   * 角色的状态修改
   * @Param updateRoleStateDto
   */
  @Post('updateRoleState')
  async updateRoleState(@Body() updateRoleStateDto: updateRoleStateDto) {
    return await this.roleService.updateRoleState(updateRoleStateDto);
  }

  /**
   * 修改角色信息
   */
  @Post('updateRoleInfo')
  async updateRoleInfo(@Body() updateRoleInfoDto: updateRoleInfoDto) {
    return await this.roleService.updateRoleInfo(updateRoleInfoDto);
  }

  /**
   * 删除角色信息
   */
  @Post('deleteRole')
  async deleteRole(@Body() deleteRoleDto: { id: string }) {
    return await this.roleService.deleteRole(deleteRoleDto.id);
  }

  /**
   * 获取角色管理-权限-菜单权限
   */
  @Post('getRoleMenu')
  async getRoleMenu() {
    return await this.roleService.getRoleMenu();
  }

  /**
   * 角色管理-权限-菜单权限-根据角色 id 查对应菜单
   */
  @Post('getRoleMenuIds')
  async getRoleMenuIds(@Body() getRoleMenuIdsDto: { id: string }) {
    return await this.roleService.getRoleMenuIds(getRoleMenuIdsDto.id);
  }

  /**
   * 设置角色管理-权限-菜单权限id
   */
  @Post('setRoleMenuIds')
  async setRoleMenuIds(
    @Body() setRoleMenuIdsDto: { id: string; menuIds: string[] },
  ) {
    return await this.roleService.setRoleMenuIds(setRoleMenuIdsDto);
  }
}
