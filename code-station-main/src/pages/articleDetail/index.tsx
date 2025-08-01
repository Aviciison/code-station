import MarkdownRenderer from '@/components/MarkdownRenderer';
import {
  addArticleCollect,
  addLike,
  addView,
  cancelArticleCollect,
  cancelArticleLike,
  getArticleDetail,
} from '@/services/article';
import { articleDetailType } from '@/services/article/articleType';
import {
  EllipsisOutlined,
  LikeOutlined,
  LikeTwoTone,
  StarOutlined,
  StarTwoTone,
} from '@ant-design/icons';
import { history, useModel, useParams } from '@umijs/max';
import { Card, Divider, FloatButton, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
// import 'juejin-markdown-themes/dist/condensed-night-purple';
// import 'juejin-markdown-themes/dist/condensed-night-purple.min.css';
import { useEffect, useState } from 'react';
import './articleDetail.less';

const { Title } = Typography;

const ArticleDetail = () => {
  const { articleId } = useParams();
  const { userInfo } = useModel('global');

  const [viewCount, setViewCount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  // const { articleId, isUser } = location.state as {
  //   articleId: string;
  //   isUser: boolean;
  // };

  const [info, setInfo] = useState<articleDetailType>({
    articleId: '',
    articleTitle: '',
    description: '',
    updateTime: new Date(),
    username: '',
    articleContent: '',
    isLike: false,
    isCollect: false,
    likeCount: 0,
    collectCount: 0,
  });

  useEffect(() => {
    const getDetail = async () => {
      console.log(userInfo, 'userInfo');
      setLoading(true);
      try {
        const res = await getArticleDetail(
          articleId as string,
          userInfo.id || undefined,
        );
        setInfo(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    const getView = async () => {
      try {
        const res = await addView(articleId as string);
        console.log(res, 'res');
        setViewCount(res);
      } catch (e) {
        console.log(e);
      }
    };
    if (articleId) {
      getDetail();
      getView();
    }
  }, []);

  // 取消点赞成功
  const cancelLik = async () => {
    if (!userInfo.id) {
      message.warning('请登录后使用该功能');
      return history.push('/login');
    }
    try {
      await cancelArticleLike(info.articleId);
      message.success('取消点赞成功');
      setInfo({ ...info, isLike: false, likeCount: info.likeCount - 1 });
    } catch (e) {
      console.log(e);
    }
  };

  // 点赞成功
  const addArticleLike = async () => {
    if (!userInfo.id) {
      message.warning('请登录后使用该功能');
      return history.push('/login');
    }
    try {
      await addLike(info.articleId);
      message.success('点赞成功');
      setInfo({ ...info, isLike: true, likeCount: info.likeCount + 1 });
    } catch (e) {
      console.log(e);
    }
  };

  // 取消收藏
  const cancelCollect = async () => {
    if (!userInfo.id) {
      message.warning('请登录后使用该功能');
      return history.push('/login');
    }
    try {
      await cancelArticleCollect(info.articleId);
      message.success('取消收藏成功');
      setInfo({
        ...info,
        isCollect: false,
        collectCount: info.collectCount - 1,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // 收藏
  const addCollect = async () => {
    if (!userInfo.id) {
      message.warning('请登录后使用该功能');
      return history.push('/login');
    }
    try {
      await addArticleCollect(info.articleId);
      message.success('收藏成功');
      setInfo({
        ...info,
        isCollect: true,
        collectCount: info.collectCount + 1,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Card
        loading={loading}
        style={{ maxWidth: 1000, margin: '0 auto' }}
        actions={[
          <div style={{ fontSize: '16px' }} key="like">
            <Space>
              {info.isLike ? (
                <LikeTwoTone onClick={() => cancelLik()}></LikeTwoTone>
              ) : (
                <LikeOutlined onClick={() => addArticleLike()} />
              )}
              <span>{info.likeCount}</span>
            </Space>
          </div>,
          <div style={{ fontSize: '16px' }} key="start">
            <Space>
              {info.isCollect ? (
                <StarTwoTone onClick={() => cancelCollect()} />
              ) : (
                // <StarFilled onClick={() => addCollect()}></StarFilled>
                <StarOutlined onClick={() => addCollect()} />
              )}
              <span>{info.collectCount}</span>
            </Space>
          </div>,
          <div style={{ fontSize: '16px' }} key="ellipsis">
            <Space>
              <EllipsisOutlined />
              <span>操作</span>
            </Space>
          </div>,
        ]}
      >
        <Title level={2}>{info?.articleTitle}</Title>
        <Space split={<Divider type="vertical" />} size="large">
          <div className="author-name">{info?.username}</div>
          <div className="article-tip">
            {dayjs(info?.updateTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div className="article-tip">
            阅读量 <span>{viewCount}</span>
          </div>
        </Space>
        <Divider />
        {/* 富文本内容展示 */}
        <MarkdownRenderer markdown={info?.articleContent}></MarkdownRenderer>
        {/* <div>
          <Space split={<Divider type="vertical" />}>
            <div style={{ fontSize: '16px' }}>
              {info.isLike ? (
                <LikeTwoTone></LikeTwoTone>
              ) : (
                <LikeOutlined></LikeOutlined>
              )}
              <span>{info.likeCount}</span>
            </div>
            <div>
              <StarFilled style={{ fontSize: '16px' }}></StarFilled>
            </div>
            <div>
              <EllipsisOutlined style={{ fontSize: '16px' }}></EllipsisOutlined>
            </div>
          </Space>
        </div> */}
      </Card>

      <div className="">
        <FloatButton.BackTop
          style={{ right: 34, width: 54, height: 54 }}
          onClick={() => console.log('onClick')}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;
