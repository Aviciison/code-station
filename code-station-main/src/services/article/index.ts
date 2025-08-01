import { detail } from '@/pages/article/index';
import instance from '@/utils/request';
import {
  addArticleType,
  articleAllListType,
  articleByUserListType,
  articleDetailType,
  paginationType,
} from './articleType';

// 新增文章
export const addArticle = async (data: addArticleType) => {
  return await instance.post('article/addArticle', {
    ...data,
  });
};

// 查询用户本身文章
export const articleByUserList = async (
  pagination: paginationType,
): Promise<articleByUserListType> => {
  return await instance.get('article/articleByUserList', {
    params: {
      ...pagination,
    },
  });
};

// 个人中心删除文章
export const removeArticleByUser = async (articleId: string) => {
  return await instance.get('article/removeArticleByUser', {
    params: {
      articleId: articleId,
    },
  });
};

// 查询用户收藏文章
export const articleByUserCollectList = async (
  pagination: paginationType,
): Promise<articleByUserListType> => {
  return await instance.get('article/articleByUserCollectList', {
    params: {
      ...pagination,
    },
  });
};

// 查询所有文章
export const articleList = async (
  pagination: paginationType,
): Promise<articleAllListType> => {
  return await instance.get('article/articleList', {
    params: {
      ...pagination,
    },
  });
};

// 查看文章详情
export const getArticleDetail = async (
  articleId: string,
  userId?: number,
): Promise<articleDetailType> => {
  return await instance.post('article/getArticleDetail', {
    articleId,
    userId,
  });
};

// 修改文章内容
export const updateArticleByUser = async (data: detail) => {
  return await instance.post('article/updateArticleByUser', data);
};

// 获取阅读数量再增加一次阅读量
export const addView = async (articleId: string): Promise<number> => {
  return await instance.get('article/addView', {
    params: {
      articleId,
    },
  });
};

// 取消点赞
export const cancelArticleLike = async (articleId: string) => {
  return await instance.get('article/cancelArticleLike', {
    params: {
      articleId,
    },
  });
};

// 点赞
export const addLike = async (articleId: string) => {
  return await instance.get('article/addArticleLike', {
    params: {
      articleId,
    },
  });
};

// 收藏
export const addArticleCollect = async (articleId: string) => {
  return await instance.get('article/addArticleCollect', {
    params: {
      articleId,
    },
  });
};

// 取消收藏
export const cancelArticleCollect = async (articleId: string) => {
  return await instance.get('article/cancelArticleCollect', {
    params: {
      articleId,
    },
  });
};
