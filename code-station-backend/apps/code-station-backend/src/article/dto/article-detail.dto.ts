import { IsNotEmpty } from 'class-validator';

export class articleDetailDto {
  @IsNotEmpty({
    message: '文章id不能为空',
  })
  articleId: string;

  userId?: number;
}
