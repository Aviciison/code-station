import { BaseEntity } from '../../common/entities/base';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'articleExtra',
  comment: '文章额外数据表',
})
export class articleExtra extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '文章id',
  })
  @PrimaryColumn()
  articleId: string;

  @Column({
    comment: '阅读量',
    default: 0,
  })
  viewCount: number;

  @Column({
    comment: '点赞量',
    default: 0,
  })
  likeCount: number;

  @Column({
    comment: '收藏量',
    default: 0,
  })
  collectCount: number;
}
