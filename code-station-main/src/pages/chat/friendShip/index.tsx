import { createOneToOne, findChatroom, friendshipList } from '@/services/chat';
import { history } from '@umijs/max';
import { Button, Form, Input, Table, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../chat';
import AddFriendModal from './AddFriendModal';
import './index.css';
// import { useNavigate } from "react-router-dom";

interface SearchFriend {
  name: string;
}

interface FriendshipSearchResult {
  id: number;
  username: string;
  headPic: string;
  email: string;
}

const FriendShip = () => {
  const [friendshipResult, setFriendshipResult] = useState<
    Array<FriendshipSearchResult>
  >([]);

  // const navigate = useNavigate();

  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);

  async function goToChat(friendId: number) {
    const userId = getUserInfo().id;
    try {
      const res = await findChatroom(userId, friendId);
      if (res) {
        history.push('/chat/chat', { id: res });
        // navigate('/chat', {
        //   state: {
        //     chatroomId: res,
        //   },
        // });
      } else {
        const res2 = await createOneToOne(friendId);
        history.push('/chat/chat', { id: res2 });
        // navigate('/chat', {
        //   state: {
        //     chatroomId: res2,
        //   },
        // });
      }
    } catch (e) {
      message.error(
        (e as AxiosError<{ message: string }>).response?.data.message ||
          '；系统忙，请稍后再试',
      );
    }
  }

  const columns: ColumnsType<FriendshipSearchResult> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '头像',
      render: (_, record) => {
        return (
          <div>
            <img style={{ width: '50px' }} src={record.headPic} />
          </div>
        );
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <div>
            <a
              href="#"
              onClick={() => {
                goToChat(record.id);
              }}
            >
              聊天
            </a>
          </div>
        );
      },
    },
  ];
  const searchFriend = async (values: SearchFriend) => {
    try {
      const res = await friendshipList(values.name || '');

      setFriendshipResult(
        res.map((item: FriendshipSearchResult) => {
          return {
            ...item,
            key: item.id,
          };
        }),
      );
    } catch (err) {
      message.error(
        (err as AxiosError<{ message: string }>).response?.data?.message ||
          '系统繁忙，请稍后再试',
      );
      console.log(err);
    }
  };

  const [form] = useForm();

  useEffect(() => {
    searchFriend({
      name: form.getFieldValue('name'),
    });
  }, []);
  return (
    <div id="friendship-container">
      <div className="friendship-form">
        <Form
          form={form}
          onFinish={searchFriend}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="名称" name="name">
            <Input></Input>
          </Form.Item>
          <Form.Item label="  ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item label="   ">
            <Button
              type="primary"
              style={{ background: 'green' }}
              onClick={() => setAddFriendModalOpen(true)}
            >
              添加好友
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="friendship-table">
        <Table
          columns={columns}
          dataSource={friendshipResult}
          style={{ width: '1000px' }}
        ></Table>
      </div>
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        handleClose={() => {
          setAddFriendModalOpen(false);
        }}
      ></AddFriendModal>
    </div>
  );
};

export default FriendShip;
