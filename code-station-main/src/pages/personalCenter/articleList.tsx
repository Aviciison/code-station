import { getArticleDetail } from '@/services/article';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import {
  Avatar,
  Button,
  // List,
  Divider,
  Skeleton,
  Space,
  Spin,
} from 'antd';
// import dayjs from 'dayjs';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './articleList.less';
import { typeList } from './index';

const ArticleList: React.FC<{
  total: number;
  data: typeList[];
  changeList: () => void;
  deleteArticle: (articleId: string) => void;
  type: string;
  isEnd?: boolean;
}> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { total, data, changeList, deleteArticle, type, isEnd = true } = props;

  const [editLoading, setEditLoading] = useState(false);
  const [chooseArticleId, setChooseArticleId] = useState<string>('');

  const onChange = () => {
    changeList();
  };

  const goArticle = () => {
    history.push('/article');
  };

  const EmptyComponent = () => (
    <div style={{ textAlign: 'center' }}>
      <img
        src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        alt="No Data"
        style={{ margin: '0 auto', marginBottom: 16 }}
      />
      {type === 'article' ? (
        <span>
          <p className="empty-text">您还没分享过文章哦</p>
          <Button type="primary" onClick={goArticle}>
            去分享
          </Button>
        </span>
      ) : (
        <p className="empty-text">您还没收藏过文章哦</p>
      )}
    </div>
  );
  // 查看文章详情
  const goDetail = (articleId: string) => {
    history.push(
      {
        pathname: `/articleDetail/${articleId}`,
      },
      // {
      //   articleId,
      //   isUser: true, // 是否从个人页面跳过去
      // },
    );
  };

  // 修改文章内容
  const goEdit = async (articleId: string) => {
    setChooseArticleId(articleId);
    setEditLoading(true);
    try {
      const detail = await getArticleDetail(articleId);
      // 跳转至编辑文章页面
      // setInfo(res);
      history.push(
        {
          pathname: '/article',
        },
        detail,
      );
    } catch (e) {
      console.log(e);
    } finally {
      setEditLoading(false);
    }
  };

  const EditButton = ({ articleId }: { articleId: string }) => {
    return editLoading && chooseArticleId === articleId ? (
      <Spin></Spin>
    ) : (
      <Button onClick={() => goEdit(articleId)} type="text">
        <EditOutlined />
      </Button>
    );
  };

  return (
    <div className="articleList">
      {data.length === 0 ? (
        <EmptyComponent></EmptyComponent>
      ) : (
        <InfiniteScroll
          hasMore={!isEnd}
          dataLength={data.length}
          next={() => onChange()}
          loader={
            <Skeleton
              style={{ marginTop: '10px' }}
              avatar
              paragraph={{ rows: 2 }}
              active
            />
          }
          // endMessage={<Divider plain>到底了</Divider>}
          endMessage={<div style={{ textAlign: 'center' }}>到底了</div>}
        >
          {data.map((item, index) => {
            return (
              <div key={index}>
                <div className="articleList-item">
                  <div className="articleList-item-head flex">
                    <Space size={5}>
                      <Avatar size={30} src={item.headPic}></Avatar>
                      <span className="articleList-item-head-username">
                        {item.username}
                      </span>
                    </Space>
                  </div>
                  <div className="articleList-item-body flex">
                    <div className="articleList-item-body-left flex-1">
                      <div
                        onClick={() => goDetail(item.articleId)}
                        className="articleList-item-body-left-title font-extrabold truncate"
                      >
                        {item.articleTitle}
                      </div>
                      <div className="articleList-item-body-left-description">
                        {item.description}
                      </div>
                      {type === 'article' ? (
                        <div className="articleList-item-body-left-action">
                          <Space size={16}>
                            <Button key="delete" type="text">
                              <DeleteOutlined
                                onClick={() => deleteArticle(item.articleId)}
                              ></DeleteOutlined>
                            </Button>
                            <EditButton articleId={item.articleId}></EditButton>
                          </Space>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="articleList-item-body-right">
                      <img src={item.coverPic} alt="" />
                    </div>
                  </div>
                </div>
                <Divider style={{ margin: '8px 0' }}></Divider>
              </div>
            );
          })}
        </InfiniteScroll>
      )}
    </div>
    // <div>
    //   {/* <List
    //     locale={{ emptyText: <EmptyComponent></EmptyComponent> }}
    //     itemLayout="vertical"
    //     size="large"
    //     dataSource={data}
    //     pagination={{
    //       position: 'bottom',
    //       align: 'end',
    //       total: total,
    //       onChange: onChange,
    //       pageSize: 3,
    //     }}
    //     renderItem={(item, index) => {
    //       return (
    //         <List.Item
    //           key={index}
    //           actions={[
    //             <div key="time">
    //               {dayjs(item.updateTime).format('YYYY-MM-DD HH:mm')}
    //             </div>,
    //             <Button key="delete" type="text">
    //               <DeleteOutlined
    //                 onClick={() => deleteArticle(item.articleId)}
    //               ></DeleteOutlined>
    //             </Button>,
    //             <EditButton key="edit" articleId={item.articleId}></EditButton>,
    //           ]}
    //           extra={
    //             <div className="cover-div">
    //               <img className="cover" alt="logo" src={item.coverPic} />
    //             </div>
    //           }
    //         >
    //           <List.Item.Meta
    //             avatar={
    //               <Avatar
    //                 src={
    //                   item.headPic
    //                     ? item.headPic
    //                     : 'https://thirdwx.qlogo.cn/mmopen/vi_32/Ys3C0M5PTtic…a3iaCuKNCHxY8VRTDicxlQibeDVA20bEBkcw3masxILqg/132'
    //                 }
    //               />
    //             }
    //             title={<div>{item.username}</div>}
    //           ></List.Item.Meta>
    //           <div>
    //             <h5 className="post-title">
    //               <span onClick={() => goDetail(item.articleId)}>
    //                 {item.articleTitle}
    //               </span>
    //             </h5>
    //           </div>
    //           <div>
    //             <div className="description">{item.description}</div>
    //           </div>
    //         </List.Item>
    //       );
    //     }}
    //   ></List> */}

    // </div>
  );
};

export default ArticleList;
