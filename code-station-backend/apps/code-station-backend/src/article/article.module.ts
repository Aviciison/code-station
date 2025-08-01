import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { label } from './entities/label.entity';
import { articleExtra } from './entities/articleExtra.entity';
import { articleLike } from './entities/articleLike.entity';
import { articleCollect } from './entities/articleCollect.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      label,
      articleExtra,
      articleLike,
      articleCollect,
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
