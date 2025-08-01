import { generateNumericId } from '../../utils';
import { BaseEntity } from '../../common/entities/base';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'articleLike',
  comment: '用户点赞表',
})
export class articleLike extends BaseEntity {
  @PrimaryColumn()
  Id: string;

  @Column({
    comment: '用户id',
  })
  userId: number;

  @Column({
    comment: '文章id',
  })
  articleId: string;

  @BeforeInsert()
  generateId() {
    this.Id = generateNumericId();
  }
}
