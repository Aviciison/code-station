import { favoriteDel, queryFavoriteList } from '@/services/chat';
import { Popconfirm, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export interface Favorite {
  id: number;
  chatHistory: {
    id: number;
    content: string;
    type: number;
    createTime: Date;
  };
}

const Collection = () => {
  const [favoriteList, setFavoriteList] = useState<Array<Favorite>>([]);

  const columns: ColumnsType<Favorite> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '内容',
      render: (_, record) => (
        <div>
          {record.chatHistory.type === 0 ? (
            record.chatHistory.content
          ) : record.chatHistory.type === 1 ? (
            <img
              src={record.chatHistory.content}
              alt=""
              style={{ maxHeight: 200 }}
            />
          ) : (
            <a href={record.chatHistory.content} download>
              {record.chatHistory.content}
            </a>
          )}
        </div>
      ),
    },
    {
      title: '发表时间',
      render: (_, record) => (
        <div>{new Date(record.chatHistory.createTime).toLocaleString()}</div>
      ),
    },
    {
      title: '操作',
      render: (_, record) => (
        <div>
          <Popconfirm
            title="删除收藏"
            description="确认删除吗？"
            onConfirm={() => delFavorite(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const query = async () => {
    try {
      const res = await queryFavoriteList();
      setFavoriteList(
        res.map((item: Favorite) => {
          return {
            ...item,
            key: item.id,
          };
        }),
      );
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data?.message ||
          '系统忙，请稍后重试',
      );
    }
  };

  const delFavorite = async (id: number) => {
    try {
      const res = await favoriteDel(id);
      message.success('删除成功');
      query();
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data?.message ||
          '系统忙，请稍后重试',
      );
    }
  };

  useEffect(() => {
    query();
  }, []);
  return (
    <div id="friendship-container">
      <div className="favorite-table">
        <Table
          columns={columns}
          dataSource={favoriteList}
          style={{ width: '1000px' }}
        ></Table>
      </div>
    </div>
  );
};

export default Collection;
