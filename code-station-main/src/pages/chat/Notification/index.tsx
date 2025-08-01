import './index.css';
// import {Tabs} from "antd";
import {
  agreeFriendRequest,
  friendRequestList,
  rejectFriendRequest,
} from '@/services/chat';
import { Table, Tabs, TabsProps, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  headPic: string;
  username: string;
  email: string;
  captcha: string;
}

export interface FriendRequest {
  id: number;
  fromUserId: number;
  toUserId: number;
  reason: string;
  createTime: Date;
  fromUser: User;
  toUser: User;
  status: number;
}

const Notification = () => {
  const [form] = useForm();
  const [fromMe, setFromMe] = useState<Array<FriendRequest>>([]);
  const [toMe, setToMe] = useState<Array<FriendRequest>>([]);

  const onChange = (key: string) => {
    console.log(key);
  };

  async function queryFriendRequestList() {
    try {
      const res = await friendRequestList();

      setFromMe(
        res.fromMe.map((item: FriendRequest) => {
          return {
            ...item,
            key: item.id,
          };
        }),
      );
      setToMe(
        res.toMe.map((item: FriendRequest) => {
          return {
            ...item,
            key: item.id,
          };
        }),
      );
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data?.message,
      );
    }
  }

  useEffect(() => {
    queryFriendRequestList();
  }, []);

  const agree = async (fromUserId: number) => {
    try {
      const res = await agreeFriendRequest(fromUserId);

      message.success('操作成功');
      queryFriendRequestList();
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data?.message ||
          '系统繁忙，请稍后再试',
      );
    }
  };

  const reject = async (fromUserId: number) => {
    try {
      const res = await rejectFriendRequest(fromUserId);
      message.success('操作成功');
      queryFriendRequestList();
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data?.message ||
          '系统繁忙，请稍后再试',
      );
    }
  };

  const toMeColumn: ColumnsType<FriendRequest> = [
    {
      title: '用户',
      render: (_, record) => {
        return (
          <div>
            <img src={record.fromUser.headPic} width={30} height={30} />
            {'  ' + record.fromUser.username + '请求添加好友'}
          </div>
        );
      },
    },
    {
      title: '理由',
      dataIndex: 'reason',
    },
    {
      title: '请求时间',
      render: (_, record) => {
        return new Date(record.createTime).toLocaleString();
      },
    },
    {
      title: '操作',
      render: (_, record) => {
        if (record.status === 0) {
          return (
            <div>
              <a href="#" onClick={() => agree(record.fromUserId)}>
                同意
              </a>
              <br />
              <a href="#" onClick={() => reject(record.fromUserId)}>
                拒绝
              </a>
            </div>
          );
        } else {
          const map: Record<string, any> = {
            1: '已通过',
            2: '已拒绝',
          };
          return <div>{map[record.status]}</div>;
        }
      },
    },
  ];

  const fromMeColumns: ColumnsType<FriendRequest> = [
    {
      title: '用户',
      render: (_, record) => {
        return (
          <div>
            {' 请求添加好友 ' + record.toUser.username}
            <img src={record.toUser.headPic} width={30} height={30} />
          </div>
        );
      },
    },
    {
      title: '理由',
      dataIndex: 'reason',
    },
    {
      title: '请求时间',
      render: (_, record) => {
        return new Date(record.createTime).toLocaleString();
      },
    },
    {
      title: '状态',
      render: (_, record) => {
        const map: Record<string, any> = {
          0: '申请中',
          1: '已通过',
          2: '已拒绝',
        };
        return <div>{map[record.status]}</div>;
      },
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '我收到的',
      children: (
        <div style={{ width: 1000 }}>
          <Table columns={toMeColumn} dataSource={toMe}></Table>
        </div>
      ),
    },
    {
      key: '2',
      label: '我发出的',
      children: (
        <div style={{ width: 1000 }}>
          {/*{JSON.stringify(fromMe)}*/}
          {/*<Table columns={fromMeColumn} dataSource={fromMe}></Table>*/}
          <Table
            columns={fromMeColumns}
            dataSource={fromMe}
            style={{ width: '1000px' }}
          />
        </div>
      ),
    },
  ];

  return (
    <div id="notification-container">
      <div className="notification-list">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange}></Tabs>
      </div>
    </div>
  );
};

export default Notification;
