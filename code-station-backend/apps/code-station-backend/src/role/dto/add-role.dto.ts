import { IsNotEmpty } from 'class-validator';

export class addRoleDto {
  @IsNotEmpty({
    message: '角色名称不能空',
  })
  roleName: string;

  @IsNotEmpty({
    message: '角色标识不能为空',
  })
  roleCode: string;

  // 备注
  remarks?: string;
}
