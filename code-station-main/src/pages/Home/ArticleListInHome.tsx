// import { Divider, Skeleton } from 'antd';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { articleList } from '@/services/article';
import { LikeOutlined, StarFilled } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Avatar, Space } from 'antd';
import { typeList } from 'src/pages/personalCenter';
import TimeAgo from 'timeago-react';
import './ArticleListInHome.less';

const ArticleListInHome: React.FC<typeList> = (props: typeList) => {
  const {
    articleId,
    articleTitle,
    coverPic,
    description,
    headPic,
    updateTime,
    username,
    likeCount,
    collectCount,
  } = props;

  const goDetail = (id: string) => {
    // 跳转至文章详情页
    history.push({
      pathname: `/articleDetail/${id}`,
    });
  };

  return (
    <article className="article">
      <div className="article-list-head">
        <Space size={16}>
          <Avatar src={headPic}></Avatar>
          <span className="article-list-head-nickname">{username}</span>
        </Space>
      </div>
      <div className="article-list-body">
        <div className="article-list-body-left">
          <h2
            className="article-list-body-left-title"
            onClick={() => goDetail(articleId)}
          >
            {articleTitle}
          </h2>
          <p className="article-list-body-left-description">{description}</p>
          <div className="article-list-body-left-footer">
            <TimeAgo datetime={updateTime} locale="zh_CN"></TimeAgo>
            <div className="article-list-body-left-footer-like">
              <LikeOutlined />
              <span style={{ marginLeft: '5px' }}>{likeCount}</span>
            </div>
            <div className="article-list-body-left-footer-collect">
              <StarFilled />
              <span style={{ marginLeft: '5px' }}>{collectCount}</span>
            </div>
          </div>
        </div>
        <div className="article-list-body-right">
          <img src={coverPic} alt="" />
        </div>
      </div>
      {/* <InfiniteScroll
        dataLength={activeList.length}
        next={() => getList()}
        hasMore={!isEnd}
        loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
        endMessage={<Divider plain>到底了</Divider>}
      >
        <List
          dataSource={activeList}
          itemLayout="vertical"
          size="large"
          renderItem={(item, index) => {
            return (
              <List.Item
                key={index}
                actions={[
                  <div key="time">
                    {dayjs(item.updateTime).format('YYYY-MM-DD HH:mm')}
                  </div>,
                ]}
                extra={
                  <div className="cover-div">
                    <Image className="cover" alt="logo" src={item.coverPic} />
                  </div>
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        item.headPic
                          ? item.headPic
                          : 'https://thirdwx.qlogo.cn/mmopen/vi_32/Ys3C0M5PTtic…a3iaCuKNCHxY8VRTDicxlQibeDVA20bEBkcw3masxILqg/132'
                      }
                    />
                  }
                  title={<div>{item.username}</div>}
                ></List.Item.Meta>
                <div>
                  <h5 className="post-title">
                    <span onClick={() => goDetail(item.articleId)}>
                      {item.articleTitle}
                    </span>
                  </h5>
                </div>
                <div>
                  <div className="description">{item.description}</div>
                </div>
              </List.Item>
            );
          }}
        ></List>
      </InfiniteScroll> */}
    </article>
  );
};

export default ArticleListInHome;
