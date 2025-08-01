import { User } from '../../user/entities/user.entity';
import { generateNumericId } from '../../utils';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'article',
})
export class Article {
  @PrimaryColumn()
  articleId: string;

  @Column({
    comment: '文章内容',
    length: 10000,
  })
  articleContent: string;

  @Column({
    comment: '文章标题',
  })
  articleTitle: string;

  @Column({
    comment: '描述',
  })
  description: string;

  @Column({
    comment: '封面',
    length: 500,
  })
  coverPic: string;

  // @Column('simple-array', {
  //   comment: '关联标签',
  // })
  // associatedLabels: string[];
  // @Column({
  //   comment: '关联标签',
  //   type: 'varchar',
  // })
  // associatedLabels: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => User)
  user: User;

  @BeforeInsert()
  generateId() {
    this.articleId = generateNumericId();
  }
}
