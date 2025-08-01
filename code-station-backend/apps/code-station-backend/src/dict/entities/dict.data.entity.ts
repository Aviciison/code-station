import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base';

@Entity({
  name: 'dict_data',
  comment: '字典值数据表',
})
export class DictDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'dict_code',
    comment: '字典数据主键',
  })
  dictCode: number;

  @Column({
    name: 'label',
    length: 100,
    comment: '字典标签',
  })
  label: string;

  @Column({
    name: 'value',
    length: 100,
    comment: '字典键值',
  })
  value: string;

  @Column({
    name: 'dict_type',
    length: 100,
    comment: '字典类型',
  })
  dictType: string;
}
