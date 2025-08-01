import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
  Inject,
  Param,
  Req,
  Request,
  Headers,
} from '@nestjs/common';
// import { Request as ExpRequest } from 'express';
import { RequireLogin, UserInfo } from '@app/common';
import { generateParseIntPipe } from '../utils';
import { ArticleService } from './article.service';
import { AddArticleDto } from './dto/add-article.dto';
import { articleDetailDto } from './dto/article-detail.dto';
import { updateArticleDto } from './dto/update-artcile.dto';
import { WINSTON_LOGGER_TOKEN } from '@app/winston';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 打印日志
  @Inject(WINSTON_LOGGER_TOKEN)
  private logger;

  /**
   * 根据用户id查询文章，分页
   * 需要登录
   * @param pageSize
   * @param pageNo
   * @returns
   */
  @RequireLogin()
  @Get('articleByUserList')
  articleList(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @UserInfo('userId') userId: number,
  ) {
    this.logger.log(pageNo, pageNo, userId);
    return this.articleService.find(pageNo, pageSize, userId);
  }

  /**
   * 查看用户收藏的文章
   * 需要登录
   * @param userId
   * @param
   */
  @RequireLogin()
  @Get('articleByUserCollectList')
  async getCollectArticleList(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @UserInfo('userId') userId: number,
  ) {
    return await this.articleService.articleByUserCollectList(
      pageNo,
      pageSize,
      userId,
    );
  }

  /**
   * C端新增文章
   * 需要登录
   * @param addArticleDto
   * @param userId
   * @returns
   */
  @RequireLogin()
  @Post('addArticle')
  async addArticle(
    @Body() addArticleDto: AddArticleDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.articleService.addArticle(addArticleDto, userId);
    return '文章添加成功';
  }

  /**
   * C端文章作者删除文章
   * 需要登录
   * @param articleId 文章id
   */
  @RequireLogin()
  @Get('removeArticleByUser')
  async removeArticleByUser(@Query('articleId') articleId: string) {
    return await this.articleService.removeArticleByUser(articleId);
  }

  /**
   * C端文章作者修改文章
   * 需要登录
   * @param updateArticleDto
   *
   */
  @RequireLogin()
  @Post('updateArticleByUser')
  async updateArticleByUser(@Body() updateArticleDto: updateArticleDto) {
    return await this.articleService.updateArticleByUser(updateArticleDto);
  }

  /**
   * C端首页查看所有文章
   * @param
   */
  @Get('articleList')
  async getArticleList(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('labelId')
    labelId: string,
  ) {
    return await this.articleService.findAll(pageNo, pageSize, labelId);
  }

  /**
   * C端首页查看文章详情
   * @param articleId
   */
  @Post('getArticleDetail')
  async getArticleDetail(@Body() ArticleDetailDto: articleDetailDto) {
    return await this.articleService.getDetail(
      ArticleDetailDto.articleId,
      ArticleDetailDto.userId,
    );
  }

  /**
   * 查看文章增加阅读量
   * @Param userId
   */
  @Get('addView')
  async addView(
    @Query('articleId') articleId: string,
    @UserInfo('userId') userId: number,
    // @Request() req,
    @Headers('x-real-ip') headerRealIP: string,
  ) {
    console.log(headerRealIP, 'headerRealIP');
    return await this.articleService.view(articleId, userId || headerRealIP);
  }

  /**
   * 点赞文章
   * @Param userId
   * @Param articleId
   */
  @Get('addArticleLike')
  @RequireLogin()
  async addLike(
    @Query('articleId') articleId: string,
    @UserInfo('userId') userId: number,
  ) {
    return await this.articleService.addLike(articleId, userId);
  }

  /**
   * 取消文章点赞
   * @Param userId
   * @Param articleId
   */
  @Get('cancelArticleLike')
  @RequireLogin()
  async cancelLike(
    @Query('articleId') articleId: string,
    @UserInfo('userId') userId: number,
  ) {
    return await this.articleService.cancelLike(articleId, userId);
  }

  /**
   * 收藏文章
   * @Param userId
   * @Param articleId
   */
  @Get('addArticleCollect')
  @RequireLogin()
  async addArticleCollect(
    @Query('articleId') articleId: string,
    @UserInfo('userId') userId: number,
  ) {
    return await this.articleService.addArticleCollect(articleId, userId);
  }

  /**
   * 取消收藏
   * @Param userId
   * @Param articleId
   */
  @Get('cancelArticleCollect')
  @RequireLogin()
  async cancelArticleCollect(
    @Query('articleId') articleId: string,
    @UserInfo('userId') userId: number,
  ) {
    return await this.articleService.cancelArticleCollect(articleId, userId);
  }
}
