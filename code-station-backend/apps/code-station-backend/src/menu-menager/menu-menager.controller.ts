import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuMenagerService } from './menu-menager.service';
import { CreateMenuMenagerDto } from './dto/create-menu-menager.dto';
import { UpdateMenuMenagerDto } from './dto/update-menu-menager.dto';
import { addMenuDto } from './dto/add-menu.dto';
import { updateMenuDto } from './dto/update-menu.dto';

@Controller('menuManager')
export class MenuMenagerController {
  constructor(private readonly menuMenagerService: MenuMenagerService) {}

  /**
   * 获取全部菜单
   */
  @Post('getMenuList')
  async getMenuList() {
    return await this.menuMenagerService.getMenuList();
  }

  /**
   * 新增菜单
   * @param addMenuDto
   */
  @Post('addMenu')
  async addMenu(@Body() addMenuDto: addMenuDto) {
    return await this.menuMenagerService.addMenu(addMenuDto);
  }

  /**
   * 更新菜单
   * @param updateMenuDto
   */
  @Post('updateMenu')
  async updateMenu(@Body() updateMenuDto: updateMenuDto) {
    return await this.menuMenagerService.updateMenu(updateMenuDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuMenagerDto: UpdateMenuMenagerDto,
  ) {
    return this.menuMenagerService.update(+id, updateMenuMenagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuMenagerService.remove(+id);
  }
}
