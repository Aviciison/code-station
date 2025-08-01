import { IsNotEmpty, IsInt } from 'class-validator';

export class updateRoleInfoDto {
  @IsNotEmpty({
    message: '角色id不能为空',
  })
  id: string;
  /**
   * 角色名称
   */
  @IsNotEmpty({ message: '角色名称不能为空' })
  roleName: string;

  /**
   * 角色标识
   */
  @IsNotEmpty({ message: '角色标识不能为空' })
  roleCode: string;

  // 备注
  remarks?: string;
}
