import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EntityManager, Repository, In, Like } from 'typeorm';
import { AddArticleDto } from './dto/add-article.dto';
import { updateArticleDto } from './dto/update-artcile.dto';
import { Article } from './entities/article.entity';
import { label } from './entities/label.entity';
import {
  articleAllListVo,
  articleByUserListVo,
  articleDetailVo,
  articleList,
} from './vo/article.vo';
import { RedisService } from '../redis/redis.service';
import { articleExtra } from './entities/articleExtra.entity';
import { articleLike } from './entities/articleLike.entity';
import { articleCollect } from './entities/articleCollect.entity';

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @InjectRepository(Article)
  private articleRepository: Repository<Article>;

  @InjectRepository(articleExtra)
  private articleExtraRepository: Repository<articleExtra>;

  @InjectRepository(label)
  private labelRepository: Repository<label>;

  @InjectRepository(articleLike)
  private articleLike: Repository<articleLike>;

  @InjectRepository(articleCollect)
  private articleCollect: Repository<articleCollect>;

  @Inject(RedisService)
  private redisService: RedisService;

  // 新增文章
  async addArticle(addArticleDto: AddArticleDto, userId: number) {
    try {
      const user = await this.entityManager.findOneBy(User, {
        id: userId,
      });

      const newArticle = new Article();
      newArticle.articleContent = addArticleDto.articleContent;
      newArticle.articleTitle = addArticleDto.articleTitle;
      newArticle.description = addArticleDto.description;
      newArticle.coverPic = addArticleDto.coverPic;
      newArticle.user = user;

      await this.entityManager.save(Article, newArticle);
      const labelList = addArticleDto.associatedLabels.map((item) => {
        const newLabel = new label();
        newLabel.articleId = newArticle.articleId;
        newLabel.labelId = item;
        return newLabel;
      });

      await this.labelRepository.save(labelList);

      const extra = new articleExtra();
      extra.articleId = newArticle.articleId;
      await this.articleExtraRepository.save(extra);

      return '文章添加成功';
    } catch (e) {
      throw new BadRequestException('新增失败，请稍后重试');
    }
  }

  // 根据用户查询
  async find(pageNo: number, pageSize: number, userId: number) {
    const skipCount = (pageNo - 1) * pageSize;
    const condition: Record<string, any> = {};
    condition.user = {
      id: userId,
    };
    // relations: {user: true,} 带上这个是将写文章的用户信息全部返回
    const [article, total] = await this.articleRepository.findAndCount({
      // 外键是否使用
      relations: {
        user: true,
      },
      // select: ['id', 'articleTitle', 'description', 'updateTime'],
      // 过滤字段
      select: {
        articleId: true,
        articleTitle: true,
        description: true,
        updateTime: true,
        user: {
          username: true,
          headPic: true,
        },
        coverPic: true,
      },
      skip: skipCount,
      take: pageSize,
      where: condition,
      order: {
        updateTime: 'DESC',
      },
    });
    console.log(article);

    const articleList = article.map((item) => {
      return {
        articleId: item.articleId,
        articleTitle: item.articleTitle,
        description: item.description,
        updateTime: item.updateTime,
        coverPic: item.coverPic,
        username: item.user.username,
        headPic: item.user.headPic,
      };
    });

    const vo = new articleByUserListVo();
    vo.articleList = articleList;
    vo.pageNo = pageNo;
    vo.pageSize = pageSize;
    vo.total = total;
    return vo;
  }

  // 查询用户收藏文章
  async articleByUserCollectList(
    pageNo: number,
    pageSize: number,
    userId: number,
  ) {
    // 根据用户id查询收藏的文章id
    const articleIdList = await this.articleCollect.find({
      where: {
        userId,
      },
      select: ['articleId'],
    });
    console.log(articleIdList, 'articleIdList');

    // 根据文章id 查询文章
    const skipCount = (pageNo - 1) * pageSize;
    const [article, total] = await this.articleRepository.findAndCount({
      // 外键是否使用
      relations: {
        user: true,
      },
      // 过滤字段
      select: {
        articleId: true,
        articleTitle: true,
        description: true,
        updateTime: true,
        coverPic: true,
        user: {
          username: true,
          headPic: true,
        },
      },
      skip: skipCount,
      take: pageSize,
      order: {
        updateTime: 'DESC',
      },
      where:
        articleIdList.length === 0
          ? {
              articleId: '',
            }
          : articleIdList.map((item) => {
              return {
                articleId: item.articleId,
              };
            }),
    });
    // return article;
    const articleList: articleList[] = article.map((item) => {
      return {
        articleId: item.articleId,
        articleTitle: item.articleTitle,
        description: item.description,
        coverPic: item.coverPic,
        updateTime: item.updateTime,
        username: item.user.username,
        headPic: item.user.headPic,
      };
    });
    const vo = new articleAllListVo();
    vo.pageNo = pageNo;
    vo.pageSize = pageSize;
    vo.articleList = articleList;
    vo.total = total;
    vo.isEnd = total !== 0 ? Math.ceil(total / pageSize) === pageNo : true;
    return vo;
  }

  // C端用户删除自己的文章
  async removeArticleByUser(articleId: string) {
    try {
      await this.entityManager.delete(Article, { articleId });
      await this.labelRepository.delete({ articleId });
      return '删除成功';
    } catch (e) {
      throw new BadRequestException('删除失败，请稍后重试');
    }
  }

  // C端用户可以修改自己的文章
  async updateArticleByUser(updateArticleDto: updateArticleDto) {
    const article = await this.articleRepository.findOneBy({
      articleId: updateArticleDto.articleId,
    });
    if (!article) {
      throw new BadRequestException('文章不存在');
    }
    article.articleContent = updateArticleDto.articleContent;
    article.articleTitle = updateArticleDto.articleTitle;
    article.description = updateArticleDto.description;
    article.coverPic = updateArticleDto.coverPic;

    // 更新文章的标签
    try {
      await this.articleRepository.update(
        {
          articleId: article.articleId,
        },
        article,
      );
      await this.labelRepository.delete({
        articleId: updateArticleDto.articleId,
      });

      const labelList = updateArticleDto.associatedLabels.map((item) => {
        const newLabel = new label();
        newLabel.articleId = updateArticleDto.articleId;
        newLabel.labelId = item;
        return newLabel;
      });

      await this.labelRepository.save(labelList);
      return '更新成功';
    } catch (e) {
      throw new BadRequestException('文章更新失败');
    }
  }

  // C端查询所有文章
  async findAll(pageNo: number, pageSize: number, labelId: string) {
    // console.log(associatedLabels);
    const condition: Record<string, any> = {};
    if (labelId !== 'all') {
      const articleId = await this.labelRepository.find({
        select: {
          articleId: true,
        },
        where: { labelId: labelId },
      });
      condition.articleId = In(articleId.map((item) => item.articleId));
    }

    const skipCount = (pageNo - 1) * pageSize;

    const [article, total] = await this.articleRepository.findAndCount({
      // 外键是否使用
      relations: {
        user: true,
      },
      // 过滤字段
      select: {
        articleId: true,
        articleTitle: true,
        description: true,
        updateTime: true,
        coverPic: true,
        user: {
          username: true,
          headPic: true,
        },
      },
      skip: skipCount,
      take: pageSize,
      order: {
        updateTime: 'DESC',
      },
      where: condition,
    });

    const array = [];

    const articleList: articleList[] = article.map((item) => {
      return {
        articleId: item.articleId,
        articleTitle: item.articleTitle,
        description: item.description,
        coverPic: item.coverPic,
        updateTime: item.updateTime,
        username: item.user.username,
        headPic: item.user.headPic,
      };
    });

    article.forEach(async (item, index) => {
      array.push(
        new Promise((result, rej) => {
          this.articleExtraRepository
            .findOne({
              where: {
                articleId: item.articleId,
              },
              select: ['likeCount', 'collectCount'],
            })
            .then((res) => {
              console.log(res);

              result(res.likeCount);
              articleList[index].likeCount = res.likeCount || 0;
              articleList[index].collectCount = res.collectCount || 0;
            });
        }),
      );
    });
    return Promise.all(array).then(() => {
      const vo = new articleAllListVo();
      vo.pageNo = pageNo;
      vo.pageSize = pageSize;
      vo.articleList = articleList;
      vo.total = total;
      vo.isEnd = total !== 0 ? Math.ceil(total / pageSize) === pageNo : true;
      return vo;
    });

    // const vo = new articleAllListVo();
    // vo.pageNo = pageNo;
    // vo.pageSize = pageSize;
    // vo.articleList = articleList;
    // vo.total = total;
    // vo.isEnd = total !== 0 ? Math.ceil(total / pageSize) === pageNo : true;
    // return vo;
  }

  // C端查看文章详情
  async getDetail(articleId: string, userId: number) {
    // 查看文章增加阅读量
    // await this.view(articleId);
    // findOne适合处理比较复杂的单个查询， findOneBy只能适合查询比较简单的
    const detail = await this.articleRepository.findOne({
      where: {
        articleId,
      },
      relations: {
        user: true,
      },
      select: {
        articleId: true,
        articleTitle: true,
        description: true,
        updateTime: true,
        articleContent: true,
        coverPic: true,
        // associatedLabels: true,
        user: {
          username: true,
        },
      },
    });
    console.log(detail);

    const labelId = await this.labelRepository.find({
      select: {
        labelId: true,
      },
      where: {
        articleId: articleId,
      },
    });
    let isLike = false;
    let isCollect = false;
    if (userId) {
      (await this.articleLike.findOne({
        where: {
          articleId,
          userId,
        },
      }))
        ? (isLike = true)
        : (isLike = false);

      (await this.articleCollect.findOne({
        where: {
          articleId,
          userId,
        },
      }))
        ? (isCollect = true)
        : (isCollect = false);
    }

    // likeCount = await this.redisService.get(`count_like_article_${articleId}`);
    // if (!likeCount) {
    const { likeCount, collectCount } =
      await this.articleExtraRepository.findOne({
        where: {
          articleId,
        },
        select: ['likeCount', 'collectCount'],
      });
    // 跟新数据到redis
    // await this.redisService.set(`count_like_article_${articleId}`, likeCount);
    // }

    const vo = new articleDetailVo();
    vo.articleTitle = detail.articleTitle;
    vo.description = detail.description;
    vo.articleId = detail.articleId;
    vo.updateTime = detail.updateTime;
    vo.username = detail.user.username;
    vo.articleContent = detail.articleContent;
    vo.coverPic = detail.coverPic;
    vo.isLike = isLike;
    vo.isCollect = isCollect;
    vo.likeCount = likeCount;
    vo.collectCount = collectCount;
    vo.associatedLabels = labelId.map((item) => item.labelId);

    return vo;
  }

  // 阅读文章增加阅读量
  async view(articleId: string, userId?: number | string) {
    const res = await this.redisService.hashGet(`article_${articleId}`);

    if (res.viewCount === undefined) {
      let articleExtraOne;
      // 查询redis数据看看有没有存入viewCount没有的话，先存一次数据库，然后再存入redis
      articleExtraOne = await this.articleExtraRepository.findOne({
        where: {
          articleId,
        },
      });

      if (!articleExtraOne) {
        // 额外数据表没有关于这篇文章的数据，进行添加后再查询具体结果返回
        const newArticleExtra = new articleExtra();
        newArticleExtra.articleId = articleId;
        await this.articleExtraRepository.save(newArticleExtra);

        articleExtraOne = await this.articleExtraRepository.findOne({
          where: {
            articleId,
          },
        });
      }
      articleExtraOne.viewCount = articleExtraOne.viewCount + 1;

      await this.articleExtraRepository.update(
        { id: articleExtraOne.id, articleId: articleExtraOne.articleId },
        {
          viewCount: articleExtraOne.viewCount,
        },
      );

      await this.redisService.hashSet(`article_${articleId}`, {
        viewCount: articleExtraOne.viewCount,
      });

      // 登录用户存储一个redis标志 10分钟内不可以再增加阅读量
      await this.redisService.set(
        `user_${userId}_article_${articleId}`,
        1,
        600,
      );

      return articleExtraOne.viewCount;
    } else {
      // 10分钟之内再查到有这个标志，就不增加阅读量
      const flag = await this.redisService.get(
        `user_${userId}_article_${articleId}`,
      );

      if (flag) {
        return res.viewCount;
      }

      await this.redisService.hashSet(`article_${articleId}`, {
        ...res,
        viewCount: +res.viewCount + 1,
      });

      await this.redisService.set(
        `user_${userId}_article_${articleId}`,
        1,
        600,
      );

      return +res.viewCount + 1;
    }
  }

  // 点赞文章增加点赞量（使用redis版本）
  // async addLike(articleId: string, userId: number) {
  //   // 判断该用户是否点赞过文章，查看redis和数据库
  //   const isExistLikebd = await this.articleLike.find({
  //     where: { articleId, userId },
  //   });
  //   const isExistLikeRedis = await this.redisService.get(
  //     `like_article_${articleId}_${userId}`,
  //   );

  //   if (isExistLikebd.length !== 0 || isExistLikeRedis) {
  //     throw new BadRequestException('您已经点赞过文章');
  //   }

  //   // 用户行为存在redis
  //   await this.redisService.set(`like_article_${articleId}_${userId}`, 1);
  //   // 点赞数量存到redis
  //   // 判断redis有没有存数量
  //   const isExistLikeCountRedis = await this.redisService.get(
  //     `count_like_article_${articleId}`,
  //   );
  //   if (!isExistLikeCountRedis) {
  //     // 如果没有直接将数据库的数据加1存到 redis
  //     const articleExtra = await this.articleExtraRepository.findOne({
  //       select: ['likeCount'],
  //       where: {
  //         articleId,
  //       },
  //     });
  //     const count = articleExtra.likeCount + 1;
  //     await this.redisService.set(`count_like_article_${articleId}`, count);
  //   } else {
  //     // redis 有数据 直接加1存到redis
  //     const count = parseInt(isExistLikeCountRedis) + 1;
  //     await this.redisService.set(`count_like_article_${articleId}`, count);
  //   }
  //   // this.likeRedisToDB();
  //   return '点赞成功';
  // }

  // 点赞文章增加点赞量（使用mysql版本）
  async addLike(articleId: string, userId: number) {
    // 判断该用户是否点赞过文章，查看redis和数据库
    const isExistLikebd = await this.articleLike.find({
      where: { articleId, userId },
    });

    if (isExistLikebd.length !== 0) {
      throw new BadRequestException('您已经点赞过文章');
    }

    try {
      // 存储数据用户行为
      const articleLikeUser = new articleLike();
      articleLikeUser.userId = userId;
      articleLikeUser.articleId = articleId;
      await this.articleLike.save(articleLikeUser);

      // 数量加一
      const like = await this.articleExtraRepository.findOne({
        where: {
          articleId,
        },
        select: ['likeCount'],
      });
      like.likeCount = like.likeCount + 1;

      await this.articleExtraRepository.update(
        { articleId: articleId },
        {
          likeCount: like.likeCount,
        },
      );
      return '点赞成功';
    } catch (e) {
      throw new BadRequestException('点赞失败');
    }
  }

  // 取消点赞减少点赞量
  async cancelLike(articleId: string, userId: number) {
    const isExistLikebd = await this.articleLike.find({
      where: { articleId, userId },
    });

    if (isExistLikebd.length === 0) {
      throw new BadRequestException('您还没点赞该文章');
    }

    try {
      await this.articleLike.delete({
        articleId,
        userId,
      });

      // 数量减一
      const like = await this.articleExtraRepository.findOne({
        where: {
          articleId,
        },
        select: ['likeCount'],
      });
      if (like.likeCount > 0) {
        like.likeCount = like.likeCount - 1;
        await this.articleExtraRepository.update(
          { articleId: articleId },
          {
            likeCount: like.likeCount,
          },
        );
      }
      return '取消点赞成功';
    } catch (e) {
      throw new BadRequestException('取消点赞失败');
    }
  }

  // 收藏文章
  async addArticleCollect(articleId: string, userId: number) {
    // 判断该用户是否点赞过文章，查看redis和数据库
    const isExistCollect = await this.articleCollect.find({
      where: { articleId, userId },
    });

    if (isExistCollect.length !== 0) {
      throw new BadRequestException('您已经收藏过该文章');
    }

    try {
      // 存储用户行为
      const articleCollectUser = new articleCollect();
      articleCollectUser.articleId = articleId;
      articleCollectUser.userId = userId;
      await this.articleCollect.save(articleCollectUser);

      // 收藏量加1
      const collect = await this.articleExtraRepository.findOne({
        where: {
          articleId,
        },
        select: ['collectCount'],
      });
      collect.collectCount = collect.collectCount + 1;

      await this.articleExtraRepository.update(
        { articleId: articleId },
        {
          collectCount: collect.collectCount,
        },
      );
      return '收藏成功';
    } catch (e) {
      throw new BadRequestException('收藏文章失败');
    }
  }

  // 取消收藏
  async cancelArticleCollect(articleId: string, userId: number) {
    const isExistCollect = await this.articleCollect.find({
      where: { articleId, userId },
    });

    if (isExistCollect.length === 0) {
      throw new BadRequestException('您还没收藏该文章');
    }

    try {
      await this.articleCollect.delete({
        articleId,
        userId,
      });

      // 数量减一
      const collect = await this.articleExtraRepository.findOne({
        where: {
          articleId,
        },
        select: ['collectCount'],
      });
      if (collect.collectCount > 0) {
        collect.collectCount = collect.collectCount - 1;
        await this.articleExtraRepository.update(
          { articleId: articleId },
          {
            collectCount: collect.collectCount,
          },
        );
      }
      return '取消收藏成功';
    } catch (e) {
      throw new BadRequestException('取消收藏失败');
    }
  }

  // 定时将redis里面的阅读量存到数据库
  async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`);
    console.log(keys);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      // 查询每个redis里面的值存储到数据库
      const res = await this.redisService.hashGet(key);

      console.log(res);

      const [, id] = key.split('_');

      await this.articleExtraRepository.update(
        { articleId: id },
        {
          viewCount: +res.viewCount,
        },
      );
    }
  }

  // 定时将redis里面点赞量存到数据
  async likeRedisToDB() {
    const articleKeys = await this.redisService.keys(`like_article_*`);
    const likeCount = await this.redisService.keys(`count_like_article_*`);
    for (let i = 0; i < articleKeys.length; i++) {
      const key = articleKeys[i];
      const [, , articleId, userId] = key.split('_');
      const isExistLikebd = await this.articleLike.find({
        where: { articleId, userId: parseInt(userId) },
      });

      if (isExistLikebd.length === 0) {
        const like = new articleLike();
        like.articleId = articleId;
        like.userId = parseInt(userId);
        await this.articleLike.save(like);
      }
    }
    for (let a = 0; a < likeCount.length; a++) {
      const key = likeCount[a];

      const res = await this.redisService.get(key);
      const [, , , articleId] = key.split('_');
      await this.articleExtraRepository.update(
        {
          articleId: articleId,
        },
        {
          likeCount: parseInt(res),
        },
      );
    }
  }
}
