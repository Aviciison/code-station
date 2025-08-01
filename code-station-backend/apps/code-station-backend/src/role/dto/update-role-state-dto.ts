import { IsNotEmpty } from 'class-validator';

export class updateRoleStateDto {
  @IsNotEmpty({
    message: '角色id不能为空',
  })
  id: string;

  @IsNotEmpty({
    message: '角色状态不能为空',
  })
  state: string;

}
