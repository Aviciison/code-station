import { chatroomList } from '@/services/chat';
import { Button, Form, Input, Table, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { history } from '@umijs/max';
import { AddMemberModal } from './AddMemberModal';
import { CreateGroupModal } from './CreateGroupModal';
import { MembersModal } from './MembersModal';
import './index.css';

interface SearchGroup {
  name: string;
}

export interface GroupSearchResult {
  id: number;
  name: string;
  type: boolean;
  userCount: number;
  userIds: Array<number>;
  createTime: Date;
}

const Group = () => {
  const [groupResult, setGroupResult] = useState<Array<GroupSearchResult>>([]);

  const [isMembersModalOpen, setMembersModalOpen] = useState(false);
  const [isMemberAddModalOpen, setMemberAddModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [chatroomId, setChatroomId] = useState<number>(-1);

  // const navigate = useNavigate();

  const columns: ColumnsType<GroupSearchResult> = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (_, record) => {
          return new Date(record.createTime).toLocaleString();
        },
      },
      {
        title: '人数',
        dataIndex: 'userCount',
      },
      {
        title: '操作',
        render: (_, record) => (
          <div>
            <a
              onClick={() => {
                history.push('/chat/chat', { id: record.id });
              }}
            >
              聊天
            </a>
            &nbsp;
            <a
              onClick={() => {
                setChatroomId(record.id);
                setMembersModalOpen(true);
              }}
            >
              详情
            </a>
            &nbsp;
            <a
              onClick={() => {
                setChatroomId(record.id);
                setMemberAddModalOpen(true);
              }}
            >
              添加成员
            </a>
          </div>
        ),
      },
    ],
    [],
  );

  const [form] = useForm();

  const searchGroup = async (values: SearchGroup) => {
    try {
      const res = await chatroomList(values.name || '');
      setGroupResult(
        res
          .filter((item: GroupSearchResult) => {
            return item.type === true;
          })
          .map((item: GroupSearchResult) => {
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
    }
  };

  useEffect(() => {
    searchGroup({
      name: form.getFieldValue('name'),
    });
  }, []);

  return (
    <div id="group-container">
      <div className="group-form">
        <Form
          form={form}
          onFinish={searchGroup}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="名称" name="name">
            <Input></Input>
          </Form.Item>
          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item label=" ">
            <Button
              type="primary"
              style={{ backgroundColor: 'green' }}
              onClick={() => {
                setCreateGroupModalOpen(true);
              }}
            >
              创建群聊
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="group-table">
        <Table
          columns={columns}
          dataSource={groupResult}
          style={{ width: '1000px' }}
        ></Table>
      </div>
      <MembersModal
        isOpen={isMembersModalOpen}
        handleClose={() => {
          setMembersModalOpen(false);
        }}
        chatroomId={chatroomId}
      ></MembersModal>
      <AddMemberModal
        isOpen={isMemberAddModalOpen}
        handleClose={() => {
          setMemberAddModalOpen(false);
          searchGroup({
            name: form.getFieldValue('name'),
          });
        }}
        chatroomId={chatroomId}
      ></AddMemberModal>
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        handleClose={() => {
          setCreateGroupModalOpen(false);
          searchGroup({
            name: form.getFieldValue('name'),
          });
        }}
      ></CreateGroupModal>
    </div>
  );
};

export default Group;
