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
  name: 'web_user_permission',
  comment: '后管权限表',
})
export class webUserPermission extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    length: 32,
    comment: '父级id',
    default: null,
  })
  parent_id?: string;

  @Column({
    length: 32,
    comment: '菜单名称',
  })
  title: string;

  @Column({
    length: 255,
    comment: '路由地址',
  })
  path: string;

  @Column({
    length: 255,
    comment: '路由名称',
  })
  route_name: string;

  @Column({
    length: 32,
    comment: '组件',
    default: null,
  })
  component?: string;

  @Column({
    default: true,
    comment: '是否展示',
  })
  show_link: boolean;

  @Column({
    default: null,
    comment: '排序',
  })
  rank?: number;

  @Column({
    comment: '菜单类型 0/菜单 1/iframe 2/外联  3/按钮',
  })
  menu_type: string;

  @Column({
    length: 32,
    comment: '菜单图标',
    default: null,
  })
  icon?: string;

  @Column({
    comment: '是否显示父级菜单',
    default: null,
  })
  show_parent: boolean;

  @Column({
    length: 32,
    comment: '权限表示',
    default: null,
  })
  permission: string;

  @Column({
    comment: '创建者',
  })
  created_by: string;

  @BeforeInsert()
  generateId() {
    this.id = generateNumericId();
  }
}
