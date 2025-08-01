import { IsNotEmpty } from 'class-validator';

export class updateArticleDto {
  @IsNotEmpty({
    message: '文章id不能为空',
  })
  articleId: string;

  @IsNotEmpty({
    message: '文章内容不能为空',
  })
  articleContent: string;

  @IsNotEmpty({
    message: '文章标题不能为空',
  })
  articleTitle: string;

  @IsNotEmpty({
    message: '描述不能为空',
  })
  description: string;

  @IsNotEmpty({
    message: '文章封面不能为空',
  })
  coverPic: string;

  @IsNotEmpty({
    message: '关联标签不能为空',
  })
  associatedLabels: string[];
}
