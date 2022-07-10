import { Layout, Menu } from 'antd';
import React from 'react';
import { useState } from 'react';
import URLInfo from '../components/URLInfo';
const { Header, Content, Footer, Sider } = Layout;
import { LinkOutlined } from '@ant-design/icons';
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
          <div>this is 2 page</div>
        </>
      );
    case '3':
      return (
        <>
          <div>this is 3 page</div>
        </>
      );
    default:
      return <></>;
  }
};

const menuItems = [
  { label: 'URL DIRECTION', key: '1', icon: <LinkOutlined /> }, // 菜单项务必填写 key
  // { label: '菜单项二', key: '2' },
];

const YLayout = () => {
  const [path, setPath] = useState('1');
  const [showBtn, setShowBtn] = useState(true);
  const handelMenuClick = ({ keyPath }) => {
    setPath(keyPath[0]);
  };
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
            defaultSelectedKeys={['1']}
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
