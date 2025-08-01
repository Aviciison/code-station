import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateMenuMenagerDto } from './dto/update-menu-menager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { webUserPermission } from '../permission/entities/permission.entity';
import { Repository } from 'typeorm';
import { addMenuDto } from './dto/add-menu.dto';
import { updateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuMenagerService {
  @InjectRepository(webUserPermission)
  private webUserPermissionRepository: Repository<webUserPermission>;

  async getMenuList() {
    try {
      const menuList = await this.webUserPermissionRepository.find({
        select: [
          'menu_type',
          'path',
          'rank',
          'show_link',
          'route_name',
          'permission',
          'id',
          'parent_id',
          'title',
          'show_parent',
        ],
      });
      return menuList.map((item) => {
        return {
          id: item.id,
          path: item.path,
          menuType: item.menu_type,
          rank: item.rank,
          showLink: item.show_link,
          routeName: item.route_name,
          permission: item.permission,
          parentId: item.parent_id,
          title: item.title,
          showParent: item.show_parent,
        };
      });
    } catch (err) {
      throw new BadRequestException('获取菜单失败，请稍后重试');
    }
  }

  async addMenu(addMenuDto: addMenuDto) {
    try {
      const menu = new webUserPermission();
      menu.menu_type = addMenuDto.menuType;
      menu.title = addMenuDto.title;
      menu.path = addMenuDto.path;
      menu.route_name = addMenuDto.routeName;
      menu.rank = addMenuDto.rank;
      menu.parent_id = addMenuDto.parentId;
      menu.created_by = '1';
      menu.icon = addMenuDto.icon;
      menu.show_link = addMenuDto.showLink;
      await this.webUserPermissionRepository.save(menu);
      return '菜单添加成功';
    } catch (err) {
      throw new BadRequestException('菜单添加失败，请稍后重试');
    }
  }

  async updateMenu(updateMenuDto: updateMenuDto) {
    const menu = await this.webUserPermissionRepository.findOneBy({
      id: updateMenuDto.id,
    });
    if (!menu) {
      throw new BadRequestException('菜单不存在');
    }
    try {
      menu.menu_type = updateMenuDto.menuType;
      menu.title = updateMenuDto.title;
      menu.path = updateMenuDto.path;
      menu.show_link = updateMenuDto.showLink;
      menu.rank = updateMenuDto.rank;
      menu.route_name = updateMenuDto.routeName;

      updateMenuDto.parentId
        ? (menu.parent_id = updateMenuDto.parentId)
        : undefined;
      updateMenuDto.icon ? (menu.icon = updateMenuDto.icon) : undefined;

      updateMenuDto.showParent
        ? (menu.show_parent = updateMenuDto.showParent)
        : undefined;
      await this.webUserPermissionRepository.save(menu);
      return '菜单修改完成';
    } catch (err) {
      throw new BadRequestException('修改菜单失败');
    }
  }

  update(id: number, updateMenuMenagerDto: UpdateMenuMenagerDto) {
    return `This action updates a #${id} menuMenager`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuMenager`;
  }
}
