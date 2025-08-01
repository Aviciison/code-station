import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base';

@Entity({
  name: 'roleUserRelation',
  comment: '角色和用户关联表',
})
export class roleUserRelation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '角色id',
  })
  roleId: string;

  @Column({
    comment: '用户id',
  })
  userId: number;
}
