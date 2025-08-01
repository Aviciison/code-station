import { LockOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { Tabs, message, theme } from 'antd';
// import type { CSSProperties } from 'react';
import { loginService, register } from '@/services/user';
import { loginResponse } from '@/services/user/userType';
import { encryptKey } from '@/utils';
import { setToken } from '@/utils/user-token';
import { history, useModel } from '@umijs/max';
import { useRef, useState } from 'react';

type LoginType = 'registered' | 'login';

const Login: React.FC = () => {
  const { login } = useModel('global');
  // const [messageApi, contextHolder] = message.useMessage();
  const [loginType, setLoginType] = useState<LoginType>('login');
  const formRef = useRef<ProFormInstance>();

  // tab切换
  const TabonChange = (activeKey: LoginType) => {
    setLoginType(activeKey as LoginType);
    // 重置表单
    formRef.current?.resetFields();
  };

  const handleSubmit = async (values: {
    username: string;
    password: string;
    email?: string;
    confirmPassword?: string;
  }) => {
    if (loginType === 'login') {
      try {
        // 前端信息加密
        values.password = encryptKey(values.password);
        // 提交登录请求
        const response: loginResponse = await loginService(values);
        // 拿到用户信息，存储到dva 和存储token
        // dispatch({
        //   type: 'userInfo/addAsync', payload: {
        //     userInfo: response.userInfo
        //   },
        // });
        // 拿到用户信息，存储到useModels 和存储token
        login(response.userInfo);
        setToken(response.accessToken, response.refreshToken);
        // 重置表单
        formRef.current?.resetFields();
        message.success('登录成功');
        // 跳转到首页
        // history.push('/');
        // replace 不可返回
        history.replace('/');
      } catch (error) {
        message.error('登录失败,请检查用户名和密码');
      }
    } else {
      if (values.confirmPassword !== values.password) {
        message.error('两次密码输入不一致');
        return Promise.reject('两次密码输入不一致');
      }
      try {
        const res = await register(values);
        console.log(res);
        message.success('注册成功');
        // 重置表单
        formRef.current?.resetFields();
      } catch (e) {
        message.error('注册失败，请稍后尝试');
      }
    }
  };
  const { token } = theme.useToken();
  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="代码小站"
        containerStyle={{
          backdropFilter: 'blur(4px)',
        }}
        // onReset={reset}
        formRef={formRef}
        subTitle="全球最大的博客平台"
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          ></div>
        }
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: loginType === 'registered' ? '注册' : '登录',
          },
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => TabonChange(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'login'} tab={'账号密码登录'} />
          <Tabs.TabPane key={'registered'} tab={'账号注册'} />
        </Tabs>
        {loginType === 'login' ? (
          <div>
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <UserOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={'用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
            <div
              style={{
                marginBlockEnd: 24,
              }}
            >
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </div>
          </div>
        ) : (
          <div>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <ProFormText.Password
              name="confirmPassword"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'确认密码'}
              rules={[
                {
                  required: true,
                  message: '请再次输入密码！',
                },
              ]}
            />
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <TagOutlined />,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入邮箱！',
                },
                {
                  type: 'email',
                  message: '请输入合法邮箱地址!',
                },
              ]}
              placeholder={'邮箱'}
            ></ProFormText>
            <div
              style={{
                marginBlockEnd: 24,
              }}
            >
              <a
                style={{
                  float: 'right',
                }}
                onClick={() => {
                  setLoginType('login');
                  formRef.current?.resetFields();
                }}
              >
                已有账号密码，去登录
              </a>
            </div>
          </div>
        )}
      </LoginFormPage>
    </div>
  );
};

export default Login;
