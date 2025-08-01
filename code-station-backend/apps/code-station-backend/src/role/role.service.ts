import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { addRoleDto } from './dto/add-role.dto';
import { getRoleListDto } from './dto/get-role-list.dto';
import { updateRoleStateDto } from './dto/update-role-state-dto';
import { updateRoleInfoDto } from './dto/update-role-Info-dto';
import { rolePermissionRelation } from './entities/role_permission_relation.entity';
import { webUserPermission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(rolePermissionRelation)
  private rolePermissionRelationRepository: Repository<rolePermissionRelation>;

  @InjectRepository(webUserPermission)
  private webUserPermissionRepository: Repository<webUserPermission>;

  private dataSource: DataSource;

  /**
   * 新增角色信息
   */
  async addRole(addRoleDto: addRoleDto) {
    const roleHasRoleName = await this.roleRepository.findOneBy({
      roleName: addRoleDto.roleName,
    });
    if (roleHasRoleName) {
      throw new BadRequestException('角色名称已经重复');
    }
    const roleHasRoleCode = await this.roleRepository.findOneBy({
      roleCode: addRoleDto.roleCode,
    });
    if (roleHasRoleCode) {
      throw new BadRequestException('角色编码已经重复');
    }
    try {
      const role = new Role();
      role.roleName = addRoleDto.roleName;
      role.roleCode = addRoleDto.roleCode;
      if (addRoleDto.remarks) {
        role.remarks = addRoleDto.remarks;
      }
      await this.roleRepository.save(role);
      return '新增成功';
    } catch (err) {
      throw new BadRequestException('新增角色失败，请稍后重试');
    }
  }

  /**
   * 获取角色列表
   */
  async getRoleList(getRoleListDto: getRoleListDto) {
    const skipCount = (getRoleListDto.pageNo - 1) * getRoleListDto.pageSize;
    try {
      const [roleList, total] = await this.roleRepository.findAndCount({
        skip: skipCount,
        take: getRoleListDto.pageSize,
        order: {
          updateTime: 'DESC',
        },
      });
      return {
        roleList,
        total,
        pageSize: getRoleListDto.pageSize,
        pageNo: getRoleListDto.pageNo,
      };
    } catch (err) {
      throw new BadRequestException('列表查询失败');
    }
  }

  /**
   * 修改角色状态
   */
  async updateRoleState(updateRoleStateDto: updateRoleStateDto) {
    try {
      await this.roleRepository.update(updateRoleStateDto.id, {
        state: updateRoleStateDto.state,
      });
      return '修改成功';
    } catch (err) {
      throw new BadRequestException('修改角色状态失败，请稍后重试');
    }
  }

  /**
   * 修改角色信息
   */
  async updateRoleInfo(updateRoleInfoDto: updateRoleInfoDto) {
    const roleHas = await this.roleRepository.findOneBy({
      id: updateRoleInfoDto.id,
    });
    if (!roleHas) {
      throw new BadRequestException('角色不存在');
    }

    try {
      await this.roleRepository.update(updateRoleInfoDto.id, {
        roleName: updateRoleInfoDto.roleName,
        roleCode: updateRoleInfoDto.roleCode,
        remarks: updateRoleInfoDto.remarks,
      });
      return '修改成功';
    } catch (err) {
      throw new BadRequestException('修改角色信息失败，请稍后重试');
    }
  }

  /**
   * 删除角色信息
   */
  async deleteRole(id: string) {
    try {
      await this.roleRepository.delete({ id });
      const rolePermission =
        await this.rolePermissionRelationRepository.findOneBy({ roleId: id });
      if (rolePermission) {
        await this.rolePermissionRelationRepository.delete(rolePermission.id);
      }
      return '删除成功';
    } catch (err) {
      throw new BadRequestException('删除角色失败，请稍后重试');
    }
  }

  /**
   * 获取角色管理-权限-菜单权限
   */
  async getRoleMenu() {
    try {
      const menuList = await this.webUserPermissionRepository.find({
        select: ['id', 'parent_id', 'title', 'menu_type'],
      });

      return menuList.map((item) => {
        return {
          id: item.id,
          parentId: item.parent_id,
          title: item.title,
          menuType: item.menu_type,
        };
      });
    } catch (err) {
      throw new BadRequestException('角色权限菜单获取失败，请稍后重试');
    }
  }

  /**
   * 角色管理-权限-菜单权限-根据角色 id 查对应菜单
   */
  async getRoleMenuIds(id: string) {
    try {
      const rolePermissionId = await this.rolePermissionRelationRepository.find(
        {
          where: {
            roleId: id,
          },
          select: ['permissionId'],
        },
      );
      console.log(rolePermissionId, 'rolePermissionId');
      return rolePermissionId.map((item) => item.permissionId);
    } catch (err) {
      throw new BadRequestException('角色菜单id获取失败，请稍后重试');
    }
  }

  /**
   * 设置角色管理-权限-菜单权限id
   */
  async setRoleMenuIds(setRoleMenuIdsDto: { id: string; menuIds: string[] }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
  }
  // async setRoleMenuIds(setRoleMenuIdsDto: { id: string; menuIds: string[] }) {
  //   try {
  //     console.log(setRoleMenuIdsDto.id, setRoleMenuIdsDto.menuIds);
  //     const menuRole = setRoleMenuIdsDto.menuIds.map((item) => {
  //       return {
  //         roleId: setRoleMenuIdsDto.id,
  //         permissionId: item,
  //       };
  //     });
  //     const existingRolesMenu = await this.checkDuplicateRoles(menuRole);
  //     console.log(existingRolesMenu);
  //     // await this.rolePermissionRelationRepository.save(menuRole);
  //     console.log(menuRole, 'menuRole');
  //
  //     const difference = existingRolesMenu
  //       .filter((item) => {
  //         return !menuRole.some(
  //           (i) =>
  //             i.roleId === item.roleId && item.permissionId === i.permissionId,
  //         );
  //       })
  //       .concat(
  //         menuRole.filter((item) => {
  //           return !existingRolesMenu.some(
  //             (i) =>
  //               i.roleId === item.roleId &&
  //               item.permissionId === i.permissionId,
  //           );
  //         }),
  //       );
  //     console.log(difference, 'difference');
  //     const menuRoleRespository = difference.map((item) => {
  //       const menuRoleId = new rolePermissionRelation();
  //       menuRoleId.roleId = item.roleId;
  //       menuRoleId.permissionId = item.permissionId;
  //       return menuRoleId;
  //     });
  //     await this.rolePermissionRelationRepository.save(menuRoleRespository);
  //     return '修改成功';
  //   } catch (err) {
  //     throw new BadRequestException('角色权限设置失败，请稍后重试');
  //   }
  // }

  /**
   * 检查是否有相同的组合
   * @param roleMenuIds
   */
  async checkDuplicateRoles(
    roleMenuIds: Array<{ roleId: string; permissionId: string}>,
  ) {
    // 查询到已经有的组合数据
    const existingMenuRoles = await this.rolePermissionRelationRepository.find({
      where: roleMenuIds,
    });
    return existingMenuRoles.map((item) => ({
      roleId: item.roleId,
      permissionId: item.permissionId,
    }));
  }
}
