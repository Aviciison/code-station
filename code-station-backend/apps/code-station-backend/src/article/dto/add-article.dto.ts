import { IsNotEmpty } from 'class-validator';

export class AddArticleDto {
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
    message: '请上传封面图片',
  })
  coverPic: string;

  @IsNotEmpty({
    message: '请选择标签',
  })
  associatedLabels: string[];
}
