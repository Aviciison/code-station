/*
 * @Author: zwz
 * @Date: 2024-03-27 16:37:55
 * @LastEditors: zwz
 * @LastEditTime: 2024-03-27 16:39:03
 * @Description: 请填写简介
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
  comment: 'b端用户表',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '邮箱',
    length: 50,
  })
  email: string;

  @Column({
    comment: '头像',
    length: 255,
    nullable: true,
  })
  headPic: string;

  @Column({
    comment: '个人简介',
    length: 200,
    nullable: true,
  })
  personalProfile: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
