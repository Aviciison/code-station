/* eslint-disable react-hooks/rules-of-hooks */
/*
 * @Author: zwz
 * @Date: 2024-04-28 09:21:18
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-29 15:43:40
 * @Description: 请填写简介
 */
import { LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import logo from './assets/logo.png';
import Footer from './components/GlobalFooter';
import Accessible from './pages/accessible';
// import NavRightAvatar from './components/NavRightAvatar'
import { removeToken } from '@/utils/user-token';
// import * as Sentry from '@sentry/react';
import { RunTimeLayoutConfig, history, useModel } from '@umijs/max';
import { useEffect, useState } from 'react';
import './app.less';
// import { getMenuData } from '@ant-design/pro-components';

// 前段监控报错
// Sentry.init({
//   dsn: 'https://5b779a568cc57fbd005be1d2c46357fb@o4507649669529600.ingest.us.sentry.io/4507649675689984', // 换成真实的dsn
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration(),
//   ],
//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// });

// console.log(Sentry, 'Sentry');

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

console.log(process.env, '11111');

// interface MySvgProps {
//   onClick: () => void;
// }

// const PandaSvgg: React.FC<MySvgProps> = ({ onClick }) => (
//   <svg
//     width="1em"
//     onClick={onClick}
//     height="1em"
//     fill="currentColor"
//     viewBox="0 0 1024 1024"
//   >
//     <path
//       className="icon"
//       d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
//     ></path>
//   </svg>
// );

export const layout: RunTimeLayoutConfig = () => {
  const [contentStyle, setContentStyle] = useState({
    display: 'block',
    margin: '24px',
    padding: 'unset',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        setContentStyle({ display: 'block', margin: '0px', padding: 'unset' });
        setIsSmallScreen(true);
      } else {
        setContentStyle({ display: 'block', margin: '24px', padding: 'unset' });
        setIsSmallScreen(false);
      }
    };
    mediaQuery.addListener(handleMediaQueryChange);

    if (mediaQuery.matches) {
      setContentStyle({ display: 'block', margin: '0px', padding: 'unset' });
      setIsSmallScreen(true);
    }

    return () => mediaQuery.removeListener(handleMediaQueryChange);
  }, []);

  const { userInfo, logout } = useModel('global');

  const handLogout = () => {
    logout();
    removeToken();
  };

  const login = () => {
    history.push('/login');
  };

  const goArticle = () => {
    history.push('/article');
  };

  const goPersonalCenter = () => {
    history.push('/personalCenter');
  };

  return {
    title: '代码小站',
    logo: logo,
    menu: {
      locale: false,
    },
    // headerRender: (props: ProLayoutProps) => {
    //   const [flag, setFlag] = useState<boolean>(false);
    //   useEffect(() => {
    //     if (flag) {
    //       // document.getElementById('myP2').addEventListener(
    //       //   'click',
    //       //   function () {
    //       //     alert('你点击了 P 元素!');
    //       //   },
    //       //   true,
    //       // );

    //       window.addEventListener('click', (e: MouseEvent) => {
    //         console.log(
    //           '点击触发',
    //           (e.target as HTMLElement)?.className，
    //           document.getElementById('down'),
    //         );
    //         if ((e.target as HTMLElement)?.className !== 'visible-item') {
    //           setFlag(false);
    //         }
    //       });
    //     }
    //   }, [flag]);
    //   const location = useLocation();
    //   console.log(location, 'location');

    //   console.log(useAppData().routes);
    //   console.log(useAppData().clientRoutes[1]);
    //   const res = useAppData().clientRoutes[1].routes?.filter((item) => {
    //     return !item.hideInMenu && item.name;
    //   });
    //   console.log(res, '1');
    //   const items = res.map((ite) => {
    //     return {
    //       key: ite.path,
    //       label: ite.name as string,
    //     };
    //   });

    //   return (
    //     <div className="code-station-top">
    //       <div className="code-station-top-left">
    //         <img className="code-station-top-left-logo" src={logo} />
    //         {!props.isMobile ? (
    //           <div className="code-station-top-left-title">{props.title} </div>
    //         ) : (
    //           <div className="code-station-top-left-title">
    //             首页
    //             <span>
    //               <PandaSvgg onClick={() => setFlag(!flag)}></PandaSvgg>
    //               {/* <CaretDownOutlined
    //                 className="in"
    //                 id="down"
    //                 onClick={() => setFlag(!flag)}
    //               /> */}
    //             </span>
    //             {flag ? (
    //               <div className="visible">
    //                 {items.map((item, index) => {
    //                   return (
    //                     <div
    //                       key={index}
    //                       className={classnames('visible-item', {
    //                         'visible-choose': item.key === location.pathname,
    //                       })}
    //                     >
    //                       {item.label}
    //                     </div>
    //                   );
    //                 })}
    //               </div>
    //             ) : (
    //               ''
    //             )}
    //           </div>
    //         )}
    //       </div>
    //       <div className="code-station-top-right">
    //         {userInfo.username && !isSmallScreen ? (
    //           <Button
    //             style={{ width: '80px', marginRight: '20px' }}
    //             type="primary"
    //             onClick={goArticle}
    //             key="first"
    //           >
    //             写文章
    //           </Button>
    //         ) : null}
    //         <div>
    //           <div className="code-station-top-right-headPic">
    //             {userInfo.headPic ? (
    //               <Dropdown
    //                 menu={{
    //                   items: [
    //                     {
    //                       key: 'logout',
    //                       icon: <LogoutOutlined />,
    //                       label: <div onClick={handLogout}>立即退出</div>,
    //                     },
    //                     {
    //                       key: 'personalCenter',
    //                       icon: <UserOutlined />,
    //                       label: <div onClick={goPersonalCenter}>个人中心</div>,
    //                     },
    //                   ],
    //                 }}
    //               >
    //                 <div>
    //                   <img src={userInfo.headPic}></img>
    //                   {!props.isMobile ? (
    //                     <span className="code-station-top-right-username">
    //                       {userInfo.username}
    //                     </span>
    //                   ) : (
    //                     ''
    //                   )}
    //                 </div>
    //               </Dropdown>
    //             ) : (
    //               <Button onClick={login}>登录</Button>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // },
    contentStyle: contentStyle,
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,
    footerRender: () => <Footer></Footer>,
    token: {
      header: {
        heightLayoutHeader: 60,
      },
    },
    actionsRender: (props) => {
      if (props.isMobile) return [];
      return [
        userInfo.username ? (
          <Button
            style={{ width: '80px' }}
            type="primary"
            key="first"
            onClick={goArticle}
          >
            <span>写文章</span>
          </Button>
        ) : null,
        // props.layout !== 'side' && document.body.clientWidth > 1400 ? (
        //   <SearchInput />
        // ) : undefined,
        // <InfoCircleFilled key="InfoCircleFilled" />,
        // <QuestionCircleFilled key="QuestionCircleFilled" />,
        // <GithubFilled key="GithubFilled" />,
      ];
    },
    // (layoutProps: HeaderProps) => {
    //   return [
    //     userInfo.username ? (
    //       <Button
    //         style={{ width: '80px' }}
    //         type="primary"
    //         onClick={goArticle}
    //         key="first"
    //       >
    //         写文章
    //       </Button>
    //     ) : null,
    //   ],
    // }

    onCollapseChange: (collapsed: boolean) => {
      console.log(collapsed, 'collapsed');
    },
    avatarProps: {
      src: userInfo.headPic ? userInfo.headPic : '',
      title: userInfo.username ? (
        userInfo.username
      ) : (
        <Button onClick={login}>登录</Button>
      ),
      render: (props, dom) => {
        if (userInfo.username) {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: <div onClick={handLogout}>立即退出</div>,
                  },
                  {
                    key: 'personalCenter',
                    icon: <UserOutlined />,
                    label: <div onClick={goPersonalCenter}>个人中心</div>,
                  },
                ],
              }}
            >
              {/* <div></div>
              <img
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                src={userInfo.headPic}
                alt=""
              /> */}
              {dom}
            </Dropdown>
          );
        } else {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'login',
                    icon: <LoginOutlined />,
                    label: <div onClick={login}>立即登录</div>,
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        }
      },
    },
    unAccessible: <Accessible></Accessible>,
  };
};

// export const layout: RunTimeLayoutConfig = () => {
//   return {
//     // 自定义 403 页面
//     unAccessible: <div>'unAccessible'</div>,
//     // 自定义 404 页面
//     noFound: <div>'noFound'</div>,
//   };
// };
