// import { ArticleService } from '@/article/article.service';
import { ArticleService } from '../article/article.service';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  @Inject(ArticleService)
  private articleService: ArticleService;

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  handleCron() {
    this.articleService.flushRedisToDB();
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  likeCron() {
    this.articleService.likeRedisToDB();
  }
}
