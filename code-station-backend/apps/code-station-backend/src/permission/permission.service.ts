import { BadRequestException, Injectable } from '@nestjs/common';
import { addPermissionDto } from './dto/add-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { webUserPermission } from './entities/permission.entity';
import { getMenuTree, getRoles } from '../utils';
import { Role } from '../role/entities/role.entity';
import { rolePermissionRelation } from '../role/entities/role_permission_relation.entity';

@Injectable()
export class PermissionService {
  @InjectRepository(webUserPermission)
  private webUserPermissionRepository: Repository<webUserPermission>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(rolePermissionRelation)
  private rolePermissionRelationRepository: Repository<rolePermissionRelation>;

  async addMenu(addPermissionDto: addPermissionDto) {
    try {
      const menu = new webUserPermission();
      menu.menu_type = addPermissionDto.menuType;
      menu.title = addPermissionDto.title;
      menu.path = addPermissionDto.path;
      menu.route_name = addPermissionDto.routeName;
      menu.rank = addPermissionDto.rank;
      menu.parent_id = addPermissionDto.parentId;
      menu.created_by = '1';
      menu.icon = addPermissionDto.icon;
      menu.show_link = addPermissionDto.showLink;
      // await this.webUserPermissionRepository.save({
      //   title: '系统管理',
      //   path: '/system',
      //   route_name: '系统管理',
      //   rank: 1,
      //   menu_type: 4,
      //   created_by: '1', // userId
      // });
      await this.webUserPermissionRepository.save(menu);
      return '菜单添加成功';
    } catch (err) {
      throw new BadRequestException('菜单添加失败，请稍后重试');
    }
  }

  // 获取菜单
  async getMenuList() {
    try {
      // 获取菜单的全部信息
      const menuList: webUserPermission[] =
        await this.webUserPermissionRepository.find({
          select: [
            'path',
            'title',
            'icon',
            'rank',
            'parent_id',
            'id',
            'show_link',
            'show_parent',
            'route_name',
          ],
        });
      // 获取角色和权限的全部信息
      const permissionId = menuList.map((item) => item.id);
      const roleList = await this.rolePermissionRelationRepository.find({
        where: {
          permissionId: In(permissionId),
        },
        select: ['roleId', 'permissionId'],
      });
      const roleNameList = await this.roleRepository.find({
        select: ['roleCode', 'roleName', 'id'],
      });
      const roleNameCodeList = roleList.map((item) => {
        let result;
        roleNameList.forEach((ite) => {
          if (item.roleId === ite.id)
            result = { ...item, roleCode: ite.roleCode };
        });
        return result;
      });
      const result = menuList.map((item) => {
        return {
          id: item.id,
          parent_id: item.parent_id,
          path: item.path,
          name: item.route_name,
          meta: {
            title: item.title,
            icon: item.icon,
            rank: item.rank,
            showParent: item.show_parent,
            showLink: item.show_link,
            roles: item.parent_id
              ? getRoles(roleNameCodeList, item.id) || []
              : null,
          },
        };
      });
      // 编程成菜单树
      return getMenuTree(result);
    } catch (err) {
      throw new BadRequestException('获取菜单失败，请稍后重试');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
