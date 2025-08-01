import { generateNumericId } from '../../utils';
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
  name: 'label',
})
export class label {
  @PrimaryColumn()
  Id: string;

  @Column({
    comment: '标签id',
  })
  labelId: string;

  @Column({
    comment: '文章id',
  })
  articleId: string;

  @BeforeInsert()
  generateId() {
    this.Id = generateNumericId();
  }
}
