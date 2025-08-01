import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { DictService } from './dict.service';
import { findTypeDictDto } from './dto/find-type-dict.dto';
import { addDictTypeDto } from './dto/add-type-dict.dto';
import { addDictDataDto } from './dto/add-data-dict.dto';
import { findAllDataDto } from './dto/find-data-dict.dto';
import { removeDataDto } from './dto/remove-data-dict.dto';
import { updateDateDto } from './dto/update-data-dict.dto';

@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  /**
   * 查看所有的字典类型
   * @returns
   * @param findTypeDicDto
   */
  @Post('/findAllType')
  async findAllType(
    @Body()
    findTypeDicDto: findTypeDictDto,
  ) {
    return await this.dictService.findAllType(findTypeDicDto);
  }

  /**
   * 新增字典的类型
   * @param addDictTypeDto
   */
  @Post('/addDictType')
  async addDictType(@Body() addDictTypeDto: addDictTypeDto) {
    return await this.dictService.addDictType(addDictTypeDto);
  }

  /**
   * 新增字典数据
   */
  @Post('/addDictData')
  async addDictData(@Body() addDictDataDto: addDictDataDto) {
    return await this.dictService.addDictData(addDictDataDto);
  }

  /**
   * 查询同一类型的所有数据
   * @param dictType
   */
  @Post('/findAllData')
  async findAllData(@Body() findAllDataDto: findAllDataDto) {
    return await this.dictService.findAllData(findAllDataDto);
  }

  /**
   * 删除字典数据
   * @param dictCode
   */
  @Post('/removeData')
  async removeData(@Body() removeDataDto: removeDataDto) {
    return await this.dictService.removeData(removeDataDto);
  }

  /**
   * 更新字典数据
   * @param updateDateDto
   */
  @Post('/updateDate')
  async updateDate(@Body() updateDateDto: updateDateDto) {
    return await this.dictService.updateDate(updateDateDto);
  }
}
