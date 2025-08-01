// 个人中心页面

import {
  articleByUserCollectList,
  articleByUserList,
  removeArticleByUser,
} from '@/services/article';
import { ProCard } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import type { TabsProps } from 'antd';
import { Avatar, Button, Flex, Skeleton, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import ArticleList from './articleList';
import './personalCenter.less';

export interface typeList {
  username: string;
  description: string;
  articleTitle: string;
  updateTime: Date;
  articleId: string;
  coverPic: string;
  headPic: string;
  likeCount: number;
  collectCount: number;
}

const PersonalCenter: React.FC = () => {
  // 获取个人资料
  const { userInfo } = useModel('global');
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<typeList[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const changeArticleList = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const res = await articleByUserList({ pageSize, pageNo: page });
      setTotal(res.total);
      setData(res.articleList);
      setPageNo(page);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const res = await removeArticleByUser(id);
      message.success('删除成功');
      console.log(res);
      changeArticleList(pageNo, 999);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await articleByUserList({ pageSize: 999, pageNo: 1 });
        setTotal(res.total);
        setData(res.articleList);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const goEdit = () => {
    history.push({
      pathname: '/editPerson',
    });
  };

  const getCollectArticleList = async (pageNo: number) => {
    setLoading(true);
    try {
      const res = await articleByUserCollectList({ pageNo, pageSize: 10 });
      setTotal(res.total);
      setData(res.articleList);
      setPageNo(pageNo);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: string) => {
    setData([]);
    setTotal(0);
    setPageNo(1);
    if (e === '1') {
      changeArticleList(1, 999);
    }
    if (e === '2') {
      getCollectArticleList(pageNo);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '文章',
      children: loading ? (
        <Skeleton avatar active paragraph={{ rows: 3 }}></Skeleton>
      ) : (
        <ArticleList
          total={total}
          data={data}
          changeList={() => console.log('111')}
          deleteArticle={deleteArticle}
          type="article"
        ></ArticleList>
      ),
    },
    {
      key: '2',
      label: '收藏',
      children: loading ? (
        <Skeleton avatar active paragraph={{ rows: 3 }}></Skeleton>
      ) : (
        <ArticleList
          total={total}
          data={data}
          changeList={() => getCollectArticleList(pageNo + 1)}
          deleteArticle={deleteArticle}
          type="collect"
        ></ArticleList>
      ),
    },
  ];

  return (
    <div className="center-card">
      <ProCard className="top ">
        <Flex className="flex-index" justify={'space-between'}>
          <div className="userInfo">
            <div className="userInfo-avatar">
              <Avatar
                className="big"
                size={96}
                src={
                  userInfo.headPic
                    ? userInfo.headPic
                    : 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg'
                }
              ></Avatar>
            </div>
            <div className="userInfo-text">
              <h4>{userInfo.username}</h4>
              <div className="userInfo-text-dec">
                {userInfo.personalProfile
                  ? userInfo.personalProfile
                  : '暂无个人简介'}
              </div>
            </div>
          </div>
          <Button onClick={() => goEdit()}>编辑个人资料</Button>
        </Flex>
        <div className="upDown">
          <Avatar
            className="small"
            size={50}
            src={
              userInfo.headPic
                ? userInfo.headPic
                : 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg'
            }
          ></Avatar>
          <div className="upDown-userInfo">
            <div className="upDown-userInfo-center">
              <div className="upDown-userInfo-center-username">
                {userInfo.username}
              </div>
              <div>
                <Button onClick={() => goEdit()}>编辑资料</Button>
              </div>
            </div>
            <div className="upDown-userInfo-bottom">
              {userInfo.personalProfile
                ? userInfo.personalProfile
                : '暂无个人简介'}
            </div>
          </div>
        </div>
      </ProCard>
      {/* 文章列表 */}
      <ProCard className="list">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          size={'large'}
        />
      </ProCard>
    </div>
  );
};

export default PersonalCenter;
