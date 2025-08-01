export interface articleList {
  articleId: string;
  articleTitle: string;
  description: string;
  updateTime: Date;
  coverPic: string;
  headPic: string;
  likeCount?: number;
  collectCount?: number;
  // username: string;
}

export class articleByUserListVo {
  pageNo: number;
  pageSize: number;
  total: number;
  articleList: Array<articleList>;
}

export class articleAllListVo {
  pageNo: number;
  pageSize: number;
  total: number;
  isEnd: boolean;
  articleList: Array<articleList>;
}

export class articleDetailVo {
  articleId: string;
  articleTitle: string;
  description: string;
  updateTime: Date;
  username: string;
  articleContent: string;
  coverPic: string;
  isLike: boolean;
  isCollect: boolean;
  likeCount: number;
  collectCount: number;
  associatedLabels: string[];
}
