import { IsNotEmpty } from 'class-validator';

export class addMenuDto {
  @IsNotEmpty({
    message: '菜单类型不能为空',
  })
  menuType: string;

  @IsNotEmpty({
    message: '菜单名称不能为空',
  })
  title: string;

  @IsNotEmpty({
    message: '路由名称不能为空',
  })
  routeName: string;

  @IsNotEmpty({
    message: '路由路径不能为空',
  })
  path: string;

  // 排序
  rank: number;

  // 组件路径
  component: string;

  //icon
  icon: string;

  // 是否显示改菜单
  showLink: boolean;

  //上一级菜单
  parentId: string;
};