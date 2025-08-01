import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base';
import { generateNumericId } from '../../utils';

@Entity({
  name: 'web_role',
  comment: '角色表',
})
export class Role extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    comment: '角色名称',
  })
  roleName: string;

  @Column({
    comment: '角色标识',
  })
  roleCode: string;

  @Column({
    comment: '状态 01/启用 02/停用',
    default: '01',
  })
  state: string;

  @Column({
    comment: '备注',
    default: null,
  })
  remarks: string;

  @BeforeInsert()
  generateId() {
    this.id = generateNumericId();
  }
}
