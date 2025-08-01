import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base';

@Entity({
  name: 'dict_type',
  comment: '字典值类型表',
})
export class DictTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'dict_id',
    comment: '字典主键',
  })
  dictId: number;

  @Column({
    name: 'dict_name',
    length: 100,
    comment: '字典名称',
  })
  dictName: string;

  @Column({
    name: 'dict_type',
    length: 100,
    comment: '字典类型编码',
  })
  dictType: string;
}
