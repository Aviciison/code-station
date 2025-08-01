export interface addArticleType {
  articleTitle: string;
  description: string;
  articleContent: string;
  coverPic: string;
  associatedLabels: string[];
}

export interface paginationType {
  pageNo: number;
  pageSize: number;
  labelId?: string;
}

export interface articleList {
  articleId: string;
  articleTitle: string;
  description: string;
  updateTime: Date;
  username: string;
  coverPic: string;
  headPic: string;
  likeCount: number;
  collectCount: number;
}

export interface articleByUserListType {
  pageNo: number;
  pageSize: number;
  total: number;
  articleList: Array<articleList>;
}

export interface articleAllListType {
  pageNo: number;
  pageSize: number;
  total: number;
  isEnd: boolean;
  articleList: Array<articleList>;
}

export interface articleDetailType {
  articleId: string;
  articleTitle: string;
  description: string;
  updateTime: Date;
  username: string;
  articleContent: string;
  isLike: boolean;
  isCollect: boolean;
  likeCount: number;
  collectCount: number;
}
