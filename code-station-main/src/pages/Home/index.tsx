import { articleList } from '@/services/article';
// import { DeleteOutlined } from '@ant-design/icons';
import { dictDataListType } from '@/models/ditc';
import { useModel } from '@umijs/max';
import { Divider, Empty, FloatButton, Skeleton, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { typeList } from 'src/pages/personalCenter';
import { getToken } from '../../utils/user-token';
import ArticleListInHome from './ArticleListInHome';
import './index.less';

const HomePage: React.FC = () => {
  console.log(getToken(), 'getToken');

  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { dictData, getDictData } = useModel('ditc');

  const [activeKey, setActiveKey] = useState<string>('all');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [total, setTotal] = useState<number>(0);

  const [isEnd, setIsEnd] = useState<boolean>(true);

  const [items, setItems] = useState([
    {
      key: 'all',
      label: '全部',
    },
  ]);

  const [activeList, setActiveList] = useState<typeList[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const getListMore = async (labelId: string = 'all') => {
    try {
      const res = await articleList({
        pageNo: pageNo + 1,
        pageSize,
        labelId,
      });
      setTotal(res.total);
      setActiveList([...activeList, ...res.articleList]);
      setPageSize(res.pageSize);
      setPageNo(res.pageNo);
      setIsEnd(res.isEnd);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      try {
        const res = await articleList({ pageNo, pageSize, labelId: 'all' });
        await getDictData('ASSOCIATE_LABELS');
        setItems([
          ...items,
          ...dictData.ASSOCIATE_LABELS.map((item: dictDataListType) => {
            return {
              key: item.value,
              label: item.label,
            };
          }),
        ]);
        setTotal(res.total);
        setActiveList(res.articleList);
        setPageSize(res.pageSize);
        setPageNo(res.pageNo);
        setIsEnd(res.isEnd);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getList();
  }, []);

  const articleClickTab = async (key: string) => {
    setLoading(true);
    try {
      const res = await articleList({ pageNo: 1, pageSize: 10, labelId: key });
      setActiveKey(key);
      setPageNo(1);
      setPageSize(10);
      setActiveList(res.articleList);
      setIsEnd(res.isEnd);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="container-top">
        <Tabs
          items={items}
          activeKey={activeKey}
          onTabClick={articleClickTab}
        ></Tabs>
      </div>
      <div className="container-content">
        <div className="container-content-left">
          <div className="article-card-wrap">
            {loading ? (
              <Skeleton avatar paragraph={{ rows: 2 }}></Skeleton>
            ) : (
              <div>
                {activeList.length === 0 ? (
                  <Empty></Empty>
                ) : (
                  <InfiniteScroll
                    hasMore={!isEnd}
                    dataLength={activeList.length}
                    next={() => getListMore(activeKey)}
                    loader={
                      <Skeleton
                        style={{ marginTop: '10px' }}
                        avatar
                        paragraph={{ rows: 2 }}
                        active
                      />
                    }
                    endMessage={<Divider plain>到底了</Divider>}
                  >
                    {activeList.map((item, index) => (
                      <ArticleListInHome
                        key={index}
                        articleId={item.articleId}
                        articleTitle={item.articleTitle}
                        description={item.description}
                        coverPic={item.coverPic}
                        headPic={item.headPic}
                        updateTime={item.updateTime}
                        username={item.username}
                        likeCount={item.likeCount}
                        collectCount={item.collectCount}
                      ></ArticleListInHome>
                    ))}
                    {/* {} */}
                  </InfiniteScroll>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="container-content-right"></div>
      </div>
      <div className="floatButton">
        <FloatButton.BackTop
          style={{ right: 34, width: 54, height: 54 }}
          onClick={() => console.log('onClick')}
        />
      </div>
    </div>
  );
};

export default HomePage;
