import { BadRequestException, Injectable } from '@nestjs/common';
import { findTypeDictDto } from './dto/find-type-dict.dto';
import { DictTypeEntity } from './entities/dict.type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { articleByUserListVo } from './vo/findDictType.vo';
import { addDictTypeDto } from './dto/add-type-dict.dto';
import { addDictDataDto } from './dto/add-data-dict.dto';
import { DictDataEntity } from './entities/dict.data.entity';
import { findAllDataDto } from './dto/find-data-dict.dto';
import { removeDataDto } from './dto/remove-data-dict.dto';
import { updateDateDto } from './dto/update-data-dict.dto';

@Injectable()
export class DictService {
  @InjectRepository(DictTypeEntity)
  private typeRepository: Repository<DictTypeEntity>;

  @InjectRepository(DictDataEntity)
  private dataRepository: Repository<DictDataEntity>;

  async findAllType(findTypeDicDto: findTypeDictDto) {
    const skipCount = (findTypeDicDto.pageNo - 1) * findTypeDicDto.pageSize;

    const condition: Record<string, any> = {};

    if (findTypeDicDto.dictName) {
      condition.dictName = Like(`%${findTypeDicDto.dictName}%`);
    }

    if (findTypeDicDto.dictType) {
      condition.dictType = Like(`%${findTypeDicDto.dictType}%`);
    }

    try {
      const [dictType, total] = await this.typeRepository.findAndCount({
        where: condition,
        skip: skipCount,
        take: findTypeDicDto.pageSize,
      });

      const vo = new articleByUserListVo();
      vo.pageNo = findTypeDicDto.pageNo;
      vo.pageSize = findTypeDicDto.pageSize;
      vo.dictTypeList = dictType;
      vo.total = total;
      return vo;
    } catch (error) {
      throw new BadRequestException('查询列表错误，请稍后重试');
    }
  }

  /**
   * 新增字典类型
   */
  async addDictType(addDictTypeDto: addDictTypeDto) {
    const dictName = this.typeRepository.findOneBy({
      dictName: addDictTypeDto.dictName,
    });
    if (dictName) {
      throw new BadRequestException('已经重复字典名称，请重新新增');
    }

    const dictType = this.typeRepository.findOneBy({
      dictType: addDictTypeDto.dictType,
    });

    if (dictType) {
      throw new BadRequestException('已经重复字典类型编码，请重新新增');
    }

    const type = new DictTypeEntity();
    type.dictName = addDictTypeDto.dictName;
    type.dictType = addDictTypeDto.dictType;
    try {
      await this.typeRepository.save(type);
      return '新增成功';
    } catch (e) {
      throw new BadRequestException('新增字典类型错误，请稍后重试');
    }
  }

  /**
   * 新增字典数据
   */
  async addDictData(addDictDataDto: addDictDataDto) {
    // 判断是否在相同字典类型下有重复的数据
    const dicData = await this.dataRepository.find({
      select: ['label', 'value'],
      where: {
        dictType: addDictDataDto.dictType,
      },
    });
    const valueSome = dicData.some(
      (item) => item.value === addDictDataDto.value,
    );
    if (valueSome) {
      throw new BadRequestException('重复value，请重新添加');
    }

    const labelSome = dicData.some((item) => {
      item.label === addDictDataDto.label;
    });
    if (labelSome) {
      throw new BadRequestException('重复label，请重新添加');
    }

    try {
      await this.dataRepository.save({
        dictType: addDictDataDto.dictType,
        label: addDictDataDto.label,
        value: addDictDataDto.value,
      });
      return '新增成功';
    } catch (e) {
      throw new BadRequestException('添加字典数据失败');
    }
  }

  /**
   * 根据字典类型查询数据
   */
  async findAllData(findAllDataDto: findAllDataDto) {
    try {
      const data = await this.dataRepository.find({
        select: ['value', 'label', 'dictCode'],
        where: {
          dictType: findAllDataDto.dictType,
        },
      });
      return data;
    } catch (e) {
      throw new BadRequestException('查询字典数据失败，请稍后重试');
    }
  }

  /**
   * 删除字典数据
   */
  async removeData(removeDataDto: removeDataDto) {
    try {
      await this.dataRepository.delete({
        dictCode: removeDataDto.dictCode,
      });
      return '删除成功';
    } catch (e) {
      throw new BadRequestException('删除失败，请稍后重试');
    }
  }

  /**
   *  更新字典数据
   */
  async updateDate(updateDateDto: updateDateDto) {
    const data = await this.dataRepository.findOneBy({
      dictCode: updateDateDto.dictCode,
    });

    if (!data) {
      throw new BadRequestException('这条数据不存在，请先添加后再操作');
    }

    if (updateDateDto.value) {
      data.value = updateDateDto.value;
    }

    if (updateDateDto.label) {
      data.label = updateDateDto.label;
    }

    try {
      await this.dataRepository.update(
        {
          dictCode: updateDateDto.dictCode,
        },
        data,
      );
      return '更新成功';
    } catch (e) {
      throw new BadRequestException('更新失败，请稍后重试');
    }
  }
}
