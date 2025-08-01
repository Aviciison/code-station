import { IsNotEmpty, IsInt } from 'class-validator';

export class getRoleListDto {
  @IsInt()
  pageSize = 10;

  @IsInt()
  pageNo: number;
}
