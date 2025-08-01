import { groupMembers } from '@/services/chat';
import { message, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export interface MembersModalProps {
  isOpen: boolean;
  chatroomId: number;
  handleClose: () => void;
}

export interface User {
  id: number;
  username: string;
  headPic: string;
  email: string;
}
export function MembersModal(props: MembersModalProps) {
  const [members, setMembers] = useState<Array<User>>();

  const queryMembers = async () => {
    try {
      const res = await groupMembers(props.chatroomId);

      setMembers(
        res.map((item: User) => {
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

  useEffect(() => {
    queryMembers();
  }, [props.chatroomId]);

  const columns: ColumnsType<User> = [
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
      dataIndex: 'headPic',
      render: (_, record) => {
        return (
          <div>
            <img src={record.headPic} width={50} height={50} />
          </div>
        );
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
  ];

  return (
    <Modal
      title="群聊成员"
      onCancel={() => props.handleClose()}
      onOk={() => props.handleClose()}
      open={props.isOpen}
      width={1000}
    >
      <Table columns={columns} dataSource={members} pagination={false}></Table>
    </Modal>
  );
}
