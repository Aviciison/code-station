import { uploadImg } from '@/services/index';
import { getUserInfo, updateUserInfo } from '@/services/user';
import { removeToken } from '@/utils/user-token';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Card, Form, Input, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react';

const EditPerson: React.FC = () => {
  const { userInfo, logout, login } = useModel('global');
  const [loading, setLoading] = useState(false);
  const [headPic, setHeadPic] = useState<string>();
  const [form] = Form.useForm();
  const goLogin = () => {
    removeToken();
    logout();
    history.replace('/login');
  };
  useEffect(() => {
    // 请求拿到用户信息
    const getInfo = async () => {
      if (userInfo.id) {
        try {
          const info = await getUserInfo({ id: userInfo.id });
          console.log(info);
          console.log(form);
          form.setFieldsValue(info);
          if (info.headPic) {
            setHeadPic(info.headPic);
          }
        } catch (e) {
          // 报错重新登录
          console.log(e);
          goLogin();
        }
      } else {
        // id获取失败直接跳转到登录页重新登录
        message.error('获取用户id失败，请重新登录');
        goLogin();
      }
    };
    getInfo();
  }, []);
  // 上传图片操作
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传jpg和png格式的图片');
      return Promise.reject();
    }
    const isLt2M = file.size / 1024 < 200;
    if (!isLt2M) {
      message.error('图片大小不能超过200k');
      return Promise.reject();
    }
    setLoading(true);
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = async () => {
      try {
        const res = await uploadImg(file);
        console.log(res);
        setHeadPic(res);
        message.success('头像上传成功');
        return Promise.resolve(file);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
  };
  // 上传的按钮
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const onFinish = async (values: any) => {
    // console.log(values);
    try {
      const res = await updateUserInfo({
        ...values,
        headPic: headPic,
        id: userInfo.id,
      });
      login(res);
      message.success('更新成功');
      history.replace('/');
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <Card
        title="编辑个人资料"
        bordered={false}
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 10 }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { max: 50, message: '最多输入50个字符' },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' },
              { max: 50, message: '最多输入50个字符' },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="个人简介"
            name="personalProfile"
            rules={[{ max: 200, message: '最多输入200个字符' }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="上传头像"
            // name="headPic"
            valuePropName="headPic"
            rules={[{ required: true, message: '请上传头像' }]}
          >
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {!headPic ? (
                uploadButton
              ) : (
                <img
                  src={headPic}
                  alt="avatar"
                  style={{ width: '100%', borderRadius: '50%' }}
                />
              )}
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditPerson;
