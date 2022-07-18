import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import URLInfo from '../components/URLInfo';
import RequestHeader from '../components/RequestHeader';
import Cookies from '../components/Cookies';
const { Header, Content, Sider } = Layout;
import { LinkOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { getChromeStorage, setChromeStorage } from '../utils';
import './index.less';

const YContents = ({ index, showBtn }) => {
  switch (index) {
    case '1':
      return (
        <>
          <URLInfo showBtn={showBtn} />
        </>
      );
    case '2':
      return (
        <>
          <RequestHeader />
        </>
      );
    case '3':
      return (
        <>
          <Cookies showBtn={showBtn} />
        </>
      );
    default:
      return <></>;
  }
};

const menuItems = [
  { label: 'URL DIRECTION', key: '1', icon: <LinkOutlined /> }, // 菜单项务必填写 key
  { label: 'REQUEST HEADERS', key: '2', icon: <DeploymentUnitOutlined /> },
  {
    label: 'COOKIES',
    key: '3',
    icon: <div className="y-cookies-icon"></div>,
  },
];

const YLayout = () => {
  const [path, setPath] = useState('1');
  const [showBtn, setShowBtn] = useState(true);
  const handelMenuClick = ({ keyPath }) => {
    setPath(keyPath[0]);
    setChromeStorage('__y_fetools_defaultSelectedKeys', 'path', keyPath[0]);
  };

  const getSelectedPath = async () => {
    const selectedPath = await getChromeStorage(
      '__y_fetools_defaultSelectedKeys',
      'path'
    );
    console.log('selectedPath-->', selectedPath);
    setPath(selectedPath || '1');
  };

  useEffect(() => {
    getSelectedPath();
  }, []);

  return (
    <div className="y-contents">
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
            setShowBtn(collapsed);
          }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[path]}
            onClick={handelMenuClick}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0 }}>
            <div className="header-title">Y-FE DevTools</div>
          </Header>
          <Content>
            <div className="site-layout-background">
              <YContents index={path} showBtn={showBtn} />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default YLayout;
