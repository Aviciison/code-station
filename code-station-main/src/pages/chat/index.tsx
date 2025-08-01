// import { Access, useAccess } from '@umijs/max';
import { Menu as AntdMenu, MenuProps } from 'antd';
// import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { Outlet, history } from '@umijs/max';
import './index.less';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '好友',
  },
  {
    key: '2',
    label: '群聊',
  },
  {
    key: '3',
    label: '聊天',
  },
  {
    key: '4',
    label: '收藏',
  },
  {
    key: '5',
    label: '通知',
  },
];

const Chat: React.FC = () => {
  const getSelectedKeys = () => {
    if (location.pathname === '/chat/group') {
      return ['2'];
    } else if (location.pathname === '/chat/chat') {
      return ['3'];
    } else if (location.pathname === '/chat/collection') {
      return ['4'];
    } else if (location.pathname === '/chat/notification') {
      return ['5'];
    } else {
      return ['1'];
    }
  };

  const handleMenuItemClick: MenuProps['onClick'] = (info) => {
    let path = '';
    switch (info.key) {
      case '1':
        path = '/chat';
        break;
      case '2':
        path = '/chat/group';
        break;
      case '3':
        path = '/chat/chat';
        break;
      case '4':
        path = '/chat/collection';
        break;
      case '5':
        path = '/chat/notification';
        break;
    }
    history.push({
      pathname: path,
    });
    // router.navigate(path);
  };
  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={getSelectedKeys()}
          items={items}
          onClick={handleMenuItemClick}
        />
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Chat;
