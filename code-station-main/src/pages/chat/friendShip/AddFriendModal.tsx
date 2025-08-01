import { friendAdd } from '@/services/chat';
import { Form, Input, message, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { AxiosError } from 'axios';

interface AddFriendModalProps {
  isOpen: boolean;
  handleClose: Function;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface AddFriend {
  username: string;
  reason: string;
}

const AddFriendModal = (props: AddFriendModalProps) => {
  const [form] = useForm<AddFriend>();

  const handleOk = async () => {
    await form.validateFields();

    const values = form.getFieldsValue();

    try {
      const res = await friendAdd(values);
      message.success('好友申请已发送');
      form.resetFields();
      props.handleClose();
    } catch (err) {
      message.error(
        (err as AxiosError<{ message: string }>).response?.data?.message ||
          '系统繁忙，请稍后再试',
      );
    }
  };
  return (
    <Modal
      title="添加好友"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
      okText={'发送好友请求'}
      cancelText={'取消'}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="添加理由"
          name="reason"
          rules={[{ required: true, message: '请输入添加理由!' }]}
        >
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFriendModal;
