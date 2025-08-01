import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base';

@Entity({
  name: 'role_permission_relation',
  comment: '角色和权限关联表',
})
export class rolePermissionRelation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    comment: '角色id',
  })
  roleId: string;

  @Column({
    length: 32,
    comment: '权限id',
  })
  permissionId: string;
}
